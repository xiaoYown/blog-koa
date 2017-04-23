var wrapper = require('co-mysql'),
	mysql 	= require('mysql'); 

var options = {
	host : 'localhost',
	port : 3306 ,
	database : 'blog_test',
	user: 'root',
	password : '511687372'
};

var pool = mysql.createPool(options);

module.exports.db_operate = wrapper(pool);