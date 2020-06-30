/**
 * 白名单配置
 * @type {{filterToken: string[]}}
 */
module.exports = {
  filterToken: [
    '/api/bmob',
    '/api/users/login',
    '/api/users/admin/login',
    '/api/public/captcha',
    '/api/sites'
  ],
  filterQueryTimes: [
    '/api/violations',
    '/api/violations/batch',
  ]
}
