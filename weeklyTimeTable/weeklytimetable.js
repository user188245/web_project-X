"use strict";
var Week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var Month= ["January","February","March","April","May","June","July","August","September","October","November","December"];







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
    this.exceptionalScheduleList = [];
}

function RegularSchedule(scheduleTime,name,location){

}

/*
 *
 * option:
 *  Postponed/Canceled : 0
 *  Temporary Schedule : 1
 *
 */
function ExceptionalSchedule(scheduleTime,name,location,option){


}



function WeeklyTimeTable(timeTable,tableName){

    this.canvas = document.createElement("canvas");
    this.style = window.getComputedStyle(timeTable,null);
    this.width = this.style.getPropertyValue("--fixed-width");
    this.height= this.style.getPropertyValue("--fixed-height");
    this.canvas.style.width = this.style.getPropertyValue("width");
    this.canvas.style.height = this.style.getPropertyValue("height");

    /*tentative value*/
    this.startTime = 7;
    this.count = 24;
    this.interval = 30;
    this.date = new Date();


    /* */


    /*definitive value*/
    this.tableName = tableName;
    this.canvas.width = this.width;
    this.canvas.height= this.height;

    this.setDefaultEventListener();
    timeTable.appendChild(this.canvas);

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
        this.width = this.style.getPropertyValue("--fixed-width");
        this.height= this.style.getPropertyValue("--fixed-height");
        var ctx = this.canvas.getContext("2d");
        var headHeight = (this.height)/this.count;
        var topWidth = this.width/7;
        var topHeight= (this.height)/this.count;
        var xUnit = (this.width-topWidth)/7;
        var yUnit = (this.height-(topHeight+headHeight))/this.count;
        /* drawing */
        ctx.beginPath();
        ctx.fillStyle = this.style.getPropertyValue("--topHeaderFillColor");
        ctx.rect(0,0,this.width,headHeight);
        ctx.fill();

        ctx.strokeStyle = this.style.getPropertyValue("--topHeaderTextColor");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.style.getPropertyValue("--topHeaderFont");
        ctx.strokeText(getFormattedDate(this.date) , this.width/2,headHeight/2);

        ctx.strokeStyle = this.style.getPropertyValue("--topHeaderLineColor");
        ctx.stroke();

        ctx.rect(0,headHeight,topWidth,topHeight);
        for(var j=0; j<7; j++){
            var x = topWidth+(xUnit*j);
            ctx.beginPath();
            ctx.fillStyle = this.style.getPropertyValue("--xHeaderFillColor");
            ctx.rect(x,headHeight,xUnit,topHeight);
            ctx.fill();

            ctx.strokeStyle = this.style.getPropertyValue("--xHeaderTextColor");
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = this.style.getPropertyValue("--xHeaderFont");
            ctx.strokeText(Week[j] , x+xUnit/2,headHeight+topHeight/2);

            ctx.strokeStyle = this.style.getPropertyValue("--xHeaderLineColor");
            ctx.stroke();

        }
        for(var i=0; i<this.count+1; i++) {
            ctx.beginPath();
            ctx.fillStyle = this.style.getPropertyValue("--yHeaderFillColor");
            ctx.rect(0,headHeight+topHeight+i*yUnit,topWidth,yUnit);
            ctx.fill();
            ctx.strokeStyle = this.style.getPropertyValue("--yHeaderTextColor");
            ctx.textBaseline = "top";
            ctx.textAlign = "right";
            ctx.font = this.style.getPropertyValue("--yHeaderFont");

            ctx.strokeText(getTime(this.startTime,this.interval*i) , topWidth,headHeight+topHeight+i*yUnit);
            ctx.strokeStyle = this.style.getPropertyValue("--yHeaderLineColor");
            ctx.stroke();

            for(j=0; j<7; j++){
                ctx.beginPath();
                ctx.fillStyle = this.style.getPropertyValue("--tableFillColor");
                ctx.rect(xUnit*j + topWidth,headHeight+topHeight+i*yUnit,xUnit,yUnit);
                ctx.fill();
                ctx.strokeStyle = this.style.getPropertyValue("--tableLineColor");
                ctx.stroke();
            }
        }

    },setDefaultEventListener: function(){
        this.canvas.addEventListener("contextmenu",function(e){e.preventDefault();});
    },
    setOnClickEventListener: function(event){
        this.canvas.observe("click",event);
    },addSchedule: function(schedule){

    }
};















/*

    테스트 빌드 코드

 */


document.observe('dom:loaded', function() {
    var weeklytimeTables = $$("div.weeklyTimeTable");
    for(var i=0; i<weeklytimeTables.length; i++) {
        var weeklytimeTable = new WeeklyTimeTable(weeklytimeTables[i],"SAMPLE WEEKLY-TIMETABLE");
        weeklytimeTable.onCreate(9, 22, 30,null);
    }
});