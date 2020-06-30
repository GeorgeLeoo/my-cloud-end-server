const Tickets = require('../../model/tickets')
const configDate = require('../../config/modules/date')
const { ResponseCode } = require('../../config')
const { getCount } = require('./utils')

/**
 * 创建罚单日志
 * @returns {Promise<unknown>}
 */
function createTickets ({ tel, status, msg }) {
  return new Promise(async resolve => {
    Tickets.insertMany({ tel, status, msg }, (err, tickets) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: tickets })
      }
    })
  })
}

/**
 * 查询罚单日志
 * @param query 查询条件
 * @param page  分页信息
 * @returns {Promise<unknown>}
 */
function getTickets ({ query = {}, page = { pageNumber: 1, pageSize: 20 } }) {
  return new Promise(async resolve => {
    const count = await getCount(Tickets)
    Tickets.find(query, (err, tickets) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: tickets, total: count } })
      }
    }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}

async function getTodayTimes (Tickets) {
  let todayTimes = 0
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let query = {}
  let and = []
  and.push({ 'createdAt': { $gt: new Date(`${year}-${month}-${day} 00:00:00`) } })
  and.push({ 'createdAt': { $lt: new Date(`${year}-${month}-${day} 23:59:59`) } })
  query = { $and: and }
  todayTimes = await getCount(Tickets, query)
  return todayTimes
}

function getTicketMonth (query = {}) {
  return new Promise(async resolve => {
    const todayTimes = await getTodayTimes(Tickets)
    const allTimes = await getCount(Tickets)
    Tickets.aggregate([{ $match: query }, {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        }, total: { $sum: 1 }
      }
    }], function (err, doc) {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: doc, all: allTimes, today: todayTimes } })
      }
    })
  })
}

module.exports = {
  createTickets,
  getTickets,
  getTicketMonth
}
