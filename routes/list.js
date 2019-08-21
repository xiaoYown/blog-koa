const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

// 只做 table list 类型列表进行获取
router.get('/articals', async (ctx, next) => {
  try {
    let artical_list = await db_operate.query(`
      SELECT title, id, type, top,
      DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
      DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
      FROM articals order by top desc`
    );
    ctx.body = {
      code: '000000',
      success: true,
      message: '查询成功',
      data: artical_list
    }
  } catch (err) {
    ctx.body = {
      code: '000000',
      success: true,
      message: '无此类文章',
      data: []
    }
  }
});

module.exports = router;