const router = require('koa-router')();
const image_util = require('../utils/image_util');
const formParse = require('co-busbody');
const path = require('path');

router.get('/', function *(){
  let folderTree = yield image_util.getFolderTree();

  yield this.render('image', {
    layout: false,
    title: '图片管理',
    folders: folderTree.folders
	})
})
.get('/:url', function *() {
  let folderTree = yield image_util.getFolderTree();
  let folders = image_util.getDirs(folderTree, this.params.url.split('_'));
	yield this.render('image', {
    layout: false,
    folders: folders
	})
})
// 添加文件夹
.post('/addfolder', function *() {
  let body = this.request.body;
  let folderTree = yield image_util.getFolderTree();
  let dirArray = body.dir === '' ? [] : body.dir.split('_');
  let folders = image_util.getDirs(folderTree, dirArray);
  
  for (let i = 0, len = folders.length; i < len; i++) {
    if (folders[i].name == body.name) {
      return this.body = {
        code: 1,
        message: '该文件夹已存在'
      };
      break;
    }
  }
  image_util.addFolder(folderTree, dirArray, body.name);

  this.body = {
    code: 0,
    status: 'success',
    message: '添加成功'
  };
})
// 删除文件夹
.post('/delfolder', function *() {
  let body = this.request.body;
  let folderTree = yield image_util.getFolderTree();
  let dirArray = body.dir === '' ? [] : body.dir.split('_');
  
  image_util.delFolder(folderTree, dirArray, body.indexs.sort());

  this.body = {
    code: 0,
    status: 'success',
    message: '删除成功'
  };
})
// 删除文件夹
.post('/uploadimg', function *() {
  var parts = formParse(this.request);
  var part;
  var fileNames = [];
  while (part = yield parts) {
    const filename = part.filename;
    fileNames.push(filename);
    const homeDir = path.resolve(__dirname, '..');
    const nrepath = homeDir + '/static/' + filename;
    const stream = fs.createWriteStream(newpath);
    part.pipe(stream);
  }
  if (fileNames.length > 0) {
    console.log('filename', fileNames)
    const imgUrls = []
    for (let item of fileNames) {
      imgUrls.push('/' + item)
    }
  }
  this.body = { code: 0, urls: imgUrls }
});

module.exports = router;
