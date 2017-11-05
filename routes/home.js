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
		description,
		DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
		FROM articals WHERE type = "blog"`
	);
	yield this.render('home', {
		layout: false,
		title: '首页',
		articals
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
.get('/lady-entry', function *( next ) {
	yield this.render('lady-entry', {
		layout: false,
		title: 'lady'
	});
})
.get('/lady', function *( next ) {
	yield db_operate.query('CREATE TABLE IF NOT EXISTS my_lady (id VARCHAR(255), wechat VARCHAR(255))')
	
	yield this.render('lady', {
		layout: false,
		title: 'lady'
	});
})
.post('/lady-wechat', function *() {
	let body = this.request.body
	let wechat = yield db_operate.query('SELECT * FROM my_lady')

	if (wechat.length === 0) {
		console.log(body)
		yield db_operate.query(`insert into my_lady (id, wechat) values ("lady", "${body.wechat}")`)
		this.body = {
			message: 'none'
		}
	} else {
		yield db_operate.query(`update my_lady set wechat="${body.wechat}" where id="lady"`)
		this.body = {
			message: 'had'
		}
	}
})

module.exports = router;