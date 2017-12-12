"use strict";

var lectureList = [];
var tempTimeList = [];


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

function openAdder(event) {
    var popup = $("lecture_popup");
    popup.style.setProperty("display","block");
}

function closeAdder(event) {
    var popup = $("lecture_popup");
    popup.style.setProperty("display","none");
}

function reportAdder(event) {
    var popup = $("lecture_popup");
    var name = $("lec_add_name").value;
    var instructor = $("lec_add_instructor").value;
    alert("TEST : " + name + "," + instructor);
    popup.style.setProperty("display","none");
}

document.observe('dom:loaded', function() {
    $("lecture_add").observe("click",openAdder);
    $("lec_add_cancel").observe("click",closeAdder);
    $("lec_add_ok").observe("click",reportAdder);
    dragElement($("addpopup"));
});