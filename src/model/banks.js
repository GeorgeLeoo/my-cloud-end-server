const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const Banks = new Schema({
  name: String,   // 银行名称
  url: String,    // 银行链接
  users: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  /**
   * 数据状态
   * 0 表示存在
   * 1 表示删除
   */
  status: {
    type: Number,
    default: 0
  },
  /**
   * 修改时间
   */
  lastModified: {
    type: Date,
    default: date
  },
  /**
   * 创建时间
   */
  createdAt: {
    type: Date,
    default: date
  }
})

module.exports = db.model('Banks', Banks)
