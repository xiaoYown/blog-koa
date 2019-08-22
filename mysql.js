const wrapper = require('co-mysql');
const mysql = require('mysql'); 

const options = {
	host : '192.168.3.9',
	port : 3306 ,
	database : 'blog',
	user: 'root',
	password : 'Mysql_511687372'
};

const pool = mysql.createPool(options);

module.exports.db_operate = wrapper(pool);
