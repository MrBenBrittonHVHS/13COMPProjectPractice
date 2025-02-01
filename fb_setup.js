/**************************************************************/
// fb_initialise()
// Initialize firebase, connect to the Firebase project.
// 
// Find the config data in the Firebase consol. Cog wheel > Project Settings > General > Your Apps > SDK setup and configuration > Config
//
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {  
const firebaseConfig = {
    apiKey: "AIzaSyC_YI2XkIRIFNFr3Ivxjd-5wx5kxAOyrj8",
    authDomain: "fir-rebuild-b3c92.firebaseapp.com",
    databaseURL: "https://fir-rebuild-b3c92-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-rebuild-b3c92",
    storageBucket: "fir-rebuild-b3c92.appspot.com",
    messagingSenderId: "187367274216",
    appId: "1:187367274216:web:c399d98ffaadb217befb5d"
};
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // This log prints the firebase object to the console to show that it is working.
  // As soon as you have the script working, delete this log.
  console.log(firebase);	
}

function fb_authenticate(RUN_NEXT){
  firebase.auth().onAuthStateChanged((authUser)=>{
    if (authUser){
      //User is logged in
      user = authUser;
      console.log("Logged in, doing next action")
      RUN_NEXT();
    }else{
      // Sign in using a popup.
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token.
      var token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user;
      });
    }
  })