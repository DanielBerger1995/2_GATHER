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
        <img src="${event.img}">
        <h2>${event.name}</h2>
    <h2>${event.date}</h2>
    <p>${event.description}</p>
    <p>${event.location}</p>
<p>${event.time}</p>
       
        </article>
        `;
    }
    document.querySelector('#movie-container').innerHTML = htmlTemplate;
}














// create new event
// add a new event to firestore 



function createAnEvent() {

    let nameInput = document.querySelector('#name');
    let descriptionInput = document.querySelector('#description');

    let newEvent = {
        name: nameInput.value,
        description: descriptionInput.value,
    };
    _eventRef.add(newEvent);
    document.getElementById("create").style.display = "none";

}

// button to open the form

function openForm() {
    document.getElementById("create").style.display = "block";

}



/*

    _userRef.add(newUser);
    navigateTo("home");
}
*/













