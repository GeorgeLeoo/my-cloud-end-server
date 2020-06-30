const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const EventLogs = new Schema({
	/**
	 * ip
	 */
	ip: {
		type: String,
	},
	/**
	 * 登录城市
	 */
	loginCity: String,
	/**
	 * 事件名
	 */
	event: String,
	/**
	 * 页面
	 */
	page: String,
	/**
	 * 平台
	 * 1: 手机端
	 * 2: 电脑端
	 */
	platform: Number,
	tel: String,
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: date,
	},
})

module.exports = db.model('EventLogs', EventLogs)
