"use strict";
var Week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var Month= ["January","February","March","April","May","June","July","August","September","October","November","December"];

var xmlns = "http://www.w3.org/2000/svg";



/*


 */
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
    return Month[date.getMonth()] + "," + date.getDate() + "," + date.getFullYear();
}

function ScheduleTime(start_hour,start_min,end_hour,end_min){
    this.start_hour = start_hour;
    this.start_min  = start_min;
    this.end_hour   = end_hour;
    this.end_min    = end_min;
}

ScheduleTime.prototype = {
    toString : function(){
        return getTime(this.start_hour,this.start_min) + " ~ " + getTime(this.end_hour,this.end_min);
    },
    getHour : function(){
        return this.end_hour - this.start_hour;
    },
    getMinute : function(){
        return this.end_min - this.start_min;
    },
    getFloatTime : function(){
        return this.getHour() + this.getMinute()/60;
    },
    getFloatStart : function(){
        return this.start_hour + this.start_min/60;
    },
    getFloatEnd : function(){
        return this.end_hour + this.end_min/60;
    }
};

function Lecture(name,instructor,separatingColor){
    this.name = name;
    this.instructor = instructor;
    this.separatingColor = separatingColor;
    this.scheduleList = [];
}

Lecture.prototype = {
    toString:function () {
        return this.name + "," + this.instructor;
    },
	addRegularSchedule:function(regularSchedule){
		this.scheduleList.push(regularSchedule);
	},
	addRegularScheduleCustom:function(start_hour,start_min,end_hour,end_min,week,location,lecture){
	    this.scheduleList.push(new RegularSchedule(new ScheduleTime(start_hour,start_min,end_hour,end_min), week, location, lecture));
    }
};

function RegularSchedule(scheduleTime,week,location,lecture){
	this.scheduleTime = scheduleTime;
	this.week = week;
	this.location = location;
	this.lecture = lecture;

}

RegularSchedule.prototype = {
    toString : function(){
        return this.scheduleTime.toString() + "," + Week[this.week] + "," + this.location;
    }
};

var rectOnClickEvent = function(){
    alert("Selected Lecture-Unit : " + this.schedule.toString() + " & Selected Lecture : " + this.lecture.toString());
}




