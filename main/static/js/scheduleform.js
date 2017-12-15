"use strict";
var Week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var Month= ["January","February","March","April","May","June","July","August","September","October","November","December"];

(function() {

    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    Date.prototype.toISOString = function() {
        return this.getUTCFullYear() +
            '-' + pad(this.getUTCMonth() + 1) +
            '-' + pad(this.getUTCDate());
    };

}());



function getTime(hour,minute){
    hour = (hour + parseInt(minute / 60,10)).toString();
    minute = (minute % 60).toString();

    if(hour < 10) {
        hour = "0" + hour;
    }
    if(minute < 10) {
        minute = "0" + minute;
    }

    var string =  hour + ":" + minute;

    return string;
}

function getFormattedDate(date) {
    return Month[date.getMonth()] + "," + date.getDate() + "," + date.getFullYear() + "(" + Week[(date.getDay() + 6) % 7] + ")";
}

function clearElement(ElementId){
    var e = $(ElementId);
    while(e.firstChild)
        e.removeChild(e.firstChild);
}

function parseScheduleTime(instance){
    return new ScheduleTime(instance.start_hour,instance.start_min,instance.end_hour,instance.end_min);
}

function ScheduleTime(start_hour,start_min,end_hour,end_min){
    this.start_hour = start_hour;
    this.start_min  = start_min;
    this.end_hour   = end_hour;
    this.end_min    = end_min;
}

ScheduleTime.prototype = {
    toString : function() {
        return getTime(this.start_hour,this.start_min) + " ~ " + getTime(this.end_hour,this.end_min);
    },
    getStart: function () {
        return getTime(this.start_hour,this.start_min);
    },
    getEnd: function () {
        return getTime(this.end_hour,this.end_min);
    },
    getHour : function() {
        return this.end_hour - this.start_hour;
    },
    getMinute : function() {
        return this.end_min - this.start_min;
    },
    getFloatTime : function() {
        return this.getHour() + this.getMinute()/60;
    },
    getFloatStart : function() {
        return this.start_hour + this.start_min/60;
    },
    getFloatEnd : function() {
        return this.end_hour + this.end_min/60;
    }
};

function Lecture(name,instructor,homepage,separatingColor,id){
    this.name = name;
    this.instructor = instructor;
    this.homepage = homepage;
    this.separatingColor = separatingColor; // WARNNING!! this is private field, do not refer this value.;
    this.scheduleList = [];
    this.id = id;
    this.toJSON = function() {
        return {
            "id": this.id,
            "name": this.name,
            "instructor": this.instructor,
            "homepage": this.homepage,
            "scheduleList": this.scheduleList
        };
    };
}

Lecture.prototype = {
    toString:function () {
        return this.name + "," + this.instructor;
    },
    addRegularSchedule:function(regularSchedule){
        this.scheduleList.push(regularSchedule);
    },
    addRegularScheduleCustom:function(start_hour,start_min,end_hour,end_min,week,location,isInactive,lecture){
        this.scheduleList.push(new RegularSchedule(new ScheduleTime(start_hour,start_min,end_hour,end_min), week, location, isInactive, lecture));
    },
    setRegularScheduleList:function(regularScheduleList){
        this.scheduleList = regularScheduleList;
    }
};

function RegularSchedule(scheduleTime,week,location,isInactive,lecture){
    this.scheduleTime = scheduleTime;
    this.week = week;
    this.location = location;
    this.lecture = lecture;
    this.isInactive = isInactive;
    this.toJSON = function() {
        return {
            "scheduleTime": this.scheduleTime,
            "week": this.week,
            "location": this.location
        };
    };
}

RegularSchedule.prototype = {
    toString : function(){
        return this.scheduleTime.toString() + "," + Week[this.week] + "," + this.location;
    }
};


function IrregularSchedule(name,location,text,scheduleTime,date,saperatingColor,id){
    this.name = name;
    this.location = location;
    this.text = text;
    this.scheduleTime = scheduleTime;
    this.date = date;
    this.saperatingColor = saperatingColor;
    this.id = id;
    this.toJSON = function() {
        return {
            "id":this.id,
            "name": this.name,
            "location": this.location,
            "text": this.text,
            "scheduleTime": this.scheduleTime,
            "date": this.date
        };
    };

}

IrregularSchedule.prototype = {
    toString : function () {
        return this.name + "," + getFormattedDate(this.date) + "," +  this.scheduleTime.toString() +"," + this.location;
    }
};