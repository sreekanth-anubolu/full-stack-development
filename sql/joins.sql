/*
 Joins are used to combine two or more tabls, based on related columns between those tables.
 
 Generally, with joins we map the records like "one to many" or "many to many" or "one to one"
 
 	1. one to Many
		- One customer can order many products 
	2. Many to Many 
		- Many products many orders
	3. One to One Mapping
		- One user can have one Account
		   - User table (name, phone, email...)
		   - UserProfile (Address, photos)
*/

CREATE TABLE intern (
	id 				SERIAL PRIMARY KEY,
	name 			VARCHAR(40) NOT NULL,
	email 			VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE project (
	id 				SERIAL PRIMARY KEY,
	project_name 	VARCHAR(40) NOT NULL
);

CREATE TABLE InternProject (
	id 				SERIAL PRIMARY KEY,
	project_id 		INT NOT NULL REFERENCES project(id),
	intern_id 		INT NOT NULL REFERENCES intern(id)
);

insert into intern(name, email) values('Sai', 'sai@gmail.com');
insert into intern(name, email) values('Charan', 'charan@gmail.com');
insert into intern(name, email) values('Sreekanth', 'sreekanth@gmail.com');
insert into intern(name, email) values('Nalini', 'nalini@gmail.com');
insert into intern(name, email) values('Venkat', 'venkat@gmail.com');
insert into intern(name, email) values('Ssubash', 'subash@gmail.com');

select * from intern;

insert into project(project_name) values('Facebook');
insert into project(project_name) values('Google');
insert into project(project_name) values('Instagram');
select * from project;

insert into InternProject(intern_id, project_id) values(1, 1);
insert into InternProject(intern_id, project_id) values(4, 1);
insert into InternProject(intern_id, project_id) values(1, 2);
insert into InternProject(intern_id, project_id) values(2, 2);
insert into InternProject(intern_id, project_id) values(2, 1);
insert into InternProject(intern_id, project_id) values(1, 1);
insert into InternProject(intern_id, project_id) values(4, 1);

select * from internproject;

Select i.id, name, project_id from intern as i inner join InternProject as ip on i.id= ip.intern_id order by name;

Select name, project_id from intern left join InternProject on intern.id= InternProject.intern_id order by name;

Select project_name, project_id from project right join InternProject on project.id= InternProject.project_id order by project_name;


Select * from project full join InternProject on project.id= InternProject.project_id order by project_name;
