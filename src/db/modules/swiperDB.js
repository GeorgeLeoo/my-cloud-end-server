const UploadSwipers = require('../../model/uploadSwipers')
const { basePath } = require('../../config/modules/url')
const { ResponseCode } = require('../../config')

/**
 * 查询轮播图
 * @returns {Promise<unknown>}
 */
function getSwiper () {
  return new Promise(async resolve => {
    UploadSwipers.find({}, (err, pics) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: pics })
      }
    })
  })
}

function unLinkFile (url) {
  return new Promise(resolve => {
    fs.unlink(basePath + url, (err) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS })
      }
    })
  })
}

function removeSwiper (id) {
  return new Promise(resolve => {
    UploadSwipers.remove({ _id: id }, function (err, doc) {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, msg: '删除成功' })
      }
    })
  })
}

function deleteSwiperByID ({ url, id }) {
  return new Promise(async resolve => {
    try{
      const { code, data, msg } = await unLinkFile(url)
      resolve({ code, data, msg })
    }catch (e) {
      resolve(e)
    }
    try {
      const { code, data, msg } = await removeSwiper(id)
      resolve({ code, data, msg })
    }catch (e) {
      resolve(e)
    }
  })
}

function createSwiper(files) {
  return new Promise(resolve => {
  
    let fileSplit = files.name.split('.');
    let suffix = fileSplit[fileSplit.length - 1].toLowerCase();
    let picSuffixs = ["png", "jpg", "jpeg"];
  
    if (!picSuffixs.includes(suffix)) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: '文件格式必须是png或jpg或jpeg' })
      return;
    }
  
    let path = basePath + '/swiper/'
  
    let fileName = new Date().getTime() + '.jpg';
  
    files.mv(path + fileName, function (e) {
      if (e) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: e })
      } else {
        UploadSwipers.insertMany({ url: '/swiper/' + fileName }, function (err, doc) {
          if (err) {
            resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
          } else {
            resolve({ code: ResponseCode.SUCCESS, msg: '上传成功' })
          }
        })
      }
    });
  })
}

module.exports = {
  getSwiper,
  deleteSwiperByID,
  createSwiper
}
