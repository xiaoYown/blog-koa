const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', function *( next ) {
		let new_list = [];
		try{
			let new_list = yield db_operate.query(`SELECT title,id FROM artical`);
			yield this.render('index', {
				layout: false, 
				title: '首页', 
				new_list
			});
		} catch(err){

		}
	});

module.exports = router;