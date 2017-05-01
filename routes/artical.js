const router = require('koa-router')();
const dateformat 	= require('dateformat');

const db_operate = require('../mysql').db_operate;
const isLogin = require('../utils/login').isLogin;

router.get('/:id', function *(){
		let info = yield db_operate.query(
			`SELECT 
			title,
			type_name_NO01,
			type_name_NO02, 
			type_name_NO03, 
			DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
			DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
			FROM artical WHERE id = "${this.params.id}" LIMIT 1`
		);
		yield this.render('artical', { layout: false, info: info[0] });
	});
router.post('/:method', function *( cxt, next ){
		let body = this.request.body;

		let type = {
			blog: {
				name: '博客',
				child: {
					web_front_end: {
						name: 'web前端',
						child: {
							framework: {
								name: '框架',
							}
						}
					}
				}
			}
		};
		let new_time = new Date().valueOf();
		let id = `${body.type_NO01}-${body.type_NO02}-${body.type_NO03}-${new_time}`,
			create_time = dateformat(new Date(), 'yyyy-mm-dd\nHH:M:ss'),
			type_NO01 = body.type_NO01,
			type_NO02 = body.type_NO02,
			type_NO03 = body.type_NO03,
			content;

		if( !this.session.user_id && this.params.method != 'get' ){
			return this.body = {
				message: '无权限访问'
			}
		}
		try {
			let exists = yield db_operate.query(`SELECT * FROM artical where id = ${id}`)
		} catch( err ) {
			switch (this.params.method){
				case 'get':
					let markdown = yield db_operate.query(`select content from artical where id = "${body.id}"`);
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
					yield db_operate.query(`insert into artical (
							type_NO01,
							type_NO02,
							type_NO03,
							type_name_NO01,
							type_name_NO02,
							type_name_NO03,
							create_time,
							update_time,
							id,
							title,
							content
						) 
						values 
						(
							"${type_NO01}",
							"${type_NO02}",
							"${type_NO03}",
							"${type[type_NO01].name}",
							"${type[type_NO01].child[type_NO02].name}",
							"${type[type_NO01].child[type_NO02].child[type_NO03].name}",
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
					yield db_operate.query(`update artical set content = "${content}", update_time = "${create_time}" where id = "${body.id}"`);
					this.body = {
						code: '000000',
						success: true,
						message: '修改成功'
					}
					break;
				case 'del':
					yield db_operate.query(`delete from artical where id = "${body.id}"`);
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