CREATE TABLE IF NOT EXISTS artical (
	type CHAR(20), 
	create_time DATETIME, 
	update_time DATETIME, 
	id VARCHAR(60),
	introduction VARCHAR(200),
	tips VARCHAR(200),
	title VARCHAR(30),
	content TEXT(65535)
)