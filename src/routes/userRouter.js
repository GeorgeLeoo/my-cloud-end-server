
const express = require('express')
const UserRouter = express.Router()
const Users = require('./../model/users')
const { setValue, delValue } = require('./../utils')

UserRouter.post('/current', async function (req, res) {
  const body = req.body
  console.log(body)
  res.send({ code: 200 })
})

UserRouter.post('/logout', async function (req, res) {
  const body = req.body
  console.log(body)
  const token = req.headers["jex-token"];
  delValue(token)
  res.send({ code: 200, msg: 'ok' })
})

UserRouter.post('/sign-in', async function (req, res) {
  const body = req.body
  console.log(body)
  Users.find({ username: body.username, password: body.password }, async (err, users) => {
    if (err) {
      res.send({ code: 0, msg: err })
    } else if (users.length === 0) {
      res.send({ code: 0, msg: '账号或密码错误' })
    } else {
      // 生成token
      let token = utils.accessToken({ username: body.username })
      // 存储当前用户到redis，实现在线人数
      const data = users[0]
      if (data && data.uid && data.token) {
        setValue(data.token, data.uid)
      }
      res.send({ code: 200, msg: 'ok', token: token.token, uid: data._id })
    }
  })
  
})

UserRouter.post('/sign-up', async function (req, res) {
  const body = req.body
  console.log(body)
  Users.insertMany(
    body,
    (err, doc) => {
      if (err) {
        res.send({ code: 0, msg: err })
      } else {
        res.send({ code: 200, msg: 'ok' })
      }
    }
  )
})

module.exports = UserRouter
