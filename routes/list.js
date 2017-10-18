const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/articals', function *(){
		try{
			let artical_list = yield db_operate.query(
					`SELECT 
					title,
					id,
					type,
					DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
					DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
					FROM articals`
				);
			this.body = {
				code: '000000',
				success: true,
				message: '查询成功',
				data: artical_list,
			}
		} catch(err) {
			this.body = {
				code: '000000',
				success: true,
				message: '无此类文章',
				data: [],
			}
		}
	});

module.exports = router;