const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const Admins = new Schema({
	user: {
		type: String,
		unique: true,
	}, // 工号
	pwd: String, // 密码
	/**
	 * 是否登录状态
	 * 0: 在线
	 * 1：离线
	 */
	isLogin: Number,
	/**
	 * 权限
	 * 0：超级管理员
	 * 1：客服
	 */
	privilege: {
		type: Number,
		default: 1,
	},
	privilege2: {
		type: Array,
		default: [],
	},
	/**
	 * 数据状态
	 * 0 表示存在
	 * 1 表示删除
	 * 默认 0
	 */
	status: {
		type: Number,
		default: 0,
	},
	/**
	 * 修改时间
	 */
	lastModified: {
		type: Date,
		default: date,
	},
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: date,
	},
})

module.exports = db.model('Admin', Admins)
