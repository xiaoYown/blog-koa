const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', function *( next ) {
	let articals = yield db_operate.query(
		`SELECT * FROM articals`
	);

	yield this.render('home', {
		layout: false, 
		title: '首页', 
		articals
	});
});

module.exports = router;