/**
 * 图形验证码
 * @type {{color: boolean, noise: number, width: number, fontSize: number, height: number}}
 */
module.exports = {
  trafficCaptchaKey: 'TrafficCaptcha',
  captchaOptions(color = false) {
    return {
      noise: 0,
      color,
      height: 31,
      width: 100,
      fontSize: 36
    }
  }
}
