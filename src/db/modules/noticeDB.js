const Notices = require('../../model/notices')
const { ResponseCode } = require('../../config')

/**
 * 查询公告
 * @returns {Promise<unknown>}
 */
function getNotice () {
  return new Promise(async resolve => {
    Notices.find({}, (err, notices) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: notices })
      }
    })
  })
}

/**
 * 创建公告
 * @param title 标题
 * @param content 内容
 * @returns {Promise<unknown>}
 */
function createNotice ({ content }) {
  return new Promise(resolve => {
    Notices.insertMany(
      { content },
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
 * 更新公告
 * @param id
 * @param title 公告标题
 * @param content 公告内容
 * @returns {Promise<unknown>}
 */
function updateNotice ({ id, content }) {
  return new Promise(resolve => {
    Notices.updateMany(
      { _id: id },
      { $set: { content } },
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
  getNotice,
  createNotice,
  updateNotice
}
