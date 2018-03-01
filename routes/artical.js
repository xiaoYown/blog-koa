const router = require('koa-router')();
const dateformat 	= require('dateformat');

const db_operate = require('../mysql').db_operate;
const isLogin = require('../utils/login').isLogin;
const uuid = require('uuid/v4');
const path = require('path');
const utils = require('../utils/utils');
const config = require('../config/config');

router.get('/:id', async (ctx, next) => {
	let info = await db_operate.query(
		`SELECT 
		title,
		type,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
		FROM articals WHERE id = "${ctx.params.id}" LIMIT 1`
	);
	var content = await utils.fileRead(config.pathMd + info[0].title + '.md');
	info[0].content = content;
	await ctx.render('artical', { layout: false, title: info[0].title, info: info[0] });
})
.get('/query/:id', async (ctx, next) => {
	let info = await db_operate.query(	
		`SELECT 
		title,
		type,
		content,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
		FROM articals WHERE id = "${ctx.params.id}" LIMIT 1`
	);
	var content = await utils.fileRead(config.pathMd + info[0].title + '.md');
	info[0].content = content;

	return ctx.body = {
		code: 0,
		status: 'success',
		data: {
			artical: info[0]
		}
	}
})
.get('/list_blog', async (ctx, next) => {
	let articals = await db_operate.query(
		`SELECT 
		title,
		id,
		type,
		top,
		description,
		DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
		FROM articals WHERE type = "blog"`
	);
	return ctx.body = {
		code: 0,
		status: 'success',
		data: {
			articals: articals
		}
	}
})
.get('/:year/:month/:date/:title', async (ctx, next) => {
	let time = key_time = ctx.params.year + '-' + ctx.params.month + '-' + ctx.params.date
	let info = await db_operate.query(
		`SELECT
		id,
		readers,
		title,
		type,
		DATE_FORMAT(create_time,'%Y-%m-%d %H:%i') AS create_time, 
		DATE_FORMAT(update_time,'%Y-%m-%d %H:%i') AS update_time
		FROM articals WHERE key_time='${key_time}' AND title='${decodeURI(ctx.params.title)}' LIMIT 1`
	);
	var content = await utils.fileRead(config.pathMd + info[0].title + '.md');
	info[0].content = content;
	await ctx.render('artical', { layout: false, title: info[0].title, info: info[0] });
	await db_operate.query(`
		update articals set readers=${info[0].readers + 1} where id="${info[0].id}"
	`)
});
module.exports = router;