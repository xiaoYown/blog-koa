const router = require('koa-router')();
const image_util = require('../utils/image_util');
const image_config = require('../config/image_config');
const path = require('path');

const multer = require('koa-multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, image_config.files_path);
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});

var upload = multer({
  storage: storage
});

router.get('/', async (ctx, next) => {
  let folderTree = await image_util.getFolderTree();

  await ctx.render('image', {
    layout: false,
    title: '图片管理',
    folders: folderTree.folders
	})
})
.get('/:url', async (ctx, next) => {
  let folderTree = await image_util.getFolderTree();
  let folders = image_util.getDirs(folderTree, ctx.params.url.split('_'));
	await ctx.render('image', {
    layout: false,
    folders: folders
	})
})
// 添加文件夹
.post('/addfolder', async (ctx, next) => {
  let body = ctx.request.body;
  let folderTree = await image_util.getFolderTree();
  let dirArray = body.dir === '' ? [] : body.dir.split('_');
  let folders = image_util.getDirs(folderTree, dirArray);
  
  for (let i = 0, len = folders.length; i < len; i++) {
    if (folders[i].name == body.name) {
      ctx.body = {
        code: 1,
        message: '该文件夹已存在'
      };
      break;
    }
  }
  image_util.addFolder(folderTree, dirArray, body.name);

  ctx.body = {
    code: 0,
    status: 'success',
    message: '添加成功'
  };
})
// 删除文件夹
.post('/delfolder', async (ctx, next) => {
  let body = ctx.request.body;
  let folderTree = await image_util.getFolderTree();
  let dirArray = body.dir === '' ? [] : body.dir.split('_');
  
  image_util.delFolder(folderTree, dirArray, body.indexs.sort());

  ctx.body = {
    code: 0,
    status: 'success',
    message: '删除成功'
  };
})
// 删除文件夹
.post('/uploadimg', upload.single('infile'), async (ctx, next) => {
  ctx.body = {  
    success: 'success', // 返回文件名
    filename: ctx.req.file.filename
  };
});

module.exports = router;
