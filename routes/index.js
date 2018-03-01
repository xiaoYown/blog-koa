const router = require('koa-router')();

const home = require('./home');
const admin = require('./admin');
const artical = require('./artical');
const list = require('./list');
const login = require('./login');
const image = require('./image');
const file = require('./file');

router.use('/', home.routes(), home.allowedMethods());
router.use('/admin', admin.routes(), admin.allowedMethods());
router.use('/artical', artical.routes(), artical.allowedMethods());
router.use('/list', list.routes(), list.allowedMethods());
router.use('/login', login.routes(), login.allowedMethods());
router.use('/image', image.routes(), image.allowedMethods());
router.use('/file', file.routes(), file.allowedMethods());

module.exports = router;
