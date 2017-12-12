"use strict";

var currentDate;

function getMaxDay(date){
    var date = new Date(date);
    date.setDate(32);
    return 32-date.getDate();
}

function getStartWeek(date) {
    var date = new Date(date);
    date.setDate(1);
    return (date.getDay() + 6) % 7;
}

function makeli(param,active) {
    var li = document.createElement("li");
    if(active){
        var span = document.createElement("span");
        span.setAttribute("class","active");
        span.appendChild(document.createTextNode(param));
        li.appendChild(span);
    }else
        li.appendChild(document.createTextNode(param));
    if(Number.isInteger(param)) {
        li.day = param;
        li.observe("click",moveCalendar);
    }
    return li;
}

function moveCalendar(e) {
    currentDate.setDate(this.day);
    makeCalendar(currentDate);
}

function prevCalendar(e) {
    currentDate.setMonth(currentDate.getMonth()-1);
    makeCalendar(currentDate);
}

function nextCalendar(e) {
    currentDate.setMonth(currentDate.getMonth()+1);
    makeCalendar(currentDate);
}

function makeCalendar(date){
    var days = $$("ul.days");
    for(var d=0; d<days.length; d++){
        while(days[d].firstChild)
            days[d].removeChild(days[d].firstChild);
        var startWeek = getStartWeek(date);
        var maxDate = getMaxDay(date);
        var nowDay = date.getDate();
        $("year").innerText = date.getFullYear();
        $("month").innerText = Month[date.getMonth()];
        for(var i=0; i<startWeek; i++)
            days[d].appendChild(makeli(" ",false));
        for(var i=1; i<=maxDate; i++){
            if(i === nowDay){
                days[d].appendChild(makeli(i,true));
            }else{
                days[d].appendChild(makeli(i,false));
            }
        }
    }
}


document.observe('dom:loaded', function() {
    currentDate = new Date();
    makeCalendar(currentDate);
    var prevs = $$(".prev");
    var nexts = $$(".next");
    for(var i=0; i<prevs.length; i++){
        prevs[i].observe("click", prevCalendar);
    }
    for(var i=0; i<nexts.length; i++){
        nexts[i].observe("click", nextCalendar);
    }
    //alert("첫번째날 요일 : " + Week[startWeek] + "," + "최대 날 : " + maxDate);


});





