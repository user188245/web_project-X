"use strict";

var currentDate;

// mode=0; neutral, mode=1; create, mode2; modify.
var mode = 0;
var target;
var targetID;

var scheduleList = [];



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
    if(active)
        li.setAttribute("class","active");
    li.appendChild(document.createTextNode(param));
    if(Number.isInteger(param)) {
        if(scheduleList[param] !== undefined && scheduleList[param].length > 0){
            var star = document.createElement("span");
            star.appendChild(document.createTextNode("*"));
            li.appendChild(star);
        }
        li.day = param;
        li.observe("click",moveCalendar);
    }
    return li;
}

function moveCalendar(e) {
    currentDate.setDate(this.day);
    makeCalendar(currentDate);
    prepareScheduleView();
}

function prevCalendar(e) {
    currentDate.setMonth(currentDate.getMonth()-1);
    init();
    makeCalendar(currentDate);
    prepareScheduleView();
}

function nextCalendar(e) {
    currentDate.setMonth(currentDate.getMonth()+1);
    init();
    makeCalendar(currentDate);
    prepareScheduleView();
}

function makeCalendar(date) {
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
            days[d].appendChild(makeli("",false));
        for(var i=1; i<=maxDate; i++){
            if(i === nowDay){
                days[d].appendChild(makeli(i,true));
            }else{
                days[d].appendChild(makeli(i,false));
            }
        }
    }
}


//method : get/add/modify/remove

function SendSchedule(tableName,schedule,date) {
    this.tableName = tableName;
    this.schedule = schedule;
    this.date = date;
}


function prepareScheduleView(){
    clearElement("s_list");
    var ul = $("s_list");
    try {
        for(var i=0; i<scheduleList[currentDate.getDate()].length; i++) {

            var li = document.createElement("li");
            var s = scheduleList[currentDate.getDate()][i];


            li.appendChild(document.createTextNode(s.name));
            li.setAttribute("class", "w3-hover-green w3-border");

            var modify = document.createElement("span");
            modify.schedule = s;
            modify.index = i;
            modify.appendChild(document.createTextNode("✎"));
            modify.setAttribute("class", "w3-button");
            modify.observe("click", modifyAdder);
            li.appendChild(modify);

            var remove = document.createElement("span");
            remove.setAttribute("index", i);
            remove.setAttribute("class", "w3-button");
            remove.appendChild(document.createTextNode("×"));
            remove.index = i;
            remove.observe("click", removeSchedule);
            li.appendChild(remove);
            ul.appendChild(li);
        }
    }catch(e){
        alert("error on prepare : date =" + currentDate.getDate());
        alert(e.message);
    }
}


function refreshAdder(){
    $("s_add_name").value = "";
    $("s_add_location").value = "";
    $("s_add_text").value = "";
    $("s_add_timeStart").value = "00:00";
    $("s_add_timeEnd").value = "00:00";
}

function openAdder(event) {
    if(mode === 0) {
        refreshAdder();
        var popup = $("s_popup");
        popup.style.setProperty("display", "block");
        mode = 1;
    }
}

function closeAdder(event) {
    refreshAdder();
    var popup = $("s_popup");
    popup.style.setProperty("display","none");
    mode = 0;
}

function modifyAdder() {
    refreshAdder();
    $("s_add_name").value = this.schedule.name;
    $("s_add_location").value = this.schedule.location;
    $("s_add_text").value = this.schedule.text;
    $("s_add_timeStart").value = this.schedule.scheduleTime.getStart();
    $("s_add_timeEnd").value = this.schedule.scheduleTime.getEnd();
    target = this.index;
    targetID = this.schedule.id;
    var popup = $("s_popup");
    popup.style.setProperty("display", "block");
    mode = 2;
}

function reportAdder(event) {
    var popup = $("s_popup");
    var name = $("s_add_name").value;
    var location = $("s_add_location").value;
    var text = $("s_add_text").value;
    var startHour = $("s_add_timeStart").valueAsDate.getUTCHours();
    var startMinute = $("s_add_timeStart").valueAsDate.getMinutes();
    var endHour = $("s_add_timeEnd").valueAsDate.getUTCHours();
    var endMinute = $("s_add_timeEnd").valueAsDate.getMinutes();
    var schedule = new IrregularSchedule(name,location,text,new ScheduleTime(startHour,startMinute,endHour,endMinute),currentDate.toISOString(),null,null);

    var method = "N/A";
    if(mode === 1) {
        scheduleList[currentDate.getDate()].push(schedule);
        method = "add";
    }
    else if(mode === 2){
        schedule.id = targetID;
        scheduleList[currentDate.getDate()][target] = schedule;
        method = "modify";
    }
    prepareScheduleView();
    var send = new SendSchedule("N/A",schedule,null);
    postData(method,send);
    popup.style.setProperty("display","none");
    makeCalendar(currentDate);
    mode = 0;
}

