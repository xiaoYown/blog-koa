CREATE TABLE IF NOT EXISTS artical (
	type CHAR(20), 
	type_sub CHAR(20), 
	create_time DATETIME, 
	update_time DATETIME, 
	id VARCHAR(60),
	introduction VARCHAR(200),
	title VARCHAR(30),
	content TEXT(65535)
)