function WeeklyTimeTable(timeTable,tableName){

    this.svg = document.createElementNS(xmlns,"svg");
    this.style = window.getComputedStyle(timeTable,null);

    this.width = timeTable.getAttribute("width");
    this.height= timeTable.getAttribute("height");

    /*tentative value*/
    this.startTime = 7;
    this.count = 24;
    this.interval = 30;
    this.date = new Date();

    this.lectureList = [];


    /* */


    /*definitive value*/
    this.tableName = tableName;
    this.svg.setAttribute("width",this.width.toString());
    this.svg.setAttribute("height",this.height.toString());

    this.setDefaultEventListener();
    timeTable.appendChild(this.svg);

}
WeeklyTimeTable.prototype = {
    onCreate: function(startTime,count,interval,date){
        if(startTime !== null) {this.startTime = startTime;}
        if(count !== null) {this.count = count;}
        if(interval !== null) {this.interval = interval;}
        if(date !== null) {this.date = date;}
        this.refresh();
    },
    refresh: function () {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        var headHeight = (this.height)/20;
        var topWidth = this.width/7;
        var topHeight= (this.height)/20;
        var xUnit = (this.width-topWidth)/7;
        var yUnit = (this.height-(topHeight+headHeight))/this.count;
        /* drawing */
        this.createRect(0,0,this.width,headHeight,"topHeader");
        this.createText(0,headHeight,2,-2,null,null,getFormattedDate(this.date),"topHeader");
        this.createRect(0,headHeight,topWidth,topHeight,"xHeader",this.svg);
        for(var j=0; j<7; j++){
            var x = topWidth+(xUnit*j);
            this.createRect(x,headHeight,xUnit,topHeight,"xHeader");
            this.createText(x,headHeight+topHeight,2,-2,null,null,Week[j],"xHeader");
        }
        for(var i=0; i<(this.count+1)/2; i++) {
            this.createRect(0,headHeight+topHeight+i*yUnit,topWidth,yUnit,"yHeader");
            this.createText(topWidth,headHeight+topHeight+i*yUnit,-1,1,"end","hanging",getTime(this.startTime,this.interval*i),"yHeader");
            for(j=0; j<7; j++){
                this.createRect(xUnit*j + topWidth,headHeight+topHeight+i*yUnit,xUnit,yUnit,"table");
            }
        }
        var xStart = topWidth;
        var yStart = headHeight+topHeight;
        var lec;
        var rect;
        for(i=0; i<this.lectureList.length; i++){
            lec = this.lectureList[i];
            for(j=0; j<lec.scheduleList.length; j++){
                var sUnit = lec.scheduleList[j];
                var floatHour = sUnit.scheduleTime.getFloatTime();
                var targetY = yStart+yUnit*(sUnit.scheduleTime.getFloatStart() - this.startTime)*(60/this.interval);
                var targetHeight = yUnit*sUnit.scheduleTime.getFloatTime()*(60/this.interval);
                rect = this.createRect(xStart+xUnit*sUnit.week ,targetY,xUnit,targetHeight,"lecture");
                rect.style.setProperty("fill",lec.separatingColor);
                this.createText(xStart+xUnit*sUnit.week ,targetY,0,0,null,"hanging",lec.name + "/" + sUnit.location,"lecture").setAttribute("id","import_wrap");
                d3plus.textwrap().container("#import_wrap:last-child").resize(false).draw();
                rect.lecture = lec;
                rect.schedule = sUnit;
                rect.addEventListener("click",rectOnClickEvent);
            }
        }


    },setDefaultEventListener: function(){
        this.svg.addEventListener("contextmenu",function(e){e.preventDefault();});
    }, setOnClickEventListener: function(event){
        this.svg.observe("click",event);
    },addLecture: function(lecture){
        this.lectureList.push(lecture);
        this.refresh();
    },createRect: function(x,y,width,height,className){
        var unit = document.createElementNS(xmlns,"rect");
        if(className !== null) {
            unit.setAttribute("class",className);
        }
        unit.setAttribute("x",x);
        unit.setAttribute("y",y);
        unit.setAttribute("width",width);
        unit.setAttribute("height",height);
        this.svg.appendChild(unit);
        return unit;
    },createText: function(x,y,dx,dy,rowAlign,colAlign,text,className){
        var unit = document.createElementNS(xmlns,"text");
        if(className !== null) {
            unit.setAttribute("class",className);
        }
        unit.setAttribute("x",x);
        unit.setAttribute("y",y);
        unit.setAttribute("dx",dx);
        unit.setAttribute("dy",dy);
        if(rowAlign != null) {
            unit.setAttribute("text-anchor", rowAlign);
        }
        if(colAlign != null) {
            unit.setAttribute("alignment-baseline", colAlign);
        }
        var textNode = document.createTextNode(text);
        unit.appendChild(textNode);
        this.svg.appendChild(unit);

        return unit;
    }
};








/*

    테스트 빌드 코드

 */


document.observe('dom:loaded', function() {
    var weeklyTimeTables = $$("div.weeklyTimeTable");
    for(var i=0; i<weeklyTimeTables.length; i++) {

        var lec = new Lecture("취침학개론","최드르렁","Red");
        lec.addRegularScheduleCustom(10,0,11,30,0,"제1 취침관 201호",lec);
        lec.addRegularScheduleCustom(10,0,12,30,2,"제3 숙면관 403호",lec);

        var lec2 = new Lecture("대학수면학특론","쿨쿨자","Blue");
        lec2.addRegularScheduleCustom(13,0,16,0,0,"컨퍼런슬립홀 중강당",lec);
        lec2.addRegularScheduleCustom(9,0,10,30,3,"제1 숙면관 203호",lec);


        var weeklyTimeTable = new WeeklyTimeTable(weeklyTimeTables[i],"SAMPLE WEEKLY-TIMETABLE");
        weeklyTimeTable.addLecture(lec);
        weeklyTimeTable.addLecture(lec2);
        weeklyTimeTable.onCreate(9, 32, 30,null);

    }
});


