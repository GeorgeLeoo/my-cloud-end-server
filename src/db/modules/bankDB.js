const Banks = require('../../model/banks')
const { ResponseCode, NO } = require('../../config')
const { getCount } = require('./utils')

/**
 * 查询所有银行信息，支持条件查询
 * @param query 查询条件
 * @param page  分页信息
 * @returns {Promise<unknown>}
 */
function getBanks (query = {}, page = { pageNumber: 1, pageSize: 20 }) {
  return new Promise(async resolve => {
    const count = await getCount(Banks)
    Banks.find(query, (err, banks) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: banks, total: count } })
      }
    }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}

/**
 * 创建银行信息
 * @param name 银行名称
 * @param url 银行链接
 * @returns {Promise<unknown>}
 */
function createBanks ({ name, url }) {
  return new Promise(resolve => {
    Banks.insertMany(
      { name, url },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '添加成功' })
        }
      })
  })
}

/**
 * 通过 id 更新银行信息
 * @param name  银行名称
 * @param url 银行 url
 * @returns {Promise<unknown>}
 */
function updateBanksByID ({ name, url, id }) {
  return new Promise(resolve => {
    Banks.updateMany(
      { _id: id },
      { $set: { name, url } },
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
 * 根据银行 id 删除
 * @param id
 * @returns {Promise<unknown>}
 */
function deleteBankByID (id) {
  return new Promise(resolve => {
    Banks.updateMany(
      { _id: id },
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

module.exports = {
  getBanks,
  createBanks,
  updateBanksByID,
  deleteBankByID
}
