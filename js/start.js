"use strict";

const _eventRef = _db.collection("Events");

_eventRef.onSnapshot(function (snapshotData) {
    let events = [];
    snapshotData.forEach(function (doc) {
        let event = doc.data();
        event.id = doc.id;
        events.push(event);
    });
    appendEvents(events);
});

// append events to the DOM
function appendEvents(events) {
    let htmlTemplate = "";
    for (let event of events) {
        console.log(event);
        htmlTemplate += `
        <article>
        <h2>$(event.Date)</h2>
        <h2>$(event.Location)</h2>
        </article>
        `;
    }
    document.querySelector('#movie-container').innerHTML = htmlTemplate;
}