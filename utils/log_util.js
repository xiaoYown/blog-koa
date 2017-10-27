var log4js = require('log4js');

var log_config = require('../config/log_config');
//加载配置文件
log4js.configure(log_config);

var logUtil = {};

var errorLogger = log4js.getLogger('errorLogger');
var resLogger = log4js.getLogger('resLogger');

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};

//格式化响应日志
var formatRes = function (ctx, resTime) {

    var logText = new String();

    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    // logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    formatCol(false, ctx.status, ctx.response.message, ctx.request.method, ctx.request.originalUrl, resTime + 'ms');

    return logText;

}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    formatCol(true, ctx.status, ctx.response.message,ctx.request.method, ctx.request.originalUrl, resTime + 'ms');

    return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {

    var logText = new String();

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

// console 格式
function formatCol (err, status, message, method, url, time) {
    
    let _status = status.toString()[0],
        _method = err ? '\u001b[31m' + method + '\u001b[39m' : method;

    let start = '',
        end = '';
    let sil_op = '\u001b[90m ',
        sil_ed = ' \u001b[39m';
    switch (_status) {
        case '2':
            start = '\u001b[32m';
            end   = '\u001b[39m';
            break;
        case '3':
            start = '\u001b[34m';
            end   = '\u001b[39m';
            break;
        case '4':
            start = '\u001b[33m';
            end   = '\u001b[39m';
            break;
        case '5':
            start = '\u001b[33m';
            end   = '\u001b[39m';
            break;
    }
    _status = start + status + end;
    let _message = '\u001b[33m' + message + '\u001b[39m';
        // _url = sil_op + url + sil_ed,
        // _time = sil_op + time + sil_ed,
        

    console.log(`${sil_op} --> ${sil_ed} ${_method} ${url} ${_status} ${_message} ${time}`)
}

module.exports = logUtil;