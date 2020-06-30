const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const HistoryLogs = new Schema({
	user_tel: String, //  用户的手机号
	licenseNumber: String, // 车牌号码
	carType: String, // 车辆类型
	vin: String, // 车架号
	engineNumber: String, // 发动机号
	state: Number, // 查询状态：0成功，1失败
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

module.exports = db.model('HistoryLogs', HistoryLogs)
