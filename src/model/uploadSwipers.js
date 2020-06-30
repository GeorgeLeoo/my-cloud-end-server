const db = require('../db/conn')
const Schema = db.Schema
const { nowDate } = require('../config')
const date = nowDate
const UploadSwipers = new Schema({
	url: String, // 路径
	/**
	 * 创建时间
	 */
	createdAt: {
		type: Date,
		default: date,
	},
})

module.exports = db.model('UploadSwipers', UploadSwipers)
