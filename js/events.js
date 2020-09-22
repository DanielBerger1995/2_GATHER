"use strict";

const _eventRef = _db.collection("Events");
let _selectedImgFile = "";
let _events = [];



function orderByUpcoming() {
    _eventRef.orderBy("date").onSnapshot(function (snapshotData) {
        _events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            _events.push(event);
        });
        appendEvents(_events);
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
        let user = [];
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
        <a href="#select-event" onclick="appendEventsDetails('${event.id}')"><article>
        <img src="${event.img}">
            <div class="event_title">
                <h2>${event.name}</h2>
                <h4>${event.date}</h4>
                <p class="text-adjust">Organiser: ${event.organiser}</p>
                <p>${event.location}</p>
                <h7 clas="event_price">${event.price}</h7>
            </div>
        </article></a>
        `;
    }

    document.querySelector('#movie-container').innerHTML = htmlTemplate;

}

// select specific event
function appendEventsDetails(id) {
    console.log(id);
    // references to the input fields
    let specificEvent = "";
    for (let event of _events) {
        if (event.id == id) {
            specificEvent = event;
        }
    }

    let htmlTemplate = "";
    console.log();
    htmlTemplate += `
        <article>
        <img src="${specificEvent.img}">
            <div class="event_title">
                <h2>${specificEvent.name}</h2>
                <h4>${specificEvent.organiser}</h4>
                <h4>${specificEvent.date}</h4>
                <p>${specificEvent.place}</p>
                <p>${specificEvent.description}</p>
                <p>${generateFavEventButton(specificEvent.id)}</p>
                
            </div>
        </article>
        `;

    document.querySelector('#select-event').innerHTML = htmlTemplate;
}

function generateFavEventButton(specificEventId) {
    let btnTemplate = `
    <button onclick="addToFavourites('${specificEventId}')">Add to favourites</button>`;
    if (_currentUser.favEvents && _currentUser.favEvents.includes(specificEventId)) {
        btnTemplate = `
      <button onclick="removeFromFavourites('${specificEventId}')" class="rm">Remove from favourites</button>`;
    }
    return btnTemplate;
}



// append favourite movies to the DOM
async function appendFavEvents(favEventIds = []) {
    let htmlTemplate = "";
    if (favEventIds.length === 0) {
        htmlTemplate = "<p>Please, add movies to favourites.</p>";
    } else {
        for (let eventId of favEventIds) {
            await _eventRef.doc(eventId).get().then(function (doc) {
                let event = doc.data();
                console.log(event);
                event.id = doc.id;
                htmlTemplate += `
         <a href="#select-event" onclick="appendEventsDetails('${event.id}')"><article>
          <div class="ticket-text"><h2>${event.name}</h2>
          <h2>${event.date}</h2>
          <p>${event.location}</p>
          <p>${event.category}</p>
          </div>
          <p class="QR"></p>
        </article></a>
      `;
            });
        }
    }
    document.querySelector('#tickets-container').innerHTML = htmlTemplate;
    document.querySelector('#calendar-container').innerHTML = htmlTemplate;
}

// adds a given movieId to the favMovies array inside _currentUser
function addToFavourites(eventId) {
    showLoader(true);
    _userRef.doc(_currentUser.uid).set({
        favEvents: firebase.firestore.FieldValue.arrayUnion(eventId)
    }, {
        merge: true
    });
}

// removes a given movieId to the favMovies array inside _currentUser
function removeFromFavourites(eventId) {
    showLoader(true);
    _userRef.doc(_currentUser.uid).update({
        favEvents: firebase.firestore.FieldValue.arrayRemove(eventId)
    });
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
    let dateInput = document.querySelector('#date');
    let locationInput = document.querySelector('#location');
    let user = _currentUser;

    let newEvent = {
        name: nameInput.value,
        description: descriptionInput.value,
        img: imageInput.src,
        price: priceInput.value,
        price: freeInput.value = "FREE",
        category: categoriesInput.value,
        date: dateInput.value,
        location: locationInput.value,
        organiser: user.displayName
    };
    _eventRef.add(newEvent);
    document.getElementById("create").style.display = "none";
    document.getElementById("myForm").reset();
    document.getElementById("my-events-section").style.display = "block";

}

// add a new event to the profile page
function hostedEvents(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        let user = _currentUser;

        value = user.displayName;
        let myEvents = events.filter(event => event.organiser.includes(value));

        console.log(myEvents);
        appendMyEvents(myEvents);
    });
}

hostedEvents();

function appendMyEvents(myEvents) {
    let htmlTemplate = "";
    for (let event of myEvents) {
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

    document.querySelector('#my-events-container').innerHTML = htmlTemplate;
}

function hideCategories() {
    document.getElementById("#categories-container").style.display = "none";
}

//////////SEARCHBAR FUNCIONALITY/////////
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

        appendCategories(filteredEvents);


        /* searchbar appending searched events*/
        var search_input = document.getElementById('searchbar');

        if (search_input.value.length == 0) {
            closeFilteredCategories()

        } else {
            document.getElementById("filtered-events").style.display = "block";
            document.getElementById("categories-container").style.display = "none";
        };

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
    document.getElementById("my-events-section").style.display = "none";
}


function closeIcon() {
    document.getElementById("create").style.display = "none";
    document.getElementById("my-events-section").style.display = "block";
}

function showMe() {
    document.querySelector("#party").innerHTML = "HALLOWEEN PARTY";
}


//filtering by categories

function openMusic(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "music";
        let filteredEvents = events.filter(event => event.category.includes("music"));


        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "Music";
    document.getElementById("filtered-events").style.display = "block";

};

function openParty(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "party";
        let filteredEvents = events.filter(event => event.category.includes("party"));


        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "Party";
    document.getElementById("filtered-events").style.display = "block";

};

function openSport(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "sport";
        let filteredEvents = events.filter(event => event.category.includes("sport"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "Sport";
    document.getElementById("filtered-events").style.display = "block";

};

function openArt(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "art";
        let filteredEvents = events.filter(event => event.category.includes("art"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "Art";
    document.getElementById("filtered-events").style.display = "block";

};

function openGames(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "games";
        let filteredEvents = events.filter(event => event.category.includes("games"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "games";
    document.getElementById("filtered-events").style.display = "block";

};

function openFood(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "food";
        let filteredEvents = events.filter(event => event.category.includes("food"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "food";
    document.getElementById("filtered-events").style.display = "block";

};

function openTechnology(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "technology";
        let filteredEvents = events.filter(event => event.category.includes("technology"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "technology";
    document.getElementById("filtered-events").style.display = "block";

};

function openCulture(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "culture";
        let filteredEvents = events.filter(event => event.category.includes("culture"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "culture";
    document.getElementById("filtered-events").style.display = "block";

};

function openEducation(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "education";
        let filteredEvents = events.filter(event => event.category.includes("education"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "education";
    document.getElementById("filtered-events").style.display = "block";

};

function openLiterature(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "literature";
        let filteredEvents = events.filter(event => event.category.includes("literature"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "literature";
    document.getElementById("filtered-events").style.display = "block";

};

function openShopping(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "shopping";
        let filteredEvents = events.filter(event => event.category.includes("shopping"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "Shopping";
    document.getElementById("filtered-events").style.display = "block";

};

function openSightseeing(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "sightseeing";
        let filteredEvents = events.filter(event => event.category.includes("sightseeing"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "sightseeing";
    document.getElementById("filtered-events").style.display = "block";

};

function openMovies(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "movies";
        let filteredEvents = events.filter(event => event.category.includes("movies"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "movies";
    document.getElementById("filtered-events").style.display = "block";

};

function openEnvironment(value) {
    _eventRef.onSnapshot(function (snapshotData) {
        let events = [];
        snapshotData.forEach(function (doc) {
            let event = doc.data();
            event.id = doc.id;
            events.push(event);
        });

        value = "environment";
        let filteredEvents = events.filter(event => event.category.includes("environment"));

        console.log(filteredEvents);
        appendCategories(filteredEvents);
    });
    document.getElementById("categories-container").style.display = "none";
    document.getElementById("searchbar").style.display = "none";
    document.getElementById("closeCatBut").style.display = "block";
    document.getElementById("closeCatBut").innerHTML = "&#10005;" + "&emsp;" + "environment";
    document.getElementById("filtered-events").style.display = "block";
};



function appendCategories(filteredEvents) {
    let htmlTemplate = "";
    for (let event of filteredEvents) {
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
    document.querySelector('#filtered-events').innerHTML = htmlTemplate;

}

function closeFilteredCategories() {
    document.getElementById("filtered-events").style.display = "none";
    document.getElementById("categories-container").style.display = "grid";
    document.getElementById("searchbar").style.display = "block";
    document.getElementById("closeCatBut").style.display = "none";
}


//CALENDAR



