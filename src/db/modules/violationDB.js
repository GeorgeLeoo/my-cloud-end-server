const Histories = require('../../model/historys')
const { getCount } = require('./utils')
const { ResponseCode } = require('../../config')
const UserDB = require('./userDB')

/**
 * 查询历史车牌、车架号、发动机号
 * @param license
 * @returns {Promise<unknown>}
 */
function getCarBaseInfoHistory ({ licenseProvince, licenseEnd }) {
  return new Promise(resolve => {
    Histories.findOne({ licenseProvince, licenseEnd }, (err, histories) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: histories })
      }
    })
  })
}

/**
 * 历史违章查询
 * @param query
 * @param page
 * @returns {Promise<unknown>}
 */
function getViolationHistories ({ query = {}, page = { pageNumber: 1, pageSize: 20 } }) {
  return new Promise(async resolve => {
    const count = await getCount(Histories, query)
    Histories.find(query, (err, histories) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: { list: histories, total: count } })
      }
    }).sort({ '_id': -1 })
      .limit(parseInt(page.pageSize))
      .skip((parseInt(page.pageNumber) - 1) * parseInt(page.pageSize))
  })
}

/**
 * 补齐资料、备注
 * @param id
 * @param name
 * @param tel
 * @param address
 * @param annualExaminationDate
 * @param cardId
 * @param remark
 * @returns {Promise<unknown>}
 */
function updateViolationHistories ({ id, name, tel, address, annualExaminationDate, cardId, remark }) {
  return new Promise(resolve => {
    let update = {}
    if (remark) {
      update = { remark }
    } else {
      update = { name, tel, address, annualExaminationDate, cardId }
    }
    Histories.updateMany({ _id: id }, { $set: update }, (err, histories) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else if (histories.nModified === 1) {
        resolve({
          code: ResponseCode.SUCCESS, msg: '更新成功', data: [],
        })
      } else {
        resolve({
          code: ResponseCode.SERVICE_ERROR, msg: '更新失败', data: [],
        })
      }
    })
  })
}

/**
 * 添加历史记录
 * @param vin
 * @param engineNumber
 * @param licenseProvince
 * @param licenseEnd
 * @param carType
 * @param uid
 * @returns {Promise<unknown>}
 */
function createViolationHistories ({ vin, engineNumber, licenseProvince, licenseEnd, carType, uid }) {
  return new Promise(resolve => {
    Histories.insertMany({ vin, engineNumber, licenseProvince, licenseEnd, carType, uid }, (err, histories) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS })
      }
    })
  })
}

function update (tel, _id) {
  return new Promise(resolve => {
    Histories.updateMany({ user_tel: tel }, { $set: { uid: _id } }, (err, histories) => {
      if (err) {
        console.log('err')
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        console.log('success')
        resolve({ code: ResponseCode.SUCCESS, msg: 's' })
      }
    })
  })
}

async function change () {
  return new Promise(async resolve => {
    const { data } = await UserDB.getAllUsersChange()
    const userMap = {}
    data.map(item => {
      userMap[item.tel] = item._id
    })
    
    const res = await getViolationHistories({ page: { pageNumber: 1, pageSize: 1000000 } })
    const dMap = []
    res.data.list.map(item => {
      if (!dMap.includes(item.user_tel)) {
        dMap.push(item.user_tel)
      }
    })
    console.log(dMap)
    for (let k = 0; k < dMap.length; k++) {
      // console.log(dMap[k], userMap[dMap[k]])
      await update(dMap[k], userMap[dMap[k]])
      // Histories.update({ user_tel: res.data.list[k].user_tel }, { $set: { uid: userMap[res.data.list[k].user_tel] } }, (err, histories) => {
      //   console.log(histories)
      // })
      // if (k === res.data.list.length - 1) {
      //   resolve({ code: ResponseCode.SUCCESS, data: [], msg: 'success' })
      // }
    }
    resolve({ code: ResponseCode.SUCCESS, data: [], msg: 'success' })
  })
}

module.exports = {
  getCarBaseInfoHistory,
  getViolationHistories,
  updateViolationHistories,
  createViolationHistories,
  change
}
