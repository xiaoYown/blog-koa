const router = require('koa-router')();
const dateformat 	= require('dateformat');

const db_operate = require('../mysql').db_operate;
const isLogin = require('../utils/login').isLogin;
const uuid = require('uuid/v4');

router.get('/:id', function *(){
		let info = yield db_operate.query(
			`SELECT 
			title,
			type,
			content,
			DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
			DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
			FROM articals WHERE id = "${this.params.id}" LIMIT 1`
		);
		yield this.render('artical', { layout: false, title: info[0].title, info: info[0] });
	})
	.get('/query/:id', function *(){
		let info = yield db_operate.query(
			`SELECT 
			title,
			type,
			content,
			DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
			DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
			FROM articals WHERE id = "${this.params.id}" LIMIT 1`
		);
		return this.body = {
			code: 0,
			status: 'success',
			data: {
				artical: info[0]
			}
		}
	})
	.get('/list_blog', function *( next ) {
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
	});
module.exports = router;