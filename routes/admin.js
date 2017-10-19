const router = require('koa-router')();
const isLogin = require('../utils/login').isLogin;

router.get('/', isLogin , function *( next ) {
		yield this.render('admin', {layout: false, title: '用户管理'});
	})
	.get('/add', isLogin , function *( next ) {
		yield this.render('admin-add', {layout: false, title: '添加文章', method: 'add'});
	})
	.get('/mod/:id', isLogin , function *( next ) {
		yield this.render('admin-add', {layout: false, title: '修改文章', method: 'mod'});
	})
	.get('/blog', isLogin , function *( next ) {
		yield this.render('admin-blog', {layout: false, title: '用户管理-blog'});
	});

module.exports = router;