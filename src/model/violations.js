const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const Violations = new Schema({
	noticeNumber: String, // 通知书号
	licenseType: String, // 车牌类型
	licenseTypeCode: String, // 车牌类型code
	licenseNumber: String, // 车牌号码
	datetime: String, // 违章时间
	address: String, // 违章地点
	code: String, // 违章代码
	behavior: String, // 违章行为
	penaltyPoint: String, // 扣分
	forfeit: String, // 罚款
	office: String, // 采集机构
	tagHandle: String, // 处理标记
	tagMoney: String, // 交款标记
	vin: String, //  车架号
	engineNumber: String, //  发动机号
	/**
	 * 数据状态
	 * 0 表示存在
	 * 1 表示删除
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

module.exports = db.model('Violations', Violations)
