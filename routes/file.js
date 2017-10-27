const router = require('koa-router')();

const isLogin = require('../utils/login').isLogin;

router.post('/', isLogin , function *( next ) {
		yield this.render('admin', {layout: false});
	});

module.exports = router;