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

// === Authenticated user SPA behaviour ==== //
function userAuthenticated(user) {
    _currentUser = user;
    console.log(user);
    hideTabbar(false);
    init();
    showLoader(false);

    // Appending currentUser name ans surname to HTML
    document.getElementById("hello").innerHTML = "Hi " + user.displayName;
    document.getElementById("hello_user").innerHTML = user.displayName;
}


//=== New user authentication through email and FB ===/
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
        signInSuccessUrl: '#search'
    };
    // Init Firebase UI Authentication
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
    showLoader(false);
}

//=== sign out user ===//
function logout() {
    firebase.auth().signOut();
}

// ===== TABBAR NAVIGATION ====//

//=== show and hide tabbar ===//
function hideTabbar(hide) {
    let tabbar = document.querySelector('#tabbar');
    if (hide) {
        tabbar.classList.add("hide");
    } else {
        tabbar.classList.remove("hide");
    }
}

//=== Init function for whole SPA ===//
function init() {
    // init user data and favourite movies
    eventRef.doc(_currentUser.uid).onSnapshot({
        includeMetadataChanges: true
    }, function (userData) {
        if (!userData.metadata.hasPendingWrites && userData.data()) {
            _currentUser = {
                ...firebase.auth().currentUser,
                ...userData.data()
            }; //concating two objects: authUser object and userData objec from the db
            appendUserData();
        }

    });
}