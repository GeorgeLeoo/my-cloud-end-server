const express = require("express");
const UserRouter = express.Router();
const UserDB = require("./../model/users");

UserRouter.post("/current", async function (req, res) {
  const body = req.body
  console.log(body)
  res.send({code: 200})
});

UserRouter.post("/logout", async function (req, res) {
  const body = req.body
  console.log(body)
  res.send({code: 200})
});

UserRouter.post("/sign-in", async function (req, res) {
  const body = req.body
  console.log(body)
  res.send({code: 200})
});

UserRouter.post("/sign-up", async function (req, res) {
  const body = req.body
  console.log(body)
  res.send({code: 200})
});

module.exports = UserRouter