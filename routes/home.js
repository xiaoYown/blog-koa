const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', function *( next ) {
	let articals = yield db_operate.query(
		`SELECT 
		title,
		id,
		type,
		description,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
		FROM articals`
	);
	yield this.render('home', {
		layout: false, 
		title: '首页', 
		articals
	});
});

module.exports = router;