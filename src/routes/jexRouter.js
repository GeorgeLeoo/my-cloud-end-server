const express = require('express')
const JexRouter = express.Router()
const dbJson = require('../json/db.json')
const keys = Object.keys(dbJson)

keys.forEach((v) => {
  JexRouter.post('/get/' + v, async function (req, res) {
    const { query, page, order, selects = [], unSelects = [], reference = [] } = req.body
    const orderMap = {}
    if (order) {
      const orderKeys = Object.keys(order)
      if (orderKeys.length > 0) {
        if (order[orderKeys[0]] === 'desc') {
          orderMap[orderKeys[0]] = '-1'
        }
        if (order[orderKeys[0]] === 'asc') {
          orderMap[orderKeys[0]] = '1'
        }
      }
    }
    const selectMap = {}
    selects.map(v => {
      selectMap[v] = 1
    })
    if (!selects.includes('_id')) {
      selectMap['_id'] = 0
    }
    unSelects.map(v => {
      selectMap[v] = 0
    })
    console.log(query, reference)
    const DB = require(dbJson[v])
    DB.find(query, selectMap)
      .populate(reference)
      .limit(parseInt(page.limitNumber))
      .skip((parseInt(page.skipNumber) - 1) * parseInt(page.limitNumber))
      .sort(orderMap)
      .exec((err, docs) => {
        if (err) {
          res.status(500)
          res.send({ code: 1, msg: err })
        } else {
          res.status(200)
          res.send({ code: 0, data: docs })
        }
      })
  })
  
  JexRouter.post('/get/count/' + v, async function (req, res) {
    const body = req.body
    console.log(body)
    const DB = require(dbJson[v])
    DB.countDocuments(body, function (err, count) {
      if (err) {
        res.status(500)
        res.send({ code: 1, msg: err })
      } else {
        res.status(200)
        res.send({ code: 0, count })
      }
    })
  })
  
  JexRouter.post('/post/' + v, function (req, res) {
    const body = req.body
    const _id = body._id
    delete body._id
    let { data, query } = body
    if (_id) {
      query = { _id }
    }
    console.log(query, data)
    if (Object.keys(query).length > 0) {
      require(dbJson[v]).updateMany(query, { $set: data }, (err, docs) => {
        if (err) {
          res.status(500)
          res.send({ code: 1, msg: 'server error:' + err })
        } else {
          if(docs.n === 1 && docs.ok === 1 && docs.nModified === 1) {
            res.status(200)
            res.send({ code: 200, msg: 'ok' })
          } else {
            res.status(200)
            res.send({ code: 200, msg: 'fail' })
          }
        }
      })
    } else {
      require(dbJson[v]).insertMany(data, (err, docs) => {
        if (err) {
          res.status(500)
          res.send({ code: 1, msg: 'server error:' + err })
        } else {
          res.status(200)
          res.send({ code: 0, data: docs })
        }
      })
    }
  })
  
  JexRouter.post('/delete/' + v, function (req, res) {
    const body = req.body
    require(dbJson[v]).remove(body, (err, docs) => {
      if (err) {
        res.status(500)
        res.send({ code: 1, msg: err })
      } else {
        res.status(200)
        res.send({ code: 0, data: docs })
      }
    })
  })
  
  JexRouter.post('/increment/' + v, function (req, res) {
    const { _id, incrementObj = {} } = req.body
    if (typeof _id !== 'string') {
      res.send({ code: 1, msg: '_id必须是字符串' })
      return
    }
    if (!_id) {
      res.send({ code: 1, msg: '_id不能为空' })
      return
    }
    if (Object.keys(incrementObj).length === 0) {
      res.send({ code: 1, msg: '至少要设置计数的字段名称' })
      return
    }
    if (typeof incrementObj[Object.keys(incrementObj)[0]] !== 'number') {
      res.send({ code: 1, msg: '增加值必须是数字类型' })
      return
    }
    require(dbJson[v]).updateMany({ _id }, { $inc: incrementObj },(err, docs) => {
      if (err) {
        res.status(500)
        res.send({ code: 1, msg: 'server error:' + err })
      } else {
        if(docs.n === 1 && docs.ok === 1 && docs.nModified === 1) {
          res.status(200)
          res.send({ code: 200, msg: 'ok' })
        } else {
          res.status(200)
          res.send({ code: 200, msg: 'fail' })
        }
      }
    })
  })
})

module.exports = JexRouter
