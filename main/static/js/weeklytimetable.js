"use strict";
var xmlns = "http://www.w3.org/2000/svg";



var uTimeTable = [];
var selectedSchedule;
var uDate = new Date();

/*


 */

function SendDate(date) {
    this.date = date;
}


function WeeklyTimeTable(timeTable){

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
    this.exceptionalList = [];


    /* */


    /*definitive value*/
    this.tableName = "init";
    this.svg.setAttribute("width",this.width.toString());
    this.svg.setAttribute("height",this.height.toString());

    this.setDefaultEventListener();
    timeTable.appendChild(this.svg);

}
WeeklyTimeTable.prototype = {
    clear: function () {
        this.lectureList = [];
        this.exceptionalList = [];
    },
    onCreate: function(name,startTime,count,interval,date){
        if(name !== null) {this.name = name;}
        if(startTime !== null) {this.startTime = startTime;}
        if(count !== null) {this.count = count;}
        if(interval !== null) {this.interval = interval;}
        if(date !== null) {this.date = date;}
        this.refresh();
    },
    resize: function (width,height) {
        this.width = width;
        this.height=height;
        this.refresh();
    },
    refresh: function () {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        var rect;
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
            rect = this.createRect(x,headHeight,xUnit,topHeight,"xHeader");
            if((this.date.getDay() + 6) % 7 !== j){
                rect.style.setProperty("opacity","0.4");
            }
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
        for(i=0; i<this.lectureList.length; i++){
            lec = this.lectureList[i];
            for(j=0; j<lec.scheduleList.length; j++){
                var sUnit = lec.scheduleList[j];
                var floatHour = sUnit.scheduleTime.getFloatTime();
                var targetY = yStart+yUnit*(sUnit.scheduleTime.getFloatStart() - this.startTime)*(60/this.interval);
                var targetHeight = yUnit*sUnit.scheduleTime.getFloatTime()*(60/this.interval);
                rect = this.createRect(xStart+xUnit*sUnit.week ,targetY,xUnit,targetHeight,"lecture");
                rect.style.setProperty("fill",lec.separatingColor);
                if(sUnit.isInactive){
                    rect.style.setProperty("opacity","0.1");
                }else{
                    rect.style.setProperty("opacity","0.95");
                }
                this.createText(xStart+xUnit*sUnit.week ,targetY,0,0,null,"hanging",lec.name + "/" + sUnit.location,"lecture").setAttribute("id","import_wrap");
                d3plus.textwrap().container("#import_wrap:last-child").resize(false).draw();

                rect.lecture = lec;
                rect.schedule = sUnit;
                rect.addEventListener("click",rectOnClickRegularEvent);
            }
        }
        for(i=0; i<this.exceptionalList.length; i++){
            var sUnit = this.exceptionalList[i];
            var floatHour = sUnit.scheduleTime.getFloatTime();
            var targetY = yStart+yUnit*(sUnit.scheduleTime.getFloatStart() - this.startTime)*(60/this.interval);
            var targetHeight = yUnit*sUnit.scheduleTime.getFloatTime()*(60/this.interval);
            rect = this.createRect(xStart+xUnit*((sUnit.date.getDay() + 6) % 7) ,targetY,xUnit,targetHeight,"lecture");
            rect.style.setProperty("fill",sUnit.saperatingColor);
            rect.style.setProperty("opacity","0.95");
            this.createText(xStart+xUnit*((sUnit.date.getDay() + 6) % 7) ,targetY,0,0,null,"hanging",sUnit.name + "/" + sUnit.location,"lecture").setAttribute("id","import_wrap");
            d3plus.textwrap().container("#import_wrap:last-child").resize(false).draw();
            rect.schedule = sUnit;
            rect.addEventListener("click",rectOnClickIrregularEvent);
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
        if(rowAlign !== null) {
            unit.setAttribute("text-anchor", rowAlign);
        }
        if(colAlign !== null) {
            unit.setAttribute("alignment-baseline", colAlign);
        }
        var textNode = document.createTextNode(text);
        unit.appendChild(textNode);
        this.svg.appendChild(unit);

        return unit;
    }
};

var rectOnClickRegularEvent = function(){
    $("plan_info").style.setProperty("display","none");
    $("lec_info").style.setProperty("display","block");
    $("lec_info_name").innerText = this.lecture.name;
    $("lec_info_instructor").innerText = this.lecture.instructor;
    $("lec_info_homepage").innerText = this.lecture.homepage;
    if(this.schedule.isInactive) {
        $("lec_info_invalid").checked = true;
    }
    else{
        $("lec_info_invalid").checked = false;
    }
    $("lec_info_period").innerText = this.schedule.scheduleTime;
    $("lec_info_location").innerText = this.schedule.location;
    selectedSchedule = this.schedule;
};

var rectOnClickIrregularEvent = function(){
    $("lec_info").style.setProperty("display","none");
    $("plan_info").style.setProperty("display","block");
    $("plan_info_name").innerText = this.schedule.name;
    $("plan_info_date").innerText = getFormattedDate(this.schedule.date);
    $("plan_info_period").innerText = this.schedule.scheduleTime;
    $("plan_info_location").innerText = this.schedule.location;
    selectedSchedule = null;
};


function ajax_TimeTable(data){
    uDate = new Date(data.date);
    var param = "csrfmiddlewaretoken=" + csrftoken + "&data=" + JSON.stringify(data);
    new Ajax.Request("get/", {
        method: "post",
        parameters: param,
        onSuccess: processTimeTable,
        onFailure: ajaxFaulure,
        onException: ajaxFaulure
    });
}

function SendIA(name,schedule,isInactive){
    this.name = name;
    this.schedule = schedule;
    this.isInactive = isInactive;
}

function ajax_alterInactivation(data) {
    var param = "csrfmiddlewaretoken=" + csrftoken + "&data=" + JSON.stringify(data);
    new Ajax.Request("update/", {
        method: "post",
        parameters: param,
        onSuccess: alterInactivation,
        onFailure: ajaxFaulure,
        onException: ajaxFaulure
    });
}

function alterInactivation(ajax) {
    if(selectedSchedule !== undefined && selectedSchedule !== null){
        if(selectedSchedule.isInactive) {
            selectedSchedule.isInactive = false;
        }
        else {
            selectedSchedule.isInactive = true;
        }
    }
    for(var i=0; i<uTimeTable.length; i++) {
        uTimeTable[i].refresh();
    }

}

function ajaxFaulure(ajax, exception) {
    alert("Error : \n[Server_status]:" +  ajax.status + "\n[message]:" + ajax.responseText);
    if(exception){
        throw exception;
    }
}

function processTimeTable(ajax){
    var weeklyTimeTables = $$("div.weeklyTimeTable");
    for(var i=0; i<weeklyTimeTables.length; i++) {
        try {
            var json = JSON.parse(ajax.responseText);
            // var json = JSON.parse(sampleJSON);
            // var weeklyTimeTable = new WeeklyTimeTable(weeklyTimeTables[i], json.name, uDate);
            var weeklyTimeTable = uTimeTable[i];
            weeklyTimeTable.clear();

            for(var i=0; i<json.lectureList.length; i++){
                var jlec = json.lectureList[i];
                var lec = new Lecture(jlec.name,jlec.instructor,jlec.homepage,createRandomColor());
                for(var j=0; j < jlec.scheduleList.length; j++){
                    var jsch = jlec.scheduleList[j];
                    lec.addRegularScheduleCustom(jsch.startHour,jsch.startMinute,jsch.endHour,jsch.endMinute,jsch.week,jsch.location,jsch.isCanceled,lec);
                }
                weeklyTimeTable.addLecture(lec);
            }
            for(var j=0; j < json.exceptionalSchduleList.length; j++){
                var jex = json.exceptionalSchduleList[j];
                weeklyTimeTable.exceptionalList.push(new IrregularSchedule(jex.name,jex.location,jex.text,new ScheduleTime(jex.startHour,jex.startMinute,jex.endHour,jex.endMinute),new Date(jex.date.year,jex.date.month-1,jex.date.day,0,0,0,0),createRandomColor()));
            }
            weeklyTimeTable.onCreate(json.name,9, 20, 60, uDate);
        }catch(err){
            alert("error : " + err.message);
        }

    }
}










/*

    테스트 빌드 코드

 */

var sampleJSON = "{\n" +
    "  \"name\": \"1학기 시간표\",\n" +
    "  \"lectureList\": [\n" +
    "    {\n" +
    "      \"name\": \"취침학개론\",\n" +
    "      \"instructor\": \"최드르렁\",\n" +
    "      \"homepage\":\"http://www.durrung.hanyang.ac.kr/lec/sleep2040.html\",\n" +
    "      \"scheduleList\": [\n" +
    "        {\n" +
    "          \"startHour\": 10,\n" +
    "          \"startMinute\": 0,\n" +
    "          \"endHour\": 11,\n" +
    "          \"endMinute\": 30,\n" +
    "          \"week\": 0,\n" +
    "          \"location\": \"제1 취침관 201호\",\n" +
    "          \"isCanceled\": true\n" +
    "        },\n" +
    "        {\n" +
    "          \"startHour\": 10,\n" +
    "          \"startMinute\": 0,\n" +
    "          \"endHour\": 12,\n" +
    "          \"endMinute\": 30,\n" +
    "          \"week\": 2,\n" +
    "          \"location\": \"제3 숙면관 403호\",\n" +
    "          \"isCanceled\": false\n" +
    "        }\n" +
    "      ]\n" +
    "    },\n" +
    "    {\n" +
    "      \"name\": \"대학수면학특론\",\n" +
    "      \"instructor\": \"쿨쿨자\",\n" +
    "      \"homepage\":\"http://www.zrg.hanyang.ac.kr/class/slp4044/2017\",\n" +
    "      \"scheduleList\": [\n" +
    "        {\n" +
    "          \"startHour\": 13,\n" +
    "          \"startMinute\": 0,\n" +
    "          \"endHour\": 16,\n" +
    "          \"endMinute\": 0,\n" +
    "          \"week\": 0,\n" +
    "          \"location\": \"컨퍼런슬립홀 중강당\",\n" +
    "          \"isCanceled\": false\n" +
    "        },\n" +
    "        {\n" +
    "          \"startHour\": 9,\n" +
    "          \"startMinute\": 0,\n" +
    "          \"endHour\": 10,\n" +
    "          \"endMinute\": 30,\n" +
    "          \"week\": 3,\n" +
    "          \"location\": \"제1 숙면관 203호\",\n" +
    "          \"isCanceled\": false\n" +
    "        }\n" +
    "      ]\n" +
    "    }\n" +
    "  ],\n" +
    "  \"exceptionalSchduleList\": [\n" +
    "    {\n" +
    "      \"name\": \"현대꿈해석학 초청강사특강\",\n" +
    "      \"location\": \"컨퍼런슬립홀 중강당\",\n" +
    "      \"text\": \"특별 초청 강의, 다 듣고 마지막에 상품권 추첨하는거 잊지 않기\",\n" +
    "      \"startHour\": 13,\n" +
    "      \"startMinute\": 0,\n" +
    "      \"endHour\": 15,\n" +
    "      \"endMinute\": 0,\n" +
    "      \"date\": {\n" +
    "        \"year\": 2017,\n" +
    "        \"month\": 12,\n" +
    "        \"day\": 15\n" +
    "      }\n" +
    "    }\n" +
    "  ]\n" +
    "}";

function createRandomColor(){
    var h = Math.floor(Math.random()*360);
    var l = Math.floor(Math.random()*30)+50;
    return "hsl(" + h + ",100%," + l + "%)";
}


function datepicker_event(event) {
    var d = this.valueAsDate;
    ajax_TimeTable(new SendDate(d.toISOString()));
}

function info_hide_event(event) {
    this.parentElement.parentElement.style.setProperty("display","none");
    var inactive = $("lec_info_invalid").checked;
    if(selectedSchedule instanceof RegularSchedule && inactive !== selectedSchedule.isInactive){
        ajax_alterInactivation(new SendIA(selectedSchedule.lecture.name, selectedSchedule, selectedSchedule.isInactive));
    }
}

document.observe('dom:loaded', function() {
    var d = new Date();
    var senddate = new SendDate(d.toISOString());

    var weeklyTimeTables = $$("div.weeklyTimeTable");
    for(var i=0; i<weeklyTimeTables.length; i++) {
        uTimeTable[i] = new WeeklyTimeTable(weeklyTimeTables[i]);
    }

    ajax_TimeTable(senddate);
    // date-picker를 세팅함
    var date_picker = $("datepicker");
    date_picker.observe("change",datepicker_event);

    // footer파트의 info 설정
    $("lec_info_hide").observe("click",info_hide_event);
    $("plan_info_hide").observe("click",info_hide_event);

    onsize();

    //alert($("article").style.getPropertyValue("width"));
});

var onsize = function(event) {
    var weeklyTimeTables = $$("div.weeklyTimeTable");
    for(var i=0; i<weeklyTimeTables.length; i++) {
        weeklyTimeTables[i].setAttribute("width",$("article").offsetWidth);
        uTimeTable[i].resize($("article").offsetWidth,1200);
    }
};

window.onresize = onsize;




