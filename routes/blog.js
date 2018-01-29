const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/', async (ctx, next) =>{
  await ctx.render('index', {
    layout: false,
    title: 'xiaoYown'
  });
})
.get('/home', async (ctx, next) => {
	let articals = await db_operate.query(
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
	await ctx.render('home', {
		layout: false,
		title: '首页',
		articals
	});
})
.get('/react', async (ctx, next) => {
	await ctx.render('react', {
		layout: false,
		title: '首页'
	});
})
.get('/journal', async (ctx, next) => {
	let articals = await db_operate.query(
		`SELECT 
		title,
		id,
		type,
		description,
		DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
		FROM articals WHERE type = "journal"`
	);
	await ctx.render('home', {
		layout: false, 
		title: '琐事', 
		articals
	});
})

module.exports = router;