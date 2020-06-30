/**
 * 响应
 * @type {{SUCCESS: number, SERVICE_ERROR: number, CLIENT_ERROR: number, UN_AUTHORIZATION: number, FAIL: number}}
 */
const { ResponseCode } = require('../config')

class Response {
  /**
   * Response 构造函数
   * @param req 请求对象
   * @param res 响应对象
   */
  constructor ({ req, res }) {
    this.req = req
    this.res = res
  }
  
  /**
   * 响应请求
   * @param code  状态码
   * @param msg 信息
   * @param data  数据
   */
  send ({ code = ResponseCode.SUCCESS, msg = '', data = [] }) {
    let body = { code, msg, data }
    console.log(this.req.url, this.req.method, body)
    this.res.status(code)
    this.res.send(body)
  }
  
  /**
   * 客户端错误
   * @param msg 消息
   * @param data
   */
  sendClientError (msg = '', data = []) {
    this.send({ code: ResponseCode.CLIENT_ERROR, msg, data })
  }
  
  sendServerError (msg = '', data = []) {
    this.send({ code: ResponseCode.SERVICE_ERROR, msg, data })
  }
}

module.exports = Response
