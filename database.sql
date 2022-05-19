CREATE  DATABASE Users;
use Users;
create table users(
id varchar(100) unique,
username varchar(50),
fullname varchar(100),
email varchar(100),
age int,
roles varchar(50),
user_password varchar(250)
)


CREATE PROCEDURE insertUser
(
	@id VARCHAR(50) ,  
	@username VARCHAR(50), 
	@fullname VARCHAR(50) ,
	@email VARCHAR(100),
	@age int,
	@roles varchar(50),
	@user_password VARCHAR(250)
	)
AS
BEGIN

INSERT INTO users(id,fullname,username, email, age, roles, user_password)
VALUES(@id,@fullname,@username,@email ,@age, @roles, @user_password)

END
select * from users
--execute insertUser
--@id = '3312',
--@fullname = 'ashina barasa',
--@user_password = '12345',
--@username = 'ashina',
--@email = 'ashina@gmail.com',
--@age = 23,
--@roles = 'student'

CREATE PROCEDURE getUsers
AS
BEGIN

SELECT * FROM users
END

--execute getUsers

CREATE PROCEDURE getUser(@username VARCHAR (50))
AS
BEGIN

SELECT * FROM users WHERE username = @username
END

--execute getUser
--@username = 'ashina'




CREATE PROCEDURE updateUser(@id VARCHAR(50) , @fullname VARCHAR(50), @username varchar(50) 
,@email VARCHAR(150), @age int, @roles varchar(50), @user_password varchar(250))
AS
BEGIN
UPDATE users SET 
		fullname = @fullname , 
		username = @username,
		email =@email,
		age = @age,
		roles = @roles,
		user_password = @user_password
		WHERE id = @id

END

--execute updateUser
--@id = '3312',
--@fullname = 'ashina barasa',
--@user_password = '12345',
--@username = 'ashina.barasa',
--@email = 'ashina3@gmail.com',
--@age = 21,
--@roles = 'engineering student'
select *from users

CREATE PROCEDURE deleteUser(@id VARCHAR (50))
AS
BEGIN
DELETE FROM Users WHERE id =@id
END

execute deleteUser
@id = 'ef09edc0-d1d4-11ec-8dbe-45870c644170'

CREATE PROCEDURE resetpassword(@user_password varchar(250), @id varchar(100))
AS BEGIN
UPDATE users SET 
		user_password = @user_password
		WHERE id = @id
END

--execute resetpassword
--@id = '3312',
--@user_password = 'incorrect'

select *from users

CREATE OR ALTER PROCEDURE login_user(@email varchar(100))
AS
BEGIN 
SELECT * FROM users
WHERE email = @email
END

execute login_user
@email = 'ashina43@gmail.com'