const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const config = require("./config");
const { ResponseCode } = require("./config");
const { Response } = require('./utils')
const { saveLog } = require('./utils/logs')

const userRouter = require("./routes/userRouter");
const jexRouter = require("./routes/jexRouter");

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

function hasToken({ token, req, res, next }) {
  const response = new Response({ req, res })
  utils
    .checkToken(token)
    .then(async data => {
      req.data = data;
      // 判断那个请求，存不同日志
      if (config.filterQueryTimes.includes(req._parsedUrl.pathname)) {
        // 违章列表
        // const { code, msg } = await UserController.minusQueryTimes({ req, res })
        // if (code === ResponseCode.CLIENT_ERROR) {
        //   response.send({ code: ResponseCode.CLIENT_ERROR, msg })
        // } else {
        // }
        next();
      } else {
        next();
      }
    })
    .catch(err => {
      response.send({ code: ResponseCode.UN_AUTHORIZATION, msg: "token过期1，重新登录" })
    });
}

app.use(function(req, res, next) {
  if (config.filterToken.indexOf(req._parsedUrl.pathname) > -1) {
    // saveLog({
    //   msg: 'ok',
    //   url: req.url,
    //   method: req.method
    // })
    next()
  } else {
    const token = req.headers["jex-token"];
    // if (!token) {
    //   // saveLog({
    //   //   msg: 'token过期',
    //   //   url: req.url,
    //   //   method: req.method
    //   // })
    //   const response = new Response({ req, res })
    //   response.send({ code: ResponseCode.UN_AUTHORIZATION, msg: "token过期，重新登录" })
    // } else {
    //  hasToken({ token, req, res, next })
    // }
    next()
  }
});

app.use(`${config.urlPrefix}/user`, userRouter);
app.use(`${config.urlPrefix}/`, jexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // 使用next(err)，Express就知道出错了，并把这个错误传递给错误处理模块
	// set locals, only providing error in development
	res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // saveLog({
  //   msg: err.message,
  //   url: req.url,
  //   method: req.method
  // })
  console.log(err)
  const response = new Response({ req, res })
  response.send({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
});

// 追踪栈
process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
  // saveLog(reason.stack, 'code')
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

module.exports = app;
