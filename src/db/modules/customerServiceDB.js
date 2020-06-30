const CustomerServices = require('../../model/customer_services')
const { ResponseCode } = require('../../config')

/**
 * 查询客服
 * @returns {Promise<unknown>}
 */
function getCustomerService () {
  return new Promise(async resolve => {
    CustomerServices.find({}, (err, customerServices) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: customerServices })
      }
    })
  })
}

/**
 * 创建客服
 * @param title 标题
 * @param content 内容
 * @returns {Promise<unknown>}
 */
function createCustomerService ({ title, content }) {
  return new Promise(resolve => {
    CustomerServices.insertMany(
      { info: content },
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
 * 更新客服
 * @param id
 * @param title 客服标题
 * @param content 客服内容
 * @returns {Promise<unknown>}
 */
function updateCustomerService ({ id, content }) {
  return new Promise(resolve => {
    CustomerServices.updateMany(
      { _id: id },
      { $set: { info: content } },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '更新成功' })
        }
      })
  })
}

module.exports = {
  getCustomerService,
  createCustomerService,
  updateCustomerService
}
