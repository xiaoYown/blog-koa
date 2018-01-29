const router = require('koa-router')();

const isLogin = require('../utils/login').isLogin;

router.post('/', isLogin , async (ctx, next) => {
		await ctx.render('admin', {layout: false});
	});

module.exports = router;