const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;
const config = require('../config/config');
const utils = require('../utils/utils');

router.get('/', function *( next ){
  let articals = yield db_operate.query(
		`SELECT 
		title,
		id,
		type,
		top,
		key_time,
		description,
		DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
		FROM articals WHERE type = "blog" order by top desc`
	);
	yield this.render('blog', {
		layout: false,
		title: '首页',
		articals
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
.get('/image', function *(){
	yield this.render('image', {
		layout: false,
	});
})
.get('/:year/:month/:date/:title', function *() {
	let time = key_time = this.params.year + '-' + this.params.month + '-' + this.params.date
	let info = yield db_operate.query(
		`SELECT
		id,
		title,
		type,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
		FROM articals WHERE key_time='${key_time}' AND title='${this.params.title}' LIMIT 1`
	);
	var content = yield utils.fileRead(config.pathMd + info[0].title + '.md');
	info[0].content = content;
	console.log(content)
	yield this.render('artical', { layout: false, title: info[0].title, info: info[0] });
})

module.exports = router;