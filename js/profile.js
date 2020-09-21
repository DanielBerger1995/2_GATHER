"use strict";

function openSettings() {
    document.getElementById("settings").style.display = "block";
    document.getElementById("my-events-section").style.display = "none";
}

function closeSettings() {
    document.getElementById("settings").style.display = "none";
    document.getElementById("my-events-section").style.display = "block";
}