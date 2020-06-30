const Roles = require('../../model/role')
const Users = require('../../model/users')
const { NO } = require('../../config/modules/other')
const { ResponseCode } = require('../../config')

async function hasRights (id) {
  return new Promise(async resolve => {
    const { data } = await getRoles({ _id: id })
    if (!data || data.length === 0) {
      resolve(false)
    }
    resolve(data[0].state)
  })
}

/**
 * 查询角色
 * @returns {Promise<unknown>}
 */
function getRoles (query = {}) {
  return new Promise(async resolve => {
    Roles.find(query, (err, roles) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: roles })
      }
    })
  })
}

/**
 * 创建角色信息
 * @returns {Promise<unknown>}
 */
function createRoles ({ name, count, state }) {
  return new Promise(resolve => {
    Roles.insertMany(
      { name, count, state },
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
 * 通过 id 更新银行信息
 * @returns {Promise<unknown>}
 */
function updateRolesByID ({ id, name, count, state }) {
  return new Promise(resolve => {
    Roles.updateMany(
      { _id: id },
      { $set: { name, count, state } },
      err => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: '更新成功' })
        }
      })
  })
}

function hasRole(id) {
  return new Promise((resolve, reject) => {
    Users.find({}, function(err, doc) {
      if (err) {
      } else {
        const res = doc.some(item => item.privilege === id);
        if (res) {
          reject();
        } else {
          resolve();
        }
      }
    });
  });
}

/**
 * 根据角色 id 删除
 * @param id
 * @returns {Promise<unknown>}
 */
function deleteRoleByID (id) {
  return new Promise(async resolve => {
    try {
      await hasRole(id);
      Roles.updateMany(
        { _id: id },
        { $set: { status: NO } },
        err => {
          if (err) {
            resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
          } else {
            resolve({ code: ResponseCode.SUCCESS, msg: '删除成功' })
          }
        })
    } catch(e) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: '有用户已关联此角色，故不能删除，若要删除，请解除该角色的关联！' })
    }
  })
}

module.exports = {
  getRoles,
  createRoles,
  updateRolesByID,
  deleteRoleByID,
  hasRights
}
