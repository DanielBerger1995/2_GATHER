"use strict";

const _eventRef = _db.collection("Events");
let _selectedImgFile = "";




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
        <div class= "event_date"
                <h4>${event.month}</h4>
                <h5 class="text-adjust">${event.day}</h5>
            </div>
            <div class="event_title">
                <h2>${event.name}</h2>
                <p class="text-adjust" >Organiser: ${event.organiser}</p>
            </div>
            <h7 clas="event_price">${event.price}</h7>
        </div>
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
    let imageInput = document.querySelector('#imagePreview');
    let priceInput = document.querySelector('#price');
    let freeInput = document.querySelector('#free');
    let categoriesInput = document.querySelector('#categories');

    let newEvent = {
        name: nameInput.value,
        description: descriptionInput.value,
        img: imageInput.src,
        price: priceInput.value,
        price: freeInput.value = "FREE",
        category: categoriesInput.value
    };
    _eventRef.add(newEvent);
    document.getElementById("create").style.display = "none";
    document.getElementById("myForm").reset();

}

//////////SEARCHBAR FUNCIONALITY
function search(searchValue) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        searchValue = searchValue.toLowerCase();
        let filteredEvents = events.filter(event => event.name.toLowerCase().includes(searchValue));

        console.log(filteredEvents);


    });
};





function previewImage(file, previewId) {
    if (file) {
        _selectedImgFile = file;
        let reader = new FileReader();
        reader.onload = event => {
            document.querySelector('#' + previewId).setAttribute('src', event.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// button to open the form

function openForm() {
    document.getElementById("create").style.display = "block";
}


function closeIcon() {
    document.getElementById("create").style.display = "none";
}

function showMe() {
    document.querySelector("#party").innerHTML = "HALLOWEEN PARTY";
}


// appearing created events in the profile

function init() {
    // init user data and favourite movies
    _userRef.doc(_currentUser.uid).onSnapshot({
        includeMetadataChanges: true
    }, function (userData) {
        if (!userData.metadata.hasPendingWrites && userData.data()) {
            _currentUser = {
                ...firebase.auth().currentUser,
                ...userData.data()
            }; //concating two objects: authUser object and userData objec from the db
            appendUserData();
            appendFavMovies(_currentUser.favMovies);
            if (_movies) {
                appendMovies(_movies); // refresh movies when user data changes
            }
            showLoader(false);
        }
    });
}







