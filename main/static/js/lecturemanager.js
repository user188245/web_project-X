"use strict";

var lectureList = [];
var tempTimeList = [];
// mode=0; neutral, mode=1; create, mode2; modify.
var mode = 0;
var target = 0;

function SendLecture(tableName,lecture) {
    this.tableName = tableName;
    this.lecture = lecture;
}

function dragElement(event) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if ($("addpopup_header")) {
        $("addpopup_header").onmousedown = dragMouseDown;
    } else {
        event.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        event.style.top = (event.offsetTop - pos2) + "px";
        event.style.left = (event.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


function prepareLectureView() {
    clearElement("lecture_list");
    var ul = $("lecture_list");
    try {
        for(var i=0; i<lectureList.length; i++) {
            var li = document.createElement("li");
            var s = lectureList[i];


            li.appendChild(document.createTextNode(s.name));
            li.setAttribute("class", "w3-hover-green w3-border");

            var modify = document.createElement("span");
            modify.lecture = s;
            modify.index = i;
            modify.appendChild(document.createTextNode("✎"));
            modify.setAttribute("class", "w3-button");
            modify.observe("click", modifyAdder);
            li.appendChild(modify);

            var remove = document.createElement("span");
            remove.setAttribute("index", i);
            remove.appendChild(document.createTextNode("×"));
            remove.setAttribute("class", "w3-button");
            remove.observe("click", removeLecture);
            li.appendChild(remove);

            ul.appendChild(li);
        }
    }catch(e){
        alert(e.message);
    }
}

function refreshAdder(){
    $("lec_add_name").value = "";
    $("lec_add_instructor").value = "";
    $("lec_add_homepage").value = "http://";
    $("lec_add_week").value = 0;
    $("lec_add_location").value = "";
    $("lec_add_timeStart").value = "00:00";
    $("lec_add_timeEnd").value = "00:00";
    //$("lec_add_credit").value = 0;
    clearElement("lec_add_timeList");
    tempTimeList = [];
}

function openAdder(event) {
    if(mode === 0) {
        refreshAdder();
        var popup = $("lecture_popup");
        popup.style.setProperty("display", "block");
        mode = 1;
    }
}

function closeAdder(event) {
    refreshAdder();
    var popup = $("lecture_popup");
    popup.style.setProperty("display","none");
    mode = 0;
}

function modifyAdder() {
    //alert(this.lecture.name);
    refreshAdder();
    $("lec_add_name").value = this.lecture.name;
    $("lec_add_instructor").value = this.lecture.instructor;
    $("lec_add_homepage").value = this.lecture.homepage;
    tempTimeList = this.lecture.scheduleList;
    prepareTimeView();
    target = this.index;
    var popup = $("lecture_popup");
    popup.style.setProperty("display", "block");
    mode = 2;
}

function reportAdder(event) {
    var popup = $("lecture_popup");
    var name = $("lec_add_name").value;
    var instructor = $("lec_add_instructor").value;
    var homepage = $("lec_add_homepage").value;
    var lecture = new Lecture(name,instructor,homepage,null);
    lecture.setRegularScheduleList(tempTimeList);
    var method = "N/A";
    if(mode === 1) {
        lectureList.push(lecture);
        method = "add";
    }
    else if(mode === 2){
        lectureList[target] = lecture;
        method = "modify";
    }
    prepareLectureView();
    var send = new SendLecture("N/A",lecture);
    postData(method,send);
    popup.style.setProperty("display","none");
    mode = 0;
}

function addTime(event) {
    try {
        var week = $("lec_add_week").value;
        var location = $("lec_add_location").value;
        var startHour = $("lec_add_timeStart").valueAsDate.getUTCHours();
        var startMinute = $("lec_add_timeStart").valueAsDate.getMinutes();
        var endHour = $("lec_add_timeEnd").valueAsDate.getUTCHours();
        var endMinute = $("lec_add_timeEnd").valueAsDate.getMinutes();
        var s = new RegularSchedule(new ScheduleTime(startHour,startMinute,endHour,endMinute),week,location,false,lecture);
        tempTimeList[tempTimeList.length] = s;
        prepareTimeView();
    }catch(e){
        alert(e.message);
    }
}

function removeLecture(event) {
    if (mode === 0 && confirm("정말로 삭제하시겠습니까?")){
        var index = parseInt(this.getAttribute("index"));
        var lecture = lectureList[index];
        lectureList.splice(index, 1);
        prepareLectureView();
        var send = new SendLecture("N/A",lecture.name);
        postData("remove",send);
    }
}

function removeTime(event) {
    tempTimeList.splice(parseInt(this.getAttribute("index")), 1);
    prepareTimeView();
}

function prepareTimeView(){

    clearElement("lec_add_timeList");
    var ul = $("lec_add_timeList");
    try {
        for(var i=0; i<tempTimeList.length; i++) {
            var li = document.createElement("li");
            var s = tempTimeList[i];
            if(!(s.scheduleTime instanceof ScheduleTime))
                s.scheduleTime = parseScheduleTime(s.scheduleTime);
            li.appendChild(document.createTextNode("장소:" + s.location + ", 시간: (" + s.scheduleTime.toString() + "[" + Week[s.week] + "]" + ")　　"));
            li.setAttribute("class", "w3-display-container w3-light-grey");

            var close = document.createElement("span");
            close.setAttribute("index", i);
            close.appendChild(document.createTextNode("×"));
            close.setAttribute("class", "w3-button w3-transparent w3-display-right");
            close.observe("click", removeTime);
            li.appendChild(close);
            ul.appendChild(li);
        }
    }catch(e){
        alert(e.message);
    }
}

function postData(method,data) {
    var param = "csrfmiddlewaretoken=" + csrftoken + "&method=" + method +"&data=" + JSON.stringify(data);
    new Ajax.Request("get/", {
        method: "post",
        parameters: param,
        onSuccess: postSuccess,
        onFailure: ajaxFaulure,
        onException: ajaxFaulure
    })
    $("testing").innerText = param;
}

function postSuccess(ajax) {
    alert("성공적으로 요청되었습니다.");
}

function init(){
    var data = new SendLecture("N/A","");
    var param = "csrfmiddlewaretoken=" + csrftoken + "&method=" + "get" +"&data=" + JSON.stringify(data);

    new Ajax.Request("get/", {
        method: "post",
        parameters: param,
        onSuccess: initLectures,
        onFailure: ajaxFaulure,
        onException: ajaxFaulure
    })
    $("testing").innerText = param;
}

function ajaxFaulure(ajax, exception) {
    alert("Error : \n[Server_status]:" +  ajax.status + "\n[message]:" + ajax.responseText);
    if(exception){
        throw exception;
    }
}

function initLectures(ajax) {
    var json = JSON.parse(ajax.responseText);
    // var json = JSON.parse(sample);
    lectureList = json.lectureList;
    prepareLectureView();
}

document.observe('dom:loaded', function() {
    $("lecture_add").observe("click",openAdder);
    $("lec_add_cancel").observe("click",closeAdder);
    $("lec_add_ok").observe("click",reportAdder);
    $("lec_add_timeButton").observe("click",addTime);
    init();
    dragElement($("addpopup"));
});


var sample = "{\n" +
    "  \"lectureList\": [\n" +
    "    {\n" +
    "      \"name\": \"취침학개론\",\n" +
    "      \"instructor\": \"최드르렁\",\n" +
    "      \"scheduleList\": [\n" +
    "        {\n" +
    "          \"scheduleTime\": {\n" +
    "            \"start_hour\": 10,\n" +
    "            \"start_min\": 0,\n" +
    "            \"end_hour\": 11,\n" +
    "            \"end_min\": 30\n" +
    "          },\n" +
    "          \"week\": 0,\n" +
    "          \"location\": \"제1 취침관 201호\",\n" +
    "          \"isCanceled\": false\n" +
    "        },\n" +
    "        {\n" +
    "          \"scheduleTime\": {\n" +
    "            \"start_hour\": 10,\n" +
    "            \"start_min\": 0,\n" +
    "            \"end_hour\": 12,\n" +
    "            \"end_min\": 30\n" +
    "          },\n" +
    "          \"week\": 2,\n" +
    "          \"location\": \"제3 숙면관 403호\",\n" +
    "          \"isCanceled\": false\n" +
    "        }\n" +
    "      ],\n" +
    "      \"homepage\": \"http://www.durrung.hanyang.ac.kr/lec/sleep2040.html\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"name\": \"대학수면학특론\",\n" +
    "      \"instructor\": \"쿨쿨자\",\n" +
    "      \"scheduleList\": [\n" +
    "        {\n" +
    "          \"scheduleTime\": {\n" +
    "            \"start_hour\": 13,\n" +
    "            \"start_min\": 0,\n" +
    "            \"end_hour\": 16,\n" +
    "            \"end_min\": 0\n" +
    "          },\n" +
    "          \"week\": 0,\n" +
    "          \"location\": \"컨퍼런슬립홀 중강당\",\n" +
    "          \"isCanceled\": false\n" +
    "        },\n" +
    "        {\n" +
    "          \"scheduleTime\": {\n" +
    "            \"start_hour\": 9,\n" +
    "            \"start_min\": 0,\n" +
    "            \"end_hour\": 10,\n" +
    "            \"end_min\": 30\n" +
    "          },\n" +
    "          \"week\": 3,\n" +
    "          \"location\": \"제1 숙면관 203호\",\n" +
    "          \"isCanceled\": false\n" +
    "        }\n" +
    "      ],\n" +
    "      \"homepage\": \"http://www.zrg.hanyang.ac.kr/class/slp4044/2017\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"name\": \"침대세팅방법론\",\n" +
    "      \"instructor\": \"김나잇\",\n" +
    "      \"scheduleList\": [\n" +
    "        {\n" +
    "          \"scheduleTime\": {\n" +
    "            \"start_hour\": 14,\n" +
    "            \"start_min\": 30,\n" +
    "            \"end_hour\": 16,\n" +
    "            \"end_min\": 0\n" +
    "          },\n" +
    "          \"week\": 1,\n" +
    "          \"location\": \"제3 취침관 501호\",\n" +
    "          \"isCanceled\": false\n" +
    "        },\n" +
    "        {\n" +
    "          \"scheduleTime\": {\n" +
    "            \"start_hour\": 14,\n" +
    "            \"start_min\": 30,\n" +
    "            \"end_hour\": 16,\n" +
    "            \"end_min\": 0\n" +
    "          },\n" +
    "          \"week\": 4,\n" +
    "          \"location\": \"제3 취침관 406호\",\n" +
    "          \"isCanceled\": false\n" +
    "        },\n" +
    "        {\n" +
    "          \"scheduleTime\": {\n" +
    "            \"start_hour\": 16,\n" +
    "            \"start_min\": 0,\n" +
    "            \"end_hour\": 17,\n" +
    "            \"end_min\": 30\n" +
    "          },\n" +
    "          \"week\": 4,\n" +
    "          \"location\": \"제4 취침관 301호 수면실습실\",\n" +
    "          \"isCanceled\": false\n" +
    "        }\n" +
    "      ],\n" +
    "      \"homepage\": \"http://www.jajanglab.hanyang.ac.kr/bed2017/class/0\"\n" +
    "    }\n" +
    "  ]\n" +
    "}";

