"use strict";

const _eventRef = _db.collection("Events");

function orderByUpcoming() {
    _eventRef.orderBy("date").onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });
        appendEvents(events);
    });
}

orderByUpcoming();

function orderByLocation() {
    _eventRef.orderBy("location").onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });
        appendEvents(events);
    });
}

function orderByFriends() {
    _eventRef.orderBy("name").onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });
        appendEvents(events);
    });
}

// append events to the DOM
function appendEvents(events) {
    let htmlTemplate = "";
    for (let event of events) {
        console.log(event);
        htmlTemplate += `
        <article>
        <img src="${event.img}">
        <div class="padding">
        <h2>${event.name}</h2>
        <h4>${event.month}</h4>
        <h3 class="text-adjust">${event.day}</h3>
        <p class="text-adjust" style="padding: 0 0 0 5px">Organiser: ${event.organiser}</p><br>
        <p style="float:right">${event.price}</p>
        </div>
        </article>
        `;
    }
    document.querySelector('#movie-container').innerHTML = htmlTemplate;
}














