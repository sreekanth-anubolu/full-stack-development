CREATE TABLE Student
(
    id serial,
    name varchar(100),
    dob date,
    standard smallint
);

select * from Student;

select name from Student;

select name, standard from Student;
select name, standard from Student where standard=4;

insert into Student(name, dob, standard) values('Rani', now(), 10);
insert into Student(name, dob, standard) values('Subash', now(), 5);
insert into Student(name, dob, standard) values('Sita', now(), 3);
insert into Student(name, dob, standard) values('Roshan', now(), 4);


CREATE TABLE Cart
(
    id serial,
    cid int,
    product_id int,
    created date default now()
);

insert into cart(cid, product_id) values(10, 20);
insert into cart(cid, product_id) values(10, 25);
insert into cart(cid, product_id) values(10, 30);
insert into cart(cid, product_id) values(15, 20);

insert into cart(cid, product_id) values(15, 25);
select * from cart;

select * from cart where cid=10;

select * from cart where created='2021-08-04' and cid=15;


select now();

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE BlogPost
(
    id 					serial,
	uuid				UUID default uuid_generate_v1(),
	category 			varchar(200),
	content				text,
	created_ts			timestamp with time zone default now(),
	updated_ts			timestamp without time zone default now(),
	created_by			int,
	is_published		boolean default false
);

drop table BlogPost;

insert into blogpost(category,content, created_by) values('Political', 'Content Political', 1);

select * from blog;

-- RENAME TABLE
ALTER TABLE BlogPost RENAME TO Blog;
-- RENAME COLUMN NAME
ALTER TABLE Blog RENAME COLUMN content TO blog_content;
-- ADD COLUMN TO TABLE
ALTER TABLE Blog ADD COLUMN approved_by int;
-- DROP COLUMN 
ALTER TABLE Blog DROP COLUMN uuid;
-- MODIFY/ALTER COLUMN DATATYPE 
ALTER TABLE Blog ALTER COLUMN approved_by TYPE varchar(200);

insert into blog(category,blog_content, created_by, approved_by) values('Sports', 'Content Sports', 3, 'BOSS');
insert into blog(category,blog_content, created_by, approved_by) values('Beauty', 'Content Beauty', 2, 'BOSS');
insert into blog(category,blog_content, created_by, approved_by) values('Advertismnet', 'Content Addvertismnet', 3, 'BOSS');
insert into blog(category,blog_content, created_by, approved_by) values('Entertainment', 'Content Entertainment', 1, 'BOSS');
insert into blog(category,blog_content, created_by, approved_by) values('Political', 'Content Political', 2, 'BOSS');

select * from blog;

-- UPDATE 
-- UPDATE ALL THE VALUES IN THE COLUMN
UPDATE blog SET approved_by='EDITOR';
-- UPDATE SPECIFIC VALUES IN THE COLUMN BY WHERE CLAUSE 
UPDATE blog SET approved_by='COACH' WHERE category='Sports';
UPDATE blog SET approved_by='DESIGNER' WHERE category='Beauty' or category='Advertismnet';
UPDATE blog SET approved_by='DESIGN' WHERE category in ('Beauty', 'Advertismnet');
UPDATE blog SET approved_by='Analyst' WHERE category='Political' and created_by=2;

-- DELETE 
-- DELETE ALL THE RECORDS
DELETE FROM blog;
-- UPDATE SPECIFIC RECORDS USING WHERE CLAUSE 
DELETE FROM blog WHERE category='Addvertismnet';
DELETE FROM blog WHERE created_by=2;


SELECT category FROM blog;

-- TO GET DISTNICT or UNIQUE Values
SELECT DISTINCT category FROM blog;
SELECT DISTINCT approved_by FROM blog;

-- TO GET NUMBER/COUNT OF RECORDS
SELECT COUNT(*) from blog;
SELECT COUNT(*) from blog where category='Political';

SELECT * FROM blog WHERE approved_by='COACH' or approved_by='Analyst';
SELECT * FROM blog WHERE approved_by in ('COACH', 'Analyst');
SELECT COUNT(*) FROM blog WHERE approved_by in ('COACH', 'Analyst');

-- SORTING
-- ORDER BY SHOULD BE USED TO SORT THE RECORDS BY COLUMN NAME
-- DEFAULT IS ASSENDING (ASC), FOR DECENDING use DESC.
SELECT category, created_by FROM blog order by created_by;
SELECT category, created_by FROM blog order by created_by ASC;
SELECT category, created_by FROM blog order by created_by DESC;
SELECT category FROM blog order by category;

-- LIMIT THE NUMBER OF RECORDS
SELECT * FROM blog order by created_ts DESC LIMIT 1;

