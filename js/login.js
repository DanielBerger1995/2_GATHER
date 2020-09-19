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
    console.log(user);
    hideTabbar(false);
    goHome();
    init();
    showLoader(false);
    document.getElementById("hello").innerHTML = "Hi " + user.displayName;
    document.getElementById("profile-container").innerHTML =  user.displayName;

    document.getElementById("profile-container").src =  user.photoURL;
    
}

function goHome() {
    navigateTo("home")
};





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

// ========== PROFILE PAGE FUNCTIONALITY ========== //
// append user data to profile page
function appendUserData() {
    document.querySelector('#username').value = _currentUser.displayName;
    document.querySelector('#mail').value = _currentUser.email;
    console.log(user.displayName);

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