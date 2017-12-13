"use strict";

var lectureList = [];
var tempTimeList = [];
// mode=0; neutral, mode=1; create, mode2; modify.
var mode = 0;
var target = 0;

function SendLecture(method,tableName,lecture) {
    this.method = method;
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
    var send = new SendLecture(method,"N/A",lecture);
    $("testing").innerText = JSON.stringify(send);
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
        var send = new SendLecture("remove","N/A",lecture.name);
        $("testing").innerText = JSON.stringify(send);
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
            li.appendChild(document.createTextNode("장소:" + s.location + ", 시간: (" + s.scheduleTime + "[" + Week[s.week] + "]" + ")　　"));
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



document.observe('dom:loaded', function() {
    $("s_add").observe("click",openAdder);
    $("s_add_cancel").observe("click",closeAdder);
    $("s_add_ok").observe("click",reportAdder);

    dragElement($("addpopup"));
});