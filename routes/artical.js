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
			DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
			DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
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
			DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
			DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
			FROM articals WHERE id = "${this.params.id}" LIMIT 1`
		);
		return this.body = {
			code: 0,
			status: 'success',
			data: {
				artical: info[0]
			}
		}
	});
module.exports = router;