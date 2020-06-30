const db = require('../db/conn')
const Schema = db.Schema
const Users = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	}, // 手机号
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
})

module.exports = db.model('Users', Users)
