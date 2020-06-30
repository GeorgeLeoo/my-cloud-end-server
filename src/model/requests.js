const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const Requests = new Schema({
	licenseNumber: String, // 车牌号码
	vin: String,
	engineNumber: String,
	carType: String,
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

module.exports = db.model('Requests', Requests)
