"use strict";

// ========== GLOBAL VARIABLES ========== //
const _userRef = _db.collection("users")
let _currentUser;


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
    showPage("home");

    // Appending currentUser name ans surname to HTML
    document.getElementById("hello").innerHTML = "Hi " + user.displayName;
    document.getElementById("user-name").innerHTML =
        `<h2>${user.displayName}</h2>`;
    document.getElementById("user-photo").innerHTML =
        `<img src="${user.photoURL}+ "?width=100&height=100">`;
    document.getElementById("user-photo-update").innerHTML =
        `<img src="${user.photoURL}+ "?width=100&height=100">`;
    document.getElementById("hello_user").innerHTML =
        `<h2>${user.displayName}</h2>
    <img src="${user.photoURL}+ "?width=100&height=100">
    <br>
    <h4>E-mail:</h4> 
    ${user.email}`;
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
        signInSuccessUrl: '#preferences'
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

function appendUserData() {
    document.querySelector('#name').value = _currentUser.displayName;

}
//=== Init function for whole SPA ===//
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
            appendFavEvents(_currentUser.favEvents);
            if (_events) {
                appendEvents(_events); // refresh movies when user data changes
            }
            showLoader(false);
        }
    });

}

