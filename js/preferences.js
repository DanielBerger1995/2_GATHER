"use strict";


function goHome() {
    navigateTo("home");
    window.location.reload();
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

