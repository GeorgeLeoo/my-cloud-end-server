const db = require('../db/conn')
const Schema = db.Schema
const Sites = new Schema({
  //  注册提示文字
  registerText: String,
  //  忘记密码提示文字
  forgePwdText: String,
  //  网站备案信息
  recordKeeping: String,
  jsCities: Array,
  t369Cities: Array,
  wzbCities: Array,
  /**
   * 创建时间
   */
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

module.exports = db.model('Sites', Sites)
