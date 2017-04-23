const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', function *( next ) {
		if( !!this.session.user_id )
			this.redirect('/admin');
		else
			yield this.render('login', {layout: false, title: '登录'});
	});
router.post('/', function *( cxt, next ){
		let body = this.request.body;
        console.log(body)
		if( !!body.user_id && body.user_pwd ){
			try{
				let exists = yield db_operate.query(`SELECT * FROM admin WHERE user_id="${body.user_id}" LIMIT 1`)
				if( exists[0].user_pwd == body.user_pwd ){
					
					this.session.user_id = body.user_id;

					this.body = {
						code: '000000',
						success: true,
						message: '登录成功',
					};
				} else {
					this.body = {
						code: '000001',
						success: true,
						message: '密码或账户错误',
					};
				}
			} catch(err) {
				this.body =  {
					code: '000002',
					success: true,
					message: '密码或账户错误',
				};
			}
		} else {
			this.body = {
				code: '000001',
				success: true,
				message: '密码或账户错误',
			};
		}
	});

module.exports = router;