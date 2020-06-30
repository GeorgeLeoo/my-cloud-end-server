const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const Tickets = new Schema({
	tel: String,
  msg: String,
	/**
	 * 数据状态
	 * 0 表成功
	 * 1 表示失败
	 */
	status: {
		type: Number,
		default: 0,
	},
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: date,
	},
})

module.exports = db.model('Tickets', Tickets)
