/**
 * 反馈
 */
const Feedback = require('../../model/feedbacks')
const { ResponseCode, NO } = require('../../config')
const { getCount } = require('./utils')

/**
 * 查询所有反馈信息，支持条件查询
 * @param query 查询条件
 * @param page  分页信息
 * @returns {Promise<unknown>}
 */
function getFeedback (query = {}, page = { pageNumber: 1, pageSize: 20 }) {
  return new Promise(async resolve => {
    const count = await getCount(Feedback)
    Feedback.find(query, (err, Feedback) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: Feedback, total: count } })
      }
    }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}

/**
 * 创建反馈信息
 * @param name 反馈名称
 * @param url 反馈链接
 * @returns {Promise<unknown>}
 */
function createFeedback ({ name, url }) {
  return new Promise(resolve => {
    Feedback.insertMany(
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
 * 通过 id 更新反馈信息
 * @param name  反馈名称
 * @param url 反馈 url
 * @returns {Promise<unknown>}
 */
function updateFeedbackByID ({ name, url, id }) {
  return new Promise(resolve => {
    Feedback.updateMany(
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
 * 根据反馈 id 删除
 * @param id
 * @returns {Promise<unknown>}
 */
function deleteFeedbackByID (id) {
  return new Promise(resolve => {
    Feedback.updateMany(
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
  getFeedback,
  createFeedback,
  updateFeedbackByID,
  deleteFeedbackByID
}
