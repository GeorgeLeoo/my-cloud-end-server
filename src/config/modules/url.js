const key = require('./key')

module.exports = {
  // 查询快递公司
  expressCompanyURL: `https://api.jisuapi.com/express/type?appkey=${key.jisuApiKey}`,
  // 查询物流信息
  getExpressInfoURL: ({ type, number, mobile }) => `https://api.jisuapi.com/express/query?appkey=${key.jisuKey}&type=${type}&number=${number}&mobile=${mobile}`,
  // 查询驾照扣分
  getDriverLicenseURL: ({ licenseNumber, licenseId }) => `https://api.jisuapi.com/driverlicense/query?appkey=${key.jisuKey}&licensenumber=${licenseNumber}&licenseid=${licenseId}`,
  getTicket: (number) => `https://way.jd.com/hdmy/fkdjg?finenum=${number}&appkey=${key.jdwxKey}`,
  violation369URL: 'http://open.369shuju.com/wz/',
  violationJSURL: `https://api.jisuapi.com/illegal/query?appkey=${key.jisuKey}`,
  violationWZBURL: ({ licenseProvince, licenseEnd, vin, engineNumber, carType }) => `http://v.weizhangbao.net/wz/query?key=${key.wzbkey}&hpzl=${carType}&hphm=${(encodeURI(licenseProvince + licenseEnd)).trim()}&fdjh=${engineNumber}&cjh=${vin}`,
  scanViolationURL: 'http://apis.juhe.cn/vehicleLicenseOcr/index',
  basePath: "/root/www/5g121/traffic_upload"
}
