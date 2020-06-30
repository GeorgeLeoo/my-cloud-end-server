const db = require('./modules/db')
const key = require('./modules/key')
const province = require('./modules/province')
const whiteList = require('./modules/whiteList')
const redis = require('./modules/redis')
const responseCode = require('./modules/responseCode')
const captcha = require('./modules/captcha')
const contentType = require('./modules/contentType')
const accountStatus = require('./modules/accountStatus')
const url = require('./modules/url')
const carType = require('./modules/carType')
const provinceWithChar = require('./modules/provinceWithChar')
const other = require('./modules/other')

module.exports = {
  urlPrefix: '/jex',
  ...db,
  ...province,
  ...whiteList,
  ...redis,
	...other,
	key,
  captcha,
  url,
  carType,
  provinceWithChar,
  contentType,
  AccountStatus: accountStatus,
  ResponseCode: responseCode
};
