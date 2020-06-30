const db = require('../db/conn')
const Schema = db.Schema
const QueryTimes = new Schema({
  /**
   * 管理员uid
   */
	uid: {
    type: String,
    default: ''
  },
  /**
   * 客户uid
   */
  client_uid: {
    type: String,
    default: ''
  },
  /**
   * IN 充值
   * OUT 扣除
   */
  type: {
    type: String,
    default: ''
  },
  times: {
    type: Number,
    default: 0
  }, 
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: new Date(),
	},
})

module.exports = db.model('QueryTimes', QueryTimes)
