const router = require('koa-router')();
const image_util = require('../utils/image_util');

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
});

module.exports = router;
