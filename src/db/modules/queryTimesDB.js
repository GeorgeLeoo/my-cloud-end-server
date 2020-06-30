const QueryTimes = require('../../model/query-times')
const { getCount } = require('./utils')
const { ResponseCode } = require('../../config')


/**
 * 查询充值次数
 * @returns {Promise<unknown>}
 */
function getQueryTimes ({ client_uid, page = { pageNumber: 1, pageSize: 20 } }) {
  return new Promise(async resolve => {
    const count = await getCount(QueryTimes, { client_uid })
    QueryTimes.find({ client_uid }, (err, times) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err, data: { list: [], total: 0 } })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: times, total: count } })
      }
    }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}

/**
 * 创建充值次数
 * @returns {Promise<unknown>}
 */
function createQueryTimes ({ uid, client_uid, type, times }) {
  return new Promise(resolve => {
    QueryTimes.insertMany(
      { uid, client_uid, type, times },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '充值成功' })
        }
      })
  })
}

module.exports = {
  createQueryTimes,
  getQueryTimes
}
