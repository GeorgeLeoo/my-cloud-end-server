const LoginLogs = require('../../model/login_logs')
const { ResponseCode } = require('../../config')
const { getCount } = require('./utils')

/**
 * 创建登录日志
 * @returns {Promise<unknown>}
 */
function createLoginLogs({ ip, loginCity, loginState, reason, platform }) {
  return new Promise(async resolve => {
    LoginLogs.insertMany({ ip, loginCity, loginState, reason, platform }, (err, notices) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: notices })
      }
    })
  })
}


/**
 * 查询登录日志
 * @param query 查询条件
 * @param page  分页信息
 * @returns {Promise<unknown>}
 */
function getLoginLogs ({ query = {}, page = { pageNumber: 1, pageSize: 20 } }) {
  return new Promise(async resolve => {
    const count = await getCount(LoginLogs)
    LoginLogs.find(query, (err, loginLogs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: loginLogs, total: count } })
      }
    }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}

module.exports = {
  createLoginLogs,
  getLoginLogs
}
