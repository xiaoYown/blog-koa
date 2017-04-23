const router = require('koa-router')();
const db_operate = require('../mysql').db_operate;

router.get('/:type', function *(){
		try{
			let artical_list = yield db_operate.query(
					`SELECT 
					title,
					id,
					type_name_NO01,
					type_name_NO02, 
					type_name_NO03, 
					DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time, 
					DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%s') AS update_time
					FROM artical WHERE type_NO01="${this.params.type}"`
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