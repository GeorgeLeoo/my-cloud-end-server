const jwt = require('jsonwebtoken')
const config = require('../config')
const redis = require('./redis')
const Response = require('./Response');

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

module.exports = utils = {
  ...redis,
  Response,
  isLeapYear (year) {
    if (!year) {
      year = new Date().getFullYear()
    }
    return ((year % 4) === 0) && ((year % 100) !== 0) || ((year % 400) === 0);
  },
  getCarTypeValue (id) {
    let list = config.carType
    let len = list.length
    let type = ''
    for (let i = 0; i < len; i++) {
      if (list[i].id === id) {
        type = list[i].type
        break
      }
    }
    return type
  },
  isArray,
  /**
   * 判断是否为空
   * @param checkList = [{ data: 要检查的字符串，errMsg：错误信息 }]
   * @returns {{errMsg: (string), status: boolean}|{status: boolean}} errMsg：错误信息 status：true为空，false不为空
   */
  isEmpty: function (checkList) {
    // 判断是否为数组
    if (!isArray(checkList)) {
      return { status: true }
    }
    for (let i = 0; i < checkList.length; i++) {
      if (!checkList[i].data || checkList[i].data === null) {
        return { status: true, errMsg: checkList[i].errMsg }
      }
    }
    return { status: false }
  },
  isEmptyObj: function (target) {
    return JSON.stringify(target) === JSON.stringify({})
  },
  /**
   * 生成token
   * @param {object} content  对某个内容生成 token
   */
  accessToken: function (content) {
    let secret = '5gchewuxitong' // 秘钥
    // let expiresIn = Math.round((new Date().getTime() / 1000)) + 3600; // 过期时间
    let expiresIn = 60 * 60 * 24 // 过期时间
    // let expiresIn = 1; // 立刻过期
    let token = jwt.sign(content, secret, { expiresIn })
    return {
      token,
      expiresIn
    }
  },
  /**
   * 验证token
   * @param {string} token token值
   */
  checkToken: function (token) {
    let secret = '5gchewuxitong' // 秘钥，根生成的 token 要一致
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, err => {
        if (err) {
          //时间失效或伪造 token 或 token 不存在
          reject({ status: 40003, err: 'invalid_token' })
        } else {
          resolve({ status: 201 })
        }
      })
    })
  },
  /***
   * 标记过滤
   * @param tag
   * @returns {[string, string]}
   */
  formatTag: function (tag) {
    let res = []
    switch (tag) {
      case 1:
        res = ['未处理', '未交款']
        break
      case 2:
        res = ['已处理', '未交款']
        break
      case 3:
        res = ['已处理', '已交款']
        break
      default:
        res = ['未处理', '未交款']
        break
    }
    return res
  },
  formatDateTime: function (date) {
    if (!date) {
      return ''
    }
    const d = new Date(date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = d.getHours()
    const min = d.getMinutes()
    const sec = d.getSeconds()
    return `${year}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    } ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${
      sec < 10 ? '0' + sec : sec
    }`
  },
  formatDate: function (date) {
    let d
    if (!date) {
      d = new Date()
    } else {
      d = new Date(date)
    }
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${year}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    }`
  },
  getDateObj: function (date) {
    let d
    if (!date) {
      d = new Date()
    } else {
      d = new Date(date)
    }
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    return { year, month, day }
  },
  nextMonth: function (date) {
    let d = new Date(date)
    let year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    let endDate = `${year}-${month + 1}-${day}`
    return endDate
  },
  /**
   * 获取下一个月
   *
   * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
   */
  getNextMonth (date) {
    var arr = date.split('-')
    var year = arr[0] //获取当前日期的年份
    var month = arr[1] //获取当前日期的月份
    var day = arr[2] //获取当前日期的日
    var days = new Date(year, month, 0)
    days = days.getDate() //获取当前日期中的月的天数
    var year2 = year
    var month2 = parseInt(month) + 1
    if (month2 == 13) {
      year2 = parseInt(year2) + 1
      month2 = 1
    }
    var day2 = day
    var days2 = new Date(year2, month2, 0)
    days2 = days2.getDate()
    if (day2 > days2) {
      day2 = days2
    }
    if (month2 < 10) {
      month2 = '0' + month2
    }
    return year2 + '-' + month2 + '-' + day2
  },
  getCount: function (DB, condition) {
    return new Promise(resolve => {
      DB.countDocuments(condition, function (err, count) {
        if (err) {
          resolve(0)
        } else {
          resolve(count)
        }
      })
    })
  }
}

