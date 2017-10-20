const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;
const isLogin = require('../utils/login').isLogin;
const uuid = require('uuid/v4');
const dateformat 	= require('dateformat');

router.get('/', isLogin , function *( next ) {
		yield this.render('admin', {layout: false, title: '用户管理'});
	})
	.get('/add', isLogin , function *( next ) {
		yield this.render('admin-add', {layout: false, title: '添加文章', method: 'add', artical: {}});
	})
	.post('/add', isLogin , function *( next ) {
		let body = this.request.body;
		let type = body.type
		let id = uuid(),
				create_time = dateformat(new Date(), 'yyyy-mm-dd\nHH:M:ss'),
				content  = body.content.replace(/(\`|\'|\")/g, function(str){
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
	})
	.get('/mod/:id', isLogin , function *( next ) {
		let artical = yield db_operate.query(
			`SELECT 
			title,
			type,
			content,
			DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
			DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
			FROM articals WHERE id = "${this.params.id}" LIMIT 1`
		);
		yield this.render('admin-add', {layout: false, title: '修改文章', method: 'mod', artical: artical[0]});
	})
	.post('/mod/:id', isLogin , function *( next ) {
		let body = this.request.body;
		let type = body.type
		let id = uuid(),
				update_time = dateformat(new Date(), 'yyyy-mm-dd\nHH:M:ss'),
				content = body.content.replace(/(\`|\'|\")/g, function(str){
					return "\\" + str
				});
		yield db_operate.query(`update articals set content = "${content}", update_time = "${update_time}" where id = "${this.params.id}"`);
		this.body = {
			code: '000000',
			success: true,
			message: '修改成功'
		}
	})
	.post('/del/:id', isLogin , function *( next ) {
		yield db_operate.query(`delete from articals where id = "${this.params.id}"`);
		this.body = {
			code: '000000',
			success: true,
			message: '删除成功'
		}
	})
	.get('/blog', isLogin , function *( next ) {
		yield this.render('admin-blog', {layout: false, title: '用户管理-blog'});
	});

module.exports = router;