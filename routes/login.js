const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;
const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');
const PRIVATE_KEY_PATH = path.join(__dirname, '../rsa_1024_priv.pem');

// openssl genrsa -out rsa_1024_priv.pem 1024
// openssl genrsa -out rsa_1024_priv.pem 1024

const PEM = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
const privateKey = new NodeRSA(PEM.toString());

privateKey.setOptions({
    // 这里需要指定RSA padding模式为pkcs1，这是因为前端jsencrypt库采用了pkcs1，而后端node-rsa默认使用的pkcs1_oaep
    // https://stackoverflow.com/questions/33837617/node-rsa-errors-when-trying-to-decrypt-message-with-private-key
    encryptionScheme: 'pkcs1'
});

router.get('/', async (ctx, next) => {
  if( !!ctx.session.user_id )
    ctx.redirect('/admin');
  else
    await ctx.render('login', { layout: false, title: '登录' });
})
.get('/out', async (ctx, next) => {
  ctx.session = null;
  ctx.redirect('/login');
});
router.post('/', async (ctx, next) => {
  let body = ctx.request.body;
  if( !!body.user_id && body.user_pwd ){
    await db_operate.query(`SELECT * FROM admin WHERE user_id="${body.user_id}" LIMIT 1`).then(exists => {
      if (exists[0] && exists[0].user_pwd === privateKey.decrypt(body.user_pwd, 'utf8')) {
        ctx.session.user_id = body.user_id;
        ctx.body = {
          code: '000000',
          success: true,
          message: '登录成功',
        };
      } else {
        ctx.body = {
          code: '000001',
          success: true,
          message: '密码或账户错误',
        };
      }
    }).catch(err => {
      console.log(err);
      ctx.body =  {
        code: '000002',
        success: true,
        message: '密码或账户错误'
      };
    });
  } else {
    ctx.body = {
      code: '000001',
      success: true,
      message: '密码或账户错误'
    };
  }
});

module.exports = router;