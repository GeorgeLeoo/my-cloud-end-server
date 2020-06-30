const Sites = require('../../model/sites')
const { ResponseCode } = require('../../config')

/**
 * 查询站点信息
 * @returns {Promise<>}
 */
function getSite () {
  return new Promise(async resolve => {
    Sites.find({}, (err, sites) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: sites })
      }
    })
  })
}

/**
 * 查询城市数据配置信息
 * @param title 标题
 * @returns {Promise<>}
 */
function getCityConfig () {
  return new Promise(resolve => {
    Sites.find(
      {},
      { jsCities: 1, t369Cities: 1, wzbCities: 1 },
      (err, sites) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, data: sites })
        }
      })
  })
}

/**
 * 创建站点信息
 * @param title 标题
 * @returns {Promise<>}
 */
function createSite ({ registerText, forgePwdText, recordKeeping, $jsCities, $369Cities, $wzbCities }) {
  return new Promise(resolve => {
    Sites.insertMany(
      { registerText, forgePwdText, recordKeeping, $jsCities, $369Cities, $wzbCities },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '添加成功' })
        }
      })
  })
}

/**
 * 更新站点信息
 * @returns {Promise<>}
 */
function updateSite ({ id, registerText, forgePwdText, recordKeeping, $jsCities, $369Cities, $wzbCities }) {
  return new Promise(resolve => {
    Sites.updateMany(
      { _id: id },
      { $set: { registerText, forgePwdText, recordKeeping, jsCities: $jsCities, t369Cities: $369Cities, wzbCities: $wzbCities  } },
      err => {
        console.log(err)
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '更新成功' })
        }
      })
  })
}

module.exports = {
  getSite,
  createSite,
  updateSite,
  getCityConfig
}
