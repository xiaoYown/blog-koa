const router = require('koa-router')();
const dateformat 	= require('dateformat');

const db_operate = require('../mysql').db_operate;
const isLogin = require('../utils/login').isLogin;
const uuid = require('uuid/v4');
const path = require('path');
const utils = require('../utils/utils');
const config = require('../config/config');

router.get('/:id', function *() {
	let info = yield db_operate.query(
		`SELECT 
		title,
		type,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
		FROM articals WHERE id = "${this.params.id}" LIMIT 1`
	);
	var content = yield utils.fileRead(config.pathMd + info[0].title + '.md');
	info[0].content = content;
	yield this.render('artical', { layout: false, title: info[0].title, info: info[0] });
})
.get('/query/:id', function *() {
	let info = yield db_operate.query(
		`SELECT 
		title,
		type,
		content,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
		FROM articals WHERE id = "${this.params.id}" LIMIT 1`
	);
	var content = yield utils.fileRead(config.pathMd + info[0].title + '.md');
	info[0].content = content;

	return this.body = {
		code: 0,
		status: 'success',
		data: {
			artical: info[0]
		}
	}
})
.get('/list_blog', function *(next) {
	let articals = yield db_operate.query(
		`SELECT 
		title,
		id,
		type,
		top,
		description,
		DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
		FROM articals WHERE type = "blog"`
	);
	return this.body = {
		code: 0,
		status: 'success',
		data: {
			articals: articals
		}
	}
})
.get('/:year/:month/:date/:title', function *() {
	console.log(1)
	let time = key_time = this.params.year + '-' + this.params.month + '-' + this.params.date
	let info = yield db_operate.query(
		`SELECT
		id,
		title,
		type,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
		FROM articals WHERE key_time='${key_time}' AND title='${this.params.title}' LIMIT 1`
	);
	var content = yield utils.fileRead(config.pathMd + info[0].title + '.md');
	info[0].content = content;
	console.log(content)
	yield this.render('artical', { layout: false, title: info[0].title, info: info[0] });
});
module.exports = router;