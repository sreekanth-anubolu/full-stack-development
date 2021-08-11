create table Department(
	id 			serial PRIMARY KEY,
	dept_name	varchar(10) NOT NULL UNIQUE
);
insert into Department(dept_name) values('Sales');
insert into Department(dept_name) values('Data Entry');
select * from Department;

drop table Employee;

-- FORIGEN KEY is placed with REFERENCES keyword
-- REFERENCES TABL_NAME(COLUMN_NAME)
CREATE TABLE Employee (
	id  		serial PRIMARY KEY,
	name 		varchar(30) NOT NULL,
	dept_name	varchar(10) NOT NULL REFERENCES Department(dept_name)
);
select * from employee;
insert into Employee(name, dept_name) values('Ram', 'Data Entry');
insert into Employee(name, dept_name) values('John', 'Sales');

drop table product;
CREATE TABLE Product(
	id					serial		NOT NULL UNIQUE,  -- Mandatory
	category			varchar(20),
	name				varchar(20)  NOT NULL, -- Mandatory
   	brand				varchar(20)  NOT NULL, -- Mandatory
   	color				varchar(20),
	price				decimal NOT NULL,	-- Mandatory
   	manufaturing_date  	date,
   	created_by			int REFERENCES Employee, -- Mandatory
   	created_ts   		timestamp NOT NULL DEFAULT now()   -- Mandatory
);

select * from product;

insert into product(category, name, brand, price, created_by) values('Laptop', 'Lenovo Thinkpad', 'Lenovo', 46500, 3);
insert into product(category, name, brand, price, created_by) values('Mobile', 'Samsung a50', 'Samsung', 25500, 4);
-- insert into product(category, name, brand, price, created_by) values('Mobile', 'Samsung a50', 'Samsung', 25500, 10);