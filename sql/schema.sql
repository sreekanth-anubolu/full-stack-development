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

insert into blog(category,blog_content, created_by, approved_by) values('Sports', 'Content Sports Latest', 3, 'BOSS');
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
SELECT * FROM blog order by created_ts DESC LIMIT 2;


SELECT * FROM blog order by category;

-- Group By Clause 
-- Grouping the records into summary rows and return one record for each group.
-- Group by is always be used with Aggrgator functions, Min, Max, Count, Sum, Avg

SELECT category, count(*) FROM blog GROUP BY category;


-- Aliasing - Use 'AS' to give an alternative name.
SELECT category, count(*) AS articles_count FROM blog where category in ('Entertainment', 'Sports') GROUP BY category;


select * from student;

select standard, count(standard) as students_count_per_class from student GROUP BY standard;


create table StudentAttend (
	student_id int, 
	attendance boolean
)

insert into StudentAttend values(1, true);
insert into StudentAttend values(1, false);
insert into StudentAttend values(1, true);
insert into StudentAttend values(2, false);
insert into StudentAttend values(3, true);
insert into StudentAttend values(1, false);
insert into StudentAttend values(2, true);
insert into StudentAttend values(3, false);
insert into StudentAttend values(2, true);

select * from StudentAttend;
select student_id, count(*) as presence from StudentAttend WHERE attendance=true 
GROUP BY student_id order by presence limit 1;

create table StudentScore (
	student_id int, 
	score int
)

insert into StudentScore values(2, 99);
insert into StudentScore values(1, 50);
insert into StudentScore values(3, 100);
insert into StudentScore values(4, 70);


select Max(score) from StudentScore group by student_id orde;

select student_id, Min(score) as min_score from StudentScore group by student_id order by min_score limit 1;
select student_id, Max(score) as max_score from StudentScore group by student_id order by max_score DESC limit 1;

-- Table with student_id, subject_id, score
-- Get Sum/Avg of all subjects of each student 
-- Get top/low scorer
-- Get the list of students who scored between 70-90 in Mathematics

--- select COLUMNS from TABLE where CONDITION group by COLOUMN order by COLUMN...

-- Having -- Just like where condition, since where doest work on aggr functions, so when ever we want to filter
-- Data based on aggr functions then we will use Having.

SELECT * from blog;
SELECT category, count(*) FROM blog GROUP BY category HAVING count(*) > 6;


select * from StudentScore
SELECT student_id, max(score) FROM StudentScore GROUP BY student_id HAVING max(score) > 70;


SELECT * from studentscore where score between 70 and 100;

SELECT * from blog where date(created_ts) between date('2021-08-07') and date('2021-08-10');


select distinct date(created_ts) from blog;

select date(created_ts) from blog limit 1;

-- LIKE OPERATOR - DOES SUBSTRING MATCH
select * from student;
insert into student(id, name) values(30, 'Roshni');
select * from student where name='Raj';
select * from student where name='R';
select * from student where name like 'Rosh%';
select * from student where name like '%n';
select * from student where name like '%o%';





