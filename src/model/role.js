const db = require('../db/conn')
const Schema = db.Schema
const Roles = new Schema({
	name: {
		type: String,
		unique: true,
	}, // 角色名
	count: String, // 上限查询次数
	state: Boolean, // 是否需要后台管理系统权限
	status: {
		type: Number,
		default: 0,
	},
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: new Date(),
	},
})

module.exports = db.model('Roles', Roles)
