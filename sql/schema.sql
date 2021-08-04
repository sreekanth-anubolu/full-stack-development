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


select * from cart;

select * from cart where cid=10;
