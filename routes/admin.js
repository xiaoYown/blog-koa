const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;
const isLogin = require('../utils/login').isLogin;
const uuid = require('uuid/v4');
const dateformat = require('dateformat');
const utils = require('../utils/utils');
const config = require('../config/config');

function tranSpace(str) {
  return str.replace(/(\`|\'|\")/g, function (str) {
    return "\\" + str
  });
}

router.get('/', isLogin, async (ctx, next) => {
  await ctx.render('admin', {
    layout: false,
    title: '用户管理'
  });
})
  .get('/add', isLogin, async (ctx, next) => {
    await ctx.render('admin-edit', {
      layout: false,
      title: '添加文章',
      method: 'add',
      artical: {}
    });
  })
  .get('/mod/:id', isLogin, async (ctx, next) => {
    let artical = await db_operate.query(`
      SELECT title, tips, type, description,
      DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
      DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
      FROM articals WHERE id = "${ctx.params.id}" LIMIT 1`
    );
    await ctx.render('admin-edit', {
      layout: false,
      title: '修改文章',
      method: 'mod',
      artical: artical[0]
    });
  })
  .post('/add', isLogin, async (ctx, next) => {
    let body = ctx.request.body;
    let type = body.type;
    let id = uuid();
    let now_time = new Date();
    let create_time = dateformat(now_time, 'yyyy-mm-dd\nHH:M:ss');
    let key_time = dateformat(now_time, 'yyyy-mm-dd');
    let description = tranSpace(body.description);
    let artical = await db_operate.query(`select * from articals where title="${body.title}" limit 1`);
    let filePath = config.pathMd + body.title + '.md';
    let isExists = await utils.fileExists(filePath);

    // 新增时文件如果存在则直接删除
    if (isExists) {
      utils.fileRem(filePath);
    }
    if (artical.length > 0) {
      ctx.body = {
        code: '000001',
        success: false,
        message: '该文章已存在'
      }
    } else {
      // md 存储文章内容
      utils.fileWrite(filePath, body.content);
      try {
        // database 存储文章信息
        await db_operate.query(`insert into articals
        ( type, key_time, create_time, update_time, id, title, tips, description ) values 
        ( "${type}", "${key_time}", "${create_time}", "${create_time}", "${id}", "${body.title}", "${body.tips}", "${description}" )`
        );
      } catch (err) {
        console.log(err);
      }
      ctx.body = {
        code: '000000',
        success: true,
        message: '请求成功'
      }
    }

  })
  .post('/mod/:id', isLogin, async (ctx, next) => {
    let body = ctx.request.body;
    let type = body.type
    let update_time = dateformat(new Date(), 'yyyy-mm-dd\nHH:M:ss'),
      description = tranSpace(body.description),
      content = tranSpace(body.content);
    // 查询 title 是否存在相同 -> true : modify false ? next
    let sameTitle = await db_operate.query(`select * from articals where id != "${ctx.params.id}" and title = "${body.title}" limit 1`)
    if (sameTitle.length > 0) {
      return ctx.body = {
        code: '000001',
        success: false,
        message: '文章已存在'
      };
    }
    // 查询 title 是否修改 -> true : add then delete ? write
    let articals = await db_operate.query(`select * from articals where id = "${ctx.params.id}" limit 1`);
    if (articals[0].title !== body.title) {
      let filePath = config.pathMd + articals[0].title + '.md';
      let isExists = await utils.fileExists(filePath);
      if (isExists) {
        utils.fileRem(filePath);
      }
    }
    // 文章生成 .md 文件
    let filePath = config.pathMd + body.title + '.md';
    utils.fileWrite(filePath, body.content);
    // sql 信息修改
    await db_operate.query(`update articals set
      title="${body.title}",
      tips="${body.tips}",
      type="${body.type}",
      description="${description}",
      update_time="${update_time}" where id="${ctx.params.id}"`
    );
    ctx.body = {
      code: '000000',
      success: true,
      message: '修改成功'
    };
  })
  .post('/del/:id', isLogin, async (ctx, next) => {
    let articals = await db_operate.query(`select * from articals where id = "${ctx.params.id}" limit 1`);

    if (articals.length > 0) {
      let filePath = config.pathMd + articals[0].title + '.md';
      let isExists = await utils.fileExists(filePath);
      if (isExists) {
        utils.fileRem(filePath);
      }
    }

    await db_operate.query(`delete from articals where id = "${ctx.params.id}"`);
    ctx.body = {
      code: '000000',
      success: true,
      message: '删除成功'
    }
  })
  .post('/top/:id', isLogin, async (ctx, next) => {
    await db_operate.query(`update articals set top=0 where top=1`);
    await db_operate.query(`update articals set top=1 where id="${ctx.params.id}"`);
    ctx.body = {
      code: '000000',
      success: true,
      message: '修改成功'
    }
  });

module.exports = router;