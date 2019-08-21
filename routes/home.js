const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;
// const config = require('../config/config');
// const utils = require('../utils/utils');

router.get('/', async (ctx, next) => {
  let articals = await db_operate.query(`
    SELECT title, readers, thumb_up, id, type, top, key_time, description,
    DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
    DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
    FROM articals WHERE type = "blog" order by top desc`
  );
  await ctx.render('main', {
    layout: false,
    title: '首页',
    articals
  });
})
.get('journal', async (ctx, next) => {
  let articals = await db_operate.query(`
    SELECT title, readers, thumb_up, id, type, top, key_time, description,
    DATE_FORMAT(create_time,'%Y.%m.%d %H:%i') AS create_time, 
    DATE_FORMAT(update_time,'%Y.%m.%d %H:%i') AS update_time
    FROM articals WHERE type = "journal" order by top desc`
  );
  await ctx.render('main', {
    layout: false,
    title: '琐事',
    articals
  });
})
.get('react/:page/:subpage1?/:subpage2?/:subpage3?', async (ctx, next) => {
  await ctx.render('react/' + ctx.params.page, {
    layout: false,
    title: '首页'
  });
})
.get('vue/:page/:subpage1?/:subpage2?/:subpage3?', async (ctx, next) => {
  await ctx.render('vue/' + ctx.params.page, {
    layout: false,
    title: 'vue template'
  });
})

module.exports = router;