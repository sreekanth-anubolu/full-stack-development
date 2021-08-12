

create table CricketScore (
	name varchar(20),
	score smallint
);

select * from CricketScore;
select name, min(score) from CricketScore group by name order by name;
select name, max(score) from CricketScore group by name order by name;
select name, round(avg(score), 2) from CricketScore group by name order by name;
select name, sum(score) from CricketScore group by name order by name;

insert into CricketScore values('Sachin', 300);
insert into CricketScore values('Sachin', 200);
insert into CricketScore values('Sachin', 100);
insert into CricketScore values('Sachin', 50);
insert into CricketScore values('Sachin', 150);
insert into CricketScore values('Sachin', 400);

insert into CricketScore values('Kohli', 200);
insert into CricketScore values('Kohli', 60);

insert into CricketScore values('Rohit', 300);
insert into CricketScore values('Rohit', 450);
