const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const utils = require('../utils')
const TicketHistories = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },  // 用户id
	tel: String, // 用户
	jdsbh: String, // 罚款编号
	hphm: String, // 车牌号码
	dsr: String, // 当事人名
	wfsj: String, // 违法时间
	wfdz: String, // 违法地址
	clsj: String, // 处罚时间
	fkje: String, // 罚款金额
	znj: String, // 滞纳金
	/**
	 * 创建时间
	 */
	createdAtString: {
		type: String,
		default: utils.formatDate(),
	},
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: date,
	},
})

module.exports = db.model('TicketHistories', TicketHistories)
