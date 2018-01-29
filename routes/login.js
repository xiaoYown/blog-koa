const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', async (ctx, next) => {
	if( !!ctx.session.user_id )
		ctx.redirect('/admin');
	else
		await ctx.render('login', { layout: false, title: '登录' });
});
router.post('/', async (ctx, next) => {
	let body = ctx.request.body;
	if( !!body.user_id && body.user_pwd ){
		try{
			let exists = await db_operate.query(`SELECT * FROM admin WHERE user_id="${body.user_id}" LIMIT 1`)
			if( exists[0].user_pwd == body.user_pwd ){
				
				ctx.session.user_id = body.user_id;

				ctx.body = {
					code: '000000',
					success: true,
					message: '登录成功',
				};
			} else {
				ctx.body = {
					code: '000001',
					success: true,
					message: '密码或账户错误',
				};
			}
		} catch(err) {
			ctx.body =  {
				code: '000002',
				success: true,
				message: '密码或账户错误'
			};
		}
	} else {
		ctx.body = {
			code: '000001',
			success: true,
			message: '密码或账户错误'
		};
	}
});

module.exports = router;