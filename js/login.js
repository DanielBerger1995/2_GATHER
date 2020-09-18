"use strict";

// ========== GLOBAL VARIABLES ========== //
const eventRef = _db.collection("Events");
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
    console.log(user.displayName);
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
}

// ========== PROFILE PAGE FUNCTIONALITY ========== //
// append user data to profile page


// update user data - auth user and database object

// update auth user


// update database user




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