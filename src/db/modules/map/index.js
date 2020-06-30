const AccountStatus = require('../../../config/modules/accountStatus')

module.exports = {
  // 开启或关闭账号
  OPEN_OR_CLOSE_ACCOUNT_MAP: {
    [AccountStatus.OPEN]: '开启账号成功',
    [AccountStatus.CLOSE]: '关闭账号成功'
  }
}
