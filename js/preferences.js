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


/****** Function for icons in the events ******/

function addCategoryIcon() {
    for (let event of _events) {
        if (event.category == music){
            specificEvent = event;
        }
    }
}

/****** ICONS FOR CATEGORIES ******/

let music_icon = /*html*/ `
<i class="fas fa-music"></i>
`

