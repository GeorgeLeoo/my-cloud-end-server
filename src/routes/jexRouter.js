const express = require("express");
const JexRouter = express.Router();
const dbJson = require("../json/db.json");
const keys = Object.keys(dbJson);

keys.forEach((v) => {
  JexRouter.post("/get/" + v, async function (req, res) {
    const { query, page, order } = req.body;
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
    const DB = require(dbJson[v])
    DB.find(query, (err, docs) => {
      if (err) {
        res.status(500);
        res.send({ code: 1, msg: err });
      } else {
        res.status(200);
        res.send({ code: 0, data: docs });
      }
    })
    .limit(parseInt(page.limitNumber))
    .skip((parseInt(page.skipNumber) - 1) * parseInt(page.limitNumber))
    .sort(orderMap)
  });

  JexRouter.post("/get/count/" + v, async function (req, res) {
    const body = req.body
    console.log(body)
    const DB = require(dbJson[v])
    DB.countDocuments(body, function (err, count) {
      if (err) {
        res.status(500);
        res.send({ code: 1, msg: err });
      } else {
        res.status(200);
        res.send({ code: 0, count });
      }
    })
  });

  JexRouter.post("/post/" + v, function (req, res) {
    const body = req.body;
    const _id = body._id
    delete body._id
    const { data, query } = body
    if (_id) {
      query = { _id }
    } 
    console.log(query, data);
    if (Object.keys(query).length > 0) {
      require(dbJson[v]).updateMany(query, { $set: data }, (err, docs) => {
        if (err) {
          res.status(500);
          res.send({ code: 1, msg: "server error:" + err });
        } else {
          res.status(200);
          res.send({ code: 0, data: docs });
        }
      });
    } else {
      require(dbJson[v]).insertMany(data, (err, docs) => {
        if (err) {
          res.status(500);
          res.send({ code: 1, msg: "server error:" + err });
        } else {
          res.status(200);
          res.send({ code: 0, data: docs });
        }
      });
    }
  });

  JexRouter.post("/delete/" + v, function (req, res) {
    const body = req.body;
    require(dbJson[v]).remove(body, (err, docs) => {
      if (err) {
        res.status(500);
        res.send({ code: 1, msg: err });
      } else {
        res.status(200);
        res.send({ code: 0, data: docs });
      }
    });
  });
});

module.exports = JexRouter;
