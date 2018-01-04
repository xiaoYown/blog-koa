const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', function *( next ){
  yield this.render('index', {
    layout: false,
    title: 'xiaoYown'
  });
})
.get('/home', function *( next ) {
	let articals = yield db_operate.query(
		`SELECT 
		title,
		id,
		type,
		top,
		description,
		DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
		FROM articals WHERE type = "blog" order by top desc`
	);
	yield this.render('home', {
		layout: false,
		title: '首页',
		articals
	});
})
.get('/react', function *( next ) {
	yield this.render('react', {
		layout: false,
		title: '首页'
	});
})
.get('/journal', function *( next ) {
	let articals = yield db_operate.query(
		`SELECT 
		title,
		id,
		type,
		description,
		DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
		FROM articals WHERE type = "journal"`
	);
	yield this.render('home', {
		layout: false, 
		title: '琐事', 
		articals
	});
})

module.exports = router;