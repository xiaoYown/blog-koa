CREATE TABLE IF NOT EXISTS articals (
	id VARCHAR(60),
	type CHAR(20),
	readers INT,
	thumb_up INT,
	key_time VARCHAR(30),
	create_time DATETIME, 
	update_time DATETIME, 
	description VARCHAR(200),
	tips VARCHAR(200),
	title VARCHAR(30),
	content TEXT(65535),
	top INT(1)
)

# alter table articals add  column readers INT default 0 after type;
# alter table articals add  column thumb_up INT default 0 after readers;
# alter table articals add  column key_time INT after thumb_up;