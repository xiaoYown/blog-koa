const router = require('koa-router')();
const isLogin = require('../utils/login').isLogin;

router.get('/', isLogin , function *( next ) {
		yield this.render('admin', {layout: false, title: '用户管理'});
	});

module.exports = router;