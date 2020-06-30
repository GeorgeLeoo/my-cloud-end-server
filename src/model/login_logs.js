const db = require('../db/conn')
const Schema = db.Schema
const LoginLogs = new Schema({
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
	 * 是否登录状态
	 * 0: 成功
	 * 1：失败
	 */
	loginState: Number,
	/**
	 * 原因
	 */
	reason: String,
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
		default: new Date(),
	},
})

module.exports = db.model('LoginLogs', LoginLogs)
