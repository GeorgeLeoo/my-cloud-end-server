const TicketHistories = require('../../model/ticket_histories')
const { getCount } = require('./utils')
const { ResponseCode } = require('../../config')

/**
 * 创建历史罚单
 * @param data
 * @returns {Promise<unknown>}
 */
function createTicketHistory (data) {
  return new Promise(resolve => {
    TicketHistories.insertMany(
      data,
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS })
        }
      })
  })
}

/**
 * 查询历史罚单
 * @returns {Promise<unknown>}
 */
function getTicketHistories ({ query, page = { pageNumber: 1, pageSize: 20 } }) {
  return new Promise(async resolve => {
    const count = await getCount(TicketHistories, query)
    TicketHistories.find(
      query ,
      (err, docs) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err, data: { list: [], total: 0 } })
        } else {
          resolve({ code: ResponseCode.SUCCESS, data: { list: docs, total: count } })
        }
      }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}

module.exports = {
  createTicketHistory,
  getTicketHistories
}
