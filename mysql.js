var wrapper = require('co-mysql'),
		mysql 	= require('mysql'); 

var options = {
	host : 'localhost',
	port : 3306 ,
	database : 'blog',
	user: 'root',
	password : 'Mysql_511687372'
};

var pool = mysql.createPool(options);

module.exports.db_operate = wrapper(pool);
