const DriverLicense = require('../../model/driving_licence')
const { ResponseCode } = require('../../config')
const { getCount } = require('./utils')

/**
 * 创建罚单日志
 * @returns {Promise<unknown>}
 */
function createDriverLicense ({ tel, status, msg }) {
  return new Promise(async resolve => {
    DriverLicense.insertMany({ tel, status, msg }, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: docs })
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
function getDriverLicense ({ query = {}, page = { pageNumber: 1, pageSize: 20 } }) {
  return new Promise(async resolve => {
    const count = await getCount(DriverLicense)
    DriverLicense.find(query, (err, tickets) => {
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

async function getTodayTimes (DriverLicense) {
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
  todayTimes = await getCount(DriverLicense, query)
  return todayTimes
}

function getDriverLicenseMonth (query = {}) {
  return new Promise(async resolve => {
    const todayTimes = await getTodayTimes(DriverLicense)
    const allTimes = await getCount(DriverLicense)
    DriverLicense.aggregate([{ $match: query }, {
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
  createDriverLicense,
  getDriverLicense,
  getDriverLicenseMonth
}
