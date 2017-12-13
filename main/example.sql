insert into main_semester(semester_name, start_day, end_day, user_id_id) values ('2017년 2학기', '2017-09-02', '2017-12-24', 1);

insert into main_class(class_name, professor, credit, homepage, semester_id_id) values('컴퓨터캡스톤디자인', '이석복', 3, NULL, 1);
insert into main_class(class_name, professor, credit, homepage, semester_id_id) values('마이크로프로세서인터페이스', '박성주', 3, 'http://mslab.hanyang.ac.kr/', 1);
insert into main_class(class_name, professor, credit, homepage, semester_id_id) values('웹애플리케이션개발', 'Scott Uk-Jin Lee', 4, 'http://selab.hanyang.ac.kr/courses/cse326/2017/', 1);
insert into main_class(class_name, professor, credit, homepage, semester_id_id) values('컴퓨터네트워크', '이석복', 3, 'http://cnlab.hanyang.ac.kr/', 1);
insert into main_class(class_name, professor, credit, homepage, semester_id_id) values('인공지능', '이상근', 3, 'https://sites.google.com/view/ailab-hyu/courses/2017-2-artificial-intelligence', 1);
insert into main_class(class_name, professor, credit, homepage, semester_id_id) values('시스템프로그래밍', '김정선', 4, 'http://veenker.hanyang.ac.kr/~jskim/cse4009', 1);

insert into main_classtime(weekday, start_time, end_time, location, class_id_id) values(0, '13:00', '14:30', '제1공학관 101호', 6);
insert into main_classtime(weekday, start_time, end_time, location, class_id_id) values(1, '10:30', '12:00', '제1학술관 102호', 3);
insert into main_classtime(weekday, start_time, end_time, location, class_id_id) values(1, '13:00', '14:30', '제1학술관 102호', 4);
insert into main_classtime(weekday, start_time, end_time, location, class_id_id) values(2, '09:00', '10:30', '제5공학관 509호', 5);
insert into main_classtime(weekday, start_time, end_time, location, class_id_id) values(3, '10:30', '12:00', '제4공학관 412호', 2);
insert into main_classtime(weekday, start_time, end_time, location, class_id_id) values(4, '13:00', '14:30', '제1공학관 101호', 3);
insert into main_classtime(weekday, start_time, end_time, location, class_id_id) values(5, '10:00', '17:00', '미정', 1);

insert into main_calendar(date, title, text, place, start_time, end_time, class_id_id) values ('2017-12-14', '예제 일정1', '예제 일정입니다.1', '미정', '14:00', '15:30', 4);
insert into main_calendar(date, title, text, place, start_time, end_time, class_id_id) values ('2017-12-15', '예제 일정2', '예제 일정입니다.2', '미정', '09:00', '10:30', 1);
insert into main_calendar(date, title, text, place, start_time, end_time, class_id_id) values ('2017-12-17', '예제 일정3', '예제 일정입니다.3', '미정', '09:00', '10:30', 1);
insert into main_calendar(date, title, text, place, start_time, end_time, class_id_id) values ('2017-12-18', '예제 일정4', '예제 일정입니다.4', '미정', '10:30', '12:00', 1);








// --------------

select * from main_classtime join (select * from main_class join (select * from main_semester where user_id_id = 1) as a on a.semester_id = main_class.semester_id_id) as b on b.class_id = main_classtime.class_id_id;

select * from main_classtime join (select * from main_class where semester_id_id = 1) as a on a.class_id = main_classtime.class_id_id;


