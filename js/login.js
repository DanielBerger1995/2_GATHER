"use strict";

// ========== GLOBAL VARIABLES ========== //
const _movieRef = _db.collection("movies");
const _userRef = _db.collection("users")
let _currentUser;
let _movies;

// ========== FIREBASE AUTH ========== //
// Listen on authentication state change
firebase.auth().onAuthStateChanged(function (user) {
    if (user) { // if user exists and is authenticated
        userAuthenticated(user);
    } else { // if user is not logged in
        userNotAuthenticated();
    }
});

function userAuthenticated(user) {
    _currentUser = user;
    console.log(_currentUser);
    hideTabbar(false);
    init();
    showLoader(false);
}

function userNotAuthenticated() {
    _currentUser = null; // reset _currentUser
    hideTabbar(true);
    showPage("login");

    // Firebase UI configuration
    const uiConfig = {
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        signInSuccessUrl: '#home'
    };
    // Init Firebase UI Authentication
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
    showLoader(false);
}

// show and hide tabbar
function hideTabbar(hide) {
    let tabbar = document.querySelector('#tabbar');
    if (hide) {
        tabbar.classList.add("hide");
    } else {
        tabbar.classList.remove("hide");
    }
}

// sign out user
function logout() {
    firebase.auth().signOut();
    // reset input fields
    document.querySelector('#name').value = "";
    document.querySelector('#mail').value = "";
    document.querySelector('#birthdate').value = "";
    document.querySelector('#hairColor').value = "";
    document.querySelector('#imagePreview').src = "";
}

// ========== PROFILE PAGE FUNCTIONALITY ========== //
// append user data to profile page
function appendUserData() {
    document.querySelector('#name').value = _currentUser.displayName;
    document.querySelector('#mail').value = _currentUser.email;
    document.querySelector('#birthdate').value = _currentUser.birthdate;
    document.querySelector('#hairColor').value = _currentUser.hairColor;
    document.querySelector('#imagePreview').src = _currentUser.img;
}

// update user data - auth user and database object
function updateUser() {
    let user = firebase.auth().currentUser;

    // update auth user
    user.updateProfile({
        displayName: document.querySelector('#name').value
    });

    // update database user
    _userRef.doc(_currentUser.uid).set({
        img: document.querySelector('#imagePreview').src,
        birthdate: document.querySelector('#birthdate').value,
        hairColor: document.querySelector('#hairColor').value
    }, {
        merge: true
    });
}

// ========== Prieview image function ========== //
function previewImage(file, previewId) {
    if (file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            document.querySelector('#' + previewId).setAttribute('src', event.target.result);
        };
        reader.readAsDataURL(file);
    }
}
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
