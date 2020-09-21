"use strict";


function onClickActive() {

    let square = document.getElementById("preference");
    square.classList.toggle("square-active");

}

function goHome() {
    navigateTo("home");
    document.getElementById("tabbar").style.display = "block";
}

function hideNav() {
    document.getElementById("tabbar").style.display = "none";
}