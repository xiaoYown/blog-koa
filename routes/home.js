const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', function *( next ) {
		let new_list = [];
		try{
			let new_list = yield db_operate.query(
				`SELECT 
				title,
				id,
				DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
				DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
				FROM artical limit 10`
			);
			yield this.render('home', {
				layout: false, 
				title: '首页', 
				new_list
			});
			yield console.log(new_list)
		} catch(err){

		}
	});

module.exports = router;