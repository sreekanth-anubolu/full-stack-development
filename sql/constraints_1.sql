--- Constraints
/*
Product
   id			int
   category		varchar(20)
   name			varchar(20)
   brand		varchar(20)
   color		varchar(20)
   price		decimal
   manufaturing_date  date
   created_by	varchar(20)
   created_ts   timestamp
*/

CREATE TABLE Product(
	id					serial		NOT NULL UNIQUE,  -- Mandatory
	category			varchar(20),
	name				varchar(20)  NOT NULL, -- Mandatory
   	brand				varchar(20)  NOT NULL, -- Mandatory
   	color				varchar(20),
	price				decimal NOT NULL,	-- Mandatory
   	manufaturing_date  	date,
   	created_by			varchar(20) NOT NULL, -- Mandatory
   	created_ts   		timestamp NOT NULL DEFAULT now()   -- Mandatory
);


insert into product(category, name, brand, price, created_by) values('Laptop', 'Lenovo Thinkpad', 'Lenovo', 46500, 'Ram')
insert into product(category, name, brand, price, created_by) values('Mobile', 'Samsung a50', 'Samsung', 25500, 'Ram')

update product set id=4 where name='Samsung a50';
select * from product;

drop table product;

-- PRIMARY KEY - Combination of NOT NULL and UNIQUE
-- There should be only one Primary Key per table
CREATE TABLE Product(
	id					serial	PRIMARY KEY,  -- Mandatory
	category			varchar(20),
	name				varchar(20)  NOT NULL, -- Mandatory
   	brand				varchar(20)  NOT NULL, -- Mandatory
   	color				varchar(20),
	price				decimal NOT NULL,	-- Mandatory
   	manufaturing_date  	date,
   	created_by			varchar(20) NOT NULL, -- Mandatory
   	created_ts   		timestamp NOT NULL DEFAULT now()   -- Mandatory
);

insert into product(category, name, brand, price, created_by) values('Laptop', 'Lenovo Thinkpad', 'Lenovo', 46500, 'Ram');
insert into product(category, name, brand, price, created_by) values('Mobile', 'Samsung a50', 'Samsung', 25500, 'Ram');

update product set id=null where name='Samsung a50';



