const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const Histories = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },  // 用户id
	user_tel: String, //  用户的手机号
	licenseNumber: String, // 车牌号码
	name: String, // 车主姓名
	tel: String, // 车主电话
	address: String, // 车主地址
	annualExaminationDate: String, // 年审时间
	remark: String, // 备注
	cardId: String, // 身份证
	licenseProvince: String,
	licenseEnd: String,
	vin: String,
	engineNumber: String,
	carType: String,
	province: String,
	city: String,

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

module.exports = db.model('Histories', Histories)
