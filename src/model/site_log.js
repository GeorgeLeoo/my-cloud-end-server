const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const SiteLogs = new Schema({
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
	 * 站点停留时间
	 */
	stayTime: String,
	/**
	 * 平台
	 * 1: 手机端
	 * 2: 电脑端
	 */
	platform: Number,
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: date,
	},
})

module.exports = db.model('SiteLogs', SiteLogs)
