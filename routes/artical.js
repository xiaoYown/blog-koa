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
		yield this.render('artical', { layout: false, info: info[0] });
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
router.post('/:method', function *( cxt, next ){
		let body = this.request.body;
		let type = body.type
		let new_time = new Date().valueOf();
		let id = uuid(),
			create_time = dateformat(new Date(), 'yyyy-mm-dd\nHH:M:ss'),
			content;

		if (!this.session.user_id) {
			return this.body = {
				message: '无权限访问'
			}
		}
		try {
			let exists = yield db_operate.query(`SELECT * FROM articals where id = ${id}`)
		} catch (err) {
			switch (this.params.method) {
				case 'get':
					let markdown = yield db_operate.query(`select content from articals where id = "${body.id}"`);
					this.body = {
						code: '000000',
						success: true,
						message: '请求成功',
						data: {
							content: markdown[0].content
						}
					};
					break;
				case 'add':
					content = body.content.replace(/(\`|\'|\")/g, function(str){
						return "\\" + str
					});
					yield db_operate.query(`insert into articals (
							type,
							create_time,
							update_time,
							id,
							title,
							content
						) 
						values 
						(
							"${type}",
							"${create_time}",
							"${create_time}",
							"${id}",
							"${body.title}",
							"${content}"
						)`);
					this.body = {
						code: '000000',
						success: true,
						message: '请求成功'
					}
					break;
				case 'put':
					content = body.content.replace(/(\`|\'|\")/g, function(str){
						return "\\" + str
					});
					yield db_operate.query(`update articals set content = "${content}", update_time = "${create_time}" where id = "${body.id}"`);
					this.body = {
						code: '000000',
						success: true,
						message: '修改成功'
					}
					break;
				case 'del':
					yield db_operate.query(`delete from articals where id = "${body.id}"`);
					this.body = {
						code: '000000',
						success: true,
						message: '删除成功'
					}
					break;
			}

		}
	});

module.exports = router;