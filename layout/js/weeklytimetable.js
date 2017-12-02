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
    this.toString = function(){
        return getTime(start_hour,start_min) + " ~ " + getTime(end_hour,end_min);
    };
}

function Lecture(name,instructor,separatingColor){
    this.name = name;
    this.instructor = instructor;
    this.separatingColor = separatingColor;
    this.scheduleList = [];
}

Lecture.prototype = {
	addRegularSchedule:function(regularSchedule){
		this.scheduleList.add(regularSchedule);
	},
	addRegularScheduleCustom:function(start_hour,start_min,end_hour,end_min,week,location){
	    this.scheduleList.add(new RegularSchedule(new ScheduleTime(start_hour,start_min,end_hour,end_min), week, location));
    }
};

function RegularSchedule(scheduleTime,week,location){
	this.scheduleTime = scheduleTime;
	this.week = week;
	this.location = location;
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
        var rect;
        var headHeight = (this.height)/20;
        var topWidth = this.width/7;
        var topHeight= (this.height)/20;
        var xUnit = (this.width-topWidth)/7;
        var yUnit = (this.height-(topHeight+headHeight))/this.count;
        /* drawing */
        rect = this.createRect(0,0,this.width,headHeight,"topHeader",this.svg);
        this.createText(0,headHeight,getFormattedDate(this.date),"topHeader",rect);
        this.createRect(0,headHeight,topWidth,topHeight,null,this.svg);
        for(var j=0; j<7; j++){
            var x = topWidth+(xUnit*j);
            rect = this.createRect(x,headHeight,xUnit,topHeight,"xHeader",this.svg);
            this.createText(x,headHeight+topHeight,Week[j],"topHeader",rect);
        }
        for(var i=0; i<this.count+1; i++) {
            rect = this.createRect(0,headHeight+topHeight+i*yUnit,topWidth,yUnit,"yHeader",this.svg);
            this.createText(0,headHeight+topHeight+(i+1)*yUnit,getTime(this.startTime,this.interval*i),"topHeader",rect);
            for(j=0; j<7; j++){
                rect = this.createRect(xUnit*j + topWidth,headHeight+topHeight+i*yUnit,xUnit,yUnit,"table",this.svg);
            }
        }

    },setDefaultEventListener: function(){
        this.svg.addEventListener("contextmenu",function(e){e.preventDefault();});
    },
    setOnClickEventListener: function(event){
        this.svg.observe("click",event);
    },addLecture: function(lecture){

    },createRect: function(x,y,width,height,className,parent){
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
    },createText: function(x,y,text,className,parent){
        var unit = document.createElementNS(xmlns,"text");
        if(className !== null) {
            unit.setAttribute("class",className);
        }
        unit.setAttribute("x",x);
        unit.setAttribute("y",y);
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
        var weeklyTimeTable = new WeeklyTimeTable(weeklyTimeTables[i],"SAMPLE WEEKLY-TIMETABLE");
        weeklyTimeTable.onCreate(9, 8, 30,null);
    }
});