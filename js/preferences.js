"use strict";


function goHome() {
    navigateTo("home");
    window.location.reload();
    document.getElementById("tabbar").style.display = "block";

}

function hideNav() {
    document.getElementById("tabbar").style.display = "none";
}


