'use strict'

const path 			= require('path');
const Koa 			= require('koa');
const app 			= new Koa();
const render 		= require('koa-ejs');
const co 			= require('co');
const convert 		= require('koa-convert');
const json 			= require('koa-json');
const onerror 		= require('koa-onerror');
const bodyparser 	= require('koa-bodyparser')();
// const logger 		= require('koa-logger');
// const redisStore 	= require('koa-redis');
const session 		= require('koa-session');
// const open 			= require("open");
// const dateformat 	= require('dateformat');
const staticCache   = require('koa-static-cache'); 
//log工具
const logUtil = require('./utils/log_util');
const config = require('./config/config');
var favicon = require('koa-favicon');
var cors = require('koa2-cors');

// app.use(cors({
//   origin: function (ctx) {
//     if (/admin/.test(ctx.url)) {
//       return false;
//     }
//     return '/';
//   },
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }));

// const Router = require('koa-router');

// const router = Router();
const router = require('./routes');
const imageRouter = require('./routes/image');

// var wrapper = require('co-mysql'),
// 	mysql 	= require('mysql'); 

// var options = {
// 	host : 'localhost',
// 	port : 3306 ,
// 	database : 'blog_test',
// 	user: 'root',
// 	password : '511687372'
// };

// var pool = mysql.createPool(options),
// 	db_operate = wrapper(pool);

app.use(favicon(path.join(__dirname, './favicon.ico')));
// app.use(convert(require('koa-static2')("/static", __dirname + '/static')));
app.use(staticCache({
	buffer: false,
	gzip: true,
	prefix: '/static',
	dir: path.join(__dirname, '/static')
}));
app.use(convert(bodyparser));
app.use(convert(json()));
// app.use(convert(logger()));
// app.use(logger());
onerror(app);

render(app, {
	root: path.join(__dirname, 'views'),
	// layout: 'layout',
	viewExt: 'ejs',
	cache: false,
	debug: false
});
// logger
app.use(async (ctx, next) => {
	//响应开始时间
	const start = new Date();
	//响应间隔时间
	var ms;
	if (/\/static\//.test(ctx.request.url)) {
		return next()
	}
	try {
		//开始进入到下一个中间件
		await next();
		ms = new Date() - start;
		//记录响应日志
		logUtil.logResponse(ctx, ms);
	} catch (error) {
		ms = new Date() - start;
		//记录异常日志
		logUtil.logError(ctx, error, ms);
	}
});

app.keys = ['some secret hurr'];

const CONFIG = {
	key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
	maxAge: 86400000,// 86400000, /** (number) maxAge in ms (default is 1 days) */
	overwrite: true, /** (boolean) can overwrite or not (default true) */
	httpOnly: true, /** (boolean) httpOnly or not (default true) */
	signed: true, /** (boolean) signed or not (default true) */
};
app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

let isLogin = function *( next ){
	if( !this.session.user_id )
		return this.redirect( '/login' );
	else
		yield next;
}

app.use(router.routes(),  router.allowedMethods());

app.on('error', function(err, ctx){
	console.error(err);
});

app.listen(config.port);

console.log("http://localhost:3002")

module.exports = app;