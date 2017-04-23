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
const logger 		= require('koa-logger');
const redisStore 	= require('koa-redis');
const session 		= require('koa-session');
const open 			= require("open");
const dateformat 	= require('dateformat');

// const Router = require('koa-router');

// const router = Router();
const router = require('./routes');

var wrapper = require('co-mysql'),
	mysql 	= require('mysql'); 

var options = {
	host : 'localhost',
	port : 3306 ,
	database : 'blog_test',
	user: 'root',
	password : '511687372'
};

var pool = mysql.createPool(options),
	db_operate = wrapper(pool);

app.use(convert(require('koa-static2')("/static", __dirname + '/static')));
app.use(convert(bodyparser));
app.use(convert(json()));
// app.use(convert(logger()));
app.use(logger());
onerror(app);

 render(app, {
	root: path.join(__dirname, 'views'),
	layout: 'layout',
	viewExt: 'html',
	cache: false,
	debug: true
});

// var myRouter = new Router();
/**
 * 创建数据库: create database dbname
 * 创建表: CREATE TABLE IF NOT EXISTS user_info ( user_id VARCHAR(30), user_pwd VARCHAR(30) )
 * 
 * 查询:   select * from table_name where __key__=__value__ (limit 1)
 * 
 * 插入列(首部): alter table table_name add  column col_name varchar(30) first
 * 插入列(末尾): alter table table_name add  column col_name varchar(30) (not null)
 * 插入列(之后): alter table table_name add  column col_name varchar(30) after __col__name
 * 删除列: alter table table_name drop column col_name
 * 
 * 插入行: inert into table_name (col1_name,col2_name) values (col1_val, col2_val)
 * 修改:   update table_name set _key_=_value_ where __key__=__value__ (limit 1) 
 * 删除:   delete from table_name where id = _id
 */

/**
 * CREATE TABLE admin ( user_id CHAR, user_pwd CHAR, user_name CHAR );
 * INSERT INTO admin (user_id, user_pwd, user_name) VALUES ('admin', '511687372', 'xiaoYown');
 */

app.keys = ['some secret hurr'];

const CONFIG = {
	key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
	maxAge: 1000000,//86400000, /** (number) maxAge in ms (default is 1 days) */
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

// router
// 	.get('/', function *( next ) {
// 		let new_list = [];
// 		try{
// 			let new_list = yield db_operate.query(`SELECT title,id FROM artical`);
// 			yield this.render('index', {
// 				layout: false, 
// 				title: '首页', 
// 				new_list
// 			});
// 		} catch(err){

// 		}
// 	})


app.use(router.routes(),  router.allowedMethods());

// response
app.on('error', function(err, ctx){
	console.error(err);
	// console.error('server error', err, ctx);
});

app.listen(3002);

// open("http://localhost:3002")

module.exports = app;