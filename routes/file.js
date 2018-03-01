const fs = require('fs');
const router = require('koa-router')();

const image_config = require('../config/image_config');
const isLogin = require('../utils/login').isLogin;
const multer = require('koa-multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, image_config.files_path);
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
});

router.get('/', isLogin , async (ctx, next) => {
	await ctx.render('admin', {layout: false});
})
.post('/upload_piece', upload.single('file'), async (ctx, next) => {

	// var task = ctx.form.get('task_id')  // 获取文件的唯一标识符
	// var chunk = ctx.form.get('chunk', 0)  // 获取该分片在所有分片中的序号
	// var filename = task + chunk  // 构造该分片的唯一标识符

	// upload_file = ctx.files['file']
	// upload_file.save('./upload/%s' % filename)  // 保存分片到本地

	ctx.body = {
		code: 0
	}
})
.get('/merge_piece', async (ctx, next) => {
	let task = ctx.req.query.task_id  // 获取文件的唯一标识符
	let uploadType = ctx.req.query.type
	let ext = ctx.req.query.ext

	// if (ext.length === 0 && uploadType) {
	// 	ext = uploadType.split('/')[1]
	// }
	// ext = ext.length === 0 ? '' ? '.' + ext // 构造文件后缀名
	
	// chunk = 0  // 分片序号
	// with open('./upload/%s%s' % (task, ext), 'wb') as target_file:  // 创建新文件
	// 		while True:
	// 				try:
	// 						filename = './upload/%s%d' % (task, chunk)
	// 						source_file = open(filename, 'rb')  // 按序打开每个分片
	// 						target_file.write(source_file.read())  // 读取分片内容写入新文件
	// 						source_file.close()
	// 				except IOError as msg:
	// 						break

	// 				chunk += 1
	// 				os.remove(filename)  // 删除该分片，节约空间
})

module.exports = router;