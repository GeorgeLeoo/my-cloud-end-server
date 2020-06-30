const moment = require('moment')

const Users = require('../../model/users')
const Roles = require('../../model/role')
const RoleDB = require('./roleDB')
const { AccountStatus, ResponseCode, YES, NO } = require('../../config')
const { OPEN_OR_CLOSE_ACCOUNT_MAP } = require('./map')
const { getCount } = require('./utils')

/**
 * 通过手机和密码查询用户信息
 * @param tel 手机
 * @param pwd 密码
 * @returns {Promise<unknown>}
 */
function getUserByTelAndPwd ({ tel, pwd }) {
  return new Promise(async resolve => {
    Users.find({ tel, pwd, status: YES }, async (err, users) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else if (users.length === 0) {
        resolve({ code: ResponseCode.CLIENT_ERROR, msg: '账号或密码错误！' })
      } else {
        // 生成token
        let token = utils.accessToken({ tel })
        const hasRights = await RoleDB.hasRights(users[0].privilege)
        resolve({ code: ResponseCode.SUCCESS, data: { token: token.token, uid: users[0]._id }, isStop: users[0].isStop !== YES, hasRights })
      }
    })
  })
}

/**
 * 通过账号查询用户信息
 * @param tel 手机
 * @param pwd 密码
 * @returns {Promise<unknown>}
 */
function getUserByTel ({ tel }) {
  return new Promise(resolve => {
    Users.findOne({ tel }, (err, user) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: user })
      }
    })
  })
}

/**
 * 根据 UID 查询用户信息
 * @param uid
 * @param showPwd
 * @returns {Promise<unknown>}
 */
function getUserByUID (uid, showPwd = false) {
  return new Promise((resolve) => {
    Users.find({ _id: uid }, { pwd: showPwd ? 1 : 0 },(err, users) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: users })
      }
    })
  })
}

/**
 * 查看所有用户
 * @param query
 * @param page
 * @returns {Promise<unknown>}
 */
function getAllUsers ({ query = {}, page = { pageNumber: 1, pageSize: 20 } }) {
  return new Promise(async resolve => {
    const count = await getCount(Users, query)
    Users.find(query, (err, users) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: users, total: count } })
      }
    }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}
function getAllUsersChange (query={}) {
  return new Promise(async resolve => {
    Users.find({}, (err, users) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: users })
      }
    }).sort({ '_id': -1 })
  })
}

/**
 * 启动或关闭账号
 * @param uid
 * @param status AccountStatus枚举
 * @returns {Promise<unknown>}
 */
function openOrCloseAccount ({ uid, accountStatus }) {
  return new Promise(resolve => {
    Users.updateMany(
      { _id: uid },
      { $set: { isStop: AccountStatus.OPEN === accountStatus ? YES : NO } },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: OPEN_OR_CLOSE_ACCOUNT_MAP[accountStatus] })
        }
      })
  })
}

/**
 * 根据 UID 删除账号
 * @param uid
 * @returns {Promise<unknown>}
 */
function deleteUserByUID (uid) {
  return new Promise(resolve => {
    Users.updateMany(
      { _id: uid },
      { $set: { status: NO } },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '删除成功' })
        }
      })
  })
}

/**
 * 更新密码
 * @param uid
 * @param pwd
 * @returns {Promise<unknown>}
 */
function updatePwdByUID ({ uid, pwd }) {
  return new Promise(resolve => {
    Users.updateMany(
      { _id: uid },
      { $set: { pwd } },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '修改成功' })
        }
      })
  })
}

function updateUserByAdmin ({ id, query }) {
  return new Promise(resolve => {
    Users.updateMany(
      { _id: id },
      { $set: query },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '更新成功' })
        }
      })
  })
}

/**
 *
 * @param id
 * @param privilege
 * @param lastDate
 * @returns {Promise<unknown>}
 */
function updateUserQueryTimes ({ id, restQueryTimes }) {
  return new Promise(resolve => {
    Users.updateMany(
      { _id: id },
      { $set: { restQueryTimes } },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '充值成功' })
        }
      })
  })
}

/**
 * 查询次数减1
 * @returns {Promise<unknown>}
 */
function minusQueryTimes ({ id, minus }) {
  return new Promise(resolve => {
    let inc = { restQueryTimes: -1 }
    if (minus) {
      inc = { restQueryTimes: -(minus) }
    }
    Users.updateMany(
      { _id: id },
      { $inc: inc },
      (err, doc) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '' })
        }
      }
    )
  })
}

/**
 * 账号创建
 * @returns {Promise<unknown>}
 */
function createUser (query) {
  return new Promise(resolve => {
    Users.insertMany(
      query,
      (err, doc) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '账号创建成功' })
        }
      }
    )
  })
}

function getDate(privilege, lastDate = new Date()) {
  return new Promise((resolve, reject) => {
    Roles.find({}, function (err, doc) {
      if (err) {
        reject()
        return
      }
      for (let item of doc) {
        if (item._id.toString() === privilege) {
          let date
          if (item.name.includes('月')) {
            const arr = item.name.split('个')
            date = moment().add(Number(arr[0]), 'M')
          } else if (item.name.includes('年')) {
            const arr = item.name.split('年')
            date = moment().add(Number(arr[0]), 'y')
          } else {
            date = lastDate
          }
          resolve(date)
          break
        }
      }
      reject()
    })
  })
}



module.exports = {
  getUserByTel,
  getUserByTelAndPwd,
  getUserByUID,
  getAllUsers,
  openOrCloseAccount,
  deleteUserByUID,
  updatePwdByUID,
  getAllUsersChange,
  updateUserByAdmin,
  updateUserQueryTimes,
  minusQueryTimes,
  createUser,
  getDate
}