function removeSchedule(event) {
    if (mode === 0 && confirm("정말로 삭제하시겠습니까?")){
        var schedule = scheduleList[currentDate.getDate()][this.index];
        scheduleList[currentDate.getDate()].splice(this.index, 1);
        prepareScheduleView();
        var send = new SendSchedule("N/A",schedule.id,null);
        postData("remove",send);
        makeCalendar(currentDate);
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
    });
    // $("testing").innerText = param;

}

function postSuccess(ajax) {
    alert("성공적으로 요청되었습니다.");
}

function init(){
    var data = new SendSchedule("N/A",null,currentDate.toISOString());
    var param = "csrfmiddlewaretoken=" + csrftoken + "&method=" + "get" +"&data=" + JSON.stringify(data);

    new Ajax.Request("get/", {
        method: "post",
        parameters: param,
        onSuccess: initSchedules,
        onFailure: ajaxFaulure,
        onException: ajaxFaulure
    });
    // $("testing").innerText = param;
}

function ajaxFaulure(ajax, exception) {
    alert("Error : \n[Server_status]:" +  ajax.status + "\n[message]:" + ajax.responseText);
    if(exception){
        throw exception;
    }
}

function initSchedules(ajax) {
    var json = JSON.parse(ajax.responseText);
    // var json = JSON.parse(sample);
    var jscheduleList = json.scheduleList;
    for(var i=1; i<=31; i++)
        scheduleList[i] = [];
    for(var i=0; i<jscheduleList.length; i++){
        var s = jscheduleList[i];
        var schedule = new IrregularSchedule(s.name,s.location,s.text,new ScheduleTime(s.startHour,s.startMinute,s.endHour,s.endMinute),new Date(s.date),null,s.id);
        scheduleList[schedule.date.getDate()].push(schedule);
    }
}







document.observe('dom:loaded', function() {
    currentDate = new Date();
    var prevs = $$(".prev");
    var nexts = $$(".next");
    for(var i=0; i<prevs.length; i++){
        prevs[i].observe("click", prevCalendar);
    }
    for(var i=0; i<nexts.length; i++){
        nexts[i].observe("click", nextCalendar);
    }
    $("s_add").observe("click",openAdder);
    $("s_add_cancel").observe("click",closeAdder);
    $("s_add_ok").observe("click",reportAdder);
    init();
    makeCalendar(currentDate);
    //alert("첫번째날 요일 : " + Week[startWeek] + "," + "최대 날 : " + maxDate);


});




var sample = "{\n" +
    "  \"scheduleList\": [\n" +
    "    {\n" +
    "      \"id\": 0,\n" +
    "      \"name\": \"임시일정0\",\n" +
    "      \"location\": \"장소0\",\n" +
    "      \"startHour\": 10,\n" +
    "      \"startMinute\": 0,\n" +
    "      \"endHour\": 11,\n" +
    "      \"endMinute\": 30,\n" +
    "      \"date\": \"2017-12-20\",\n" +
    "      \"text\": \"메모0\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"id\": 1,\n" +
    "      \"name\": \"임시일정1\",\n" +
    "      \"location\": \"장소1\",\n" +
    "      \"startHour\": 13,\n" +
    "      \"startMinute\": 0,\n" +
    "      \"endHour\": 15,\n" +
    "      \"endMinute\": 0,\n" +
    "      \"date\": \"2017-12-22\",\n" +
    "      \"text\": \"메모1\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"id\": 2,\n" +
    "      \"name\": \"임시일정2\",\n" +
    "      \"location\": \"장소3\",\n" +
    "      \"startHour\": 11,\n" +
    "      \"startMinute\": 0,\n" +
    "      \"endHour\": 11,\n" +
    "      \"endMinute\": 30,\n" +
    "      \"date\": \"2017-12-25\",\n" +
    "      \"text\": \"메모2\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"id\": 3,\n" +
    "      \"name\": \"임시일정3\",\n" +
    "      \"location\": \"장소4\",\n" +
    "      \"startHour\": 18,\n" +
    "      \"startMinute\": 0,\n" +
    "      \"endHour\": 20,\n" +
    "      \"endMinute\": 0,\n" +
    "      \"date\": \"2017-12-25\",\n" +
    "      \"text\": \"메모3\"\n" +
    "    }\n" +
    "  ]\n" +
    "}";

