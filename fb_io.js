var user;
var gameRole; //values are challenger or gameOwner
var gameID;
var gameNumber;
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

}
function fb_checkUser(){
  console.log(user)
}
function fb_checkGames(){
  console.log("Checking Games")
  //console.log(database)
  firebase.database().ref('/waitingGames').on('value', fb_readGamesList, fb_readError);
}

// Game created!
// Stop the other listeners
// Start listening for my game to start

function fb_createGame(){
  firebase.database().ref('/waitingGames').off()

  firebase.database().ref('/waitingGames/'+user.uid).set(user.displayName)

  
}

// A game was clicked - Start the new game - This involves a whole lot of callbacks

// Read the gameOwner
//then
// Delete the waiting game
//then
// Write the GameInProgress Record
//then
// start the game listener
function fb_joinGame(game){
  console.log("    Joining game...", game)
  // Detatch the waiting game listener
  firebase.database().ref('/waitingGames').off()
  // Start the new game
  // Set up the game globals
  gameRole = "challenger";
  gameID = game;
  gameNumber = Math.floor(Math.random()*100);
  // Get the name of the owner and create the new game record
  var gameOwner=""
  firebase.database().ref('/waitingGames/'+gameID).once('value', (snapshot)=>{
    gameOwner = snapshot.val();
    //Delete the waiting game
    firebase.database().ref('/waitingGames/'+gameID+'/').set(null).then(()=>{
      // Create the new game record
      console.log("Creating")

      firebase.database().ref('/gamesInProgress/'+gameID+'/').set(
        {
          number: gameNumber,
          gameOwner: {name: gameOwner, guess:"no guess yet", result: " "},
          challenger: {name: user.displayName, guess:"no guess yet", result: " "}
        }
      ).then(fb_startGame(gameID, "challenger"))
    })
  }, fb_readError);
}

// Game flow code.
// Game start set up the game state listener
// Game State listener passes data to draw page
function fb_startGame(gameID){
console.log("Game Started - Start read on")
firebase.database().ref('/gamesInProgress/'+gameID).on('value', fb_gameStateChanged, fb_readError);
}
function fb_gameStateChanged(snapshot){
  console.log("Game State changed ")
  console.log(snapshot.val())
  page_drawGame(snapshot.val());
}
// When a guess is made 'play' the game, save result to the database
function fb_makeGuess(guess){
  console.log("guess made")
  // Create the new game record
  var gamePath = "/gamesInProgress/"+gameID+"/"+gameRole+"/"
  firebase.database().ref(gamePath+"guess/").set(guess);
  var result;
  if (guess < gameNumber){
    result = 'too low';
  }else if (guess > gameNumber){
    result = 'too high';
  }else{
    result = 'win';
  }
  firebase.database().ref(gamePath+"/result/").set(result);

}
/**************************************************************/
// fb_helloWorld()
// Demonstrate a minimal write to firebase
// This function replaces the entire database with the message "Hello World"
// 
// This uses the set() operation to write the key:value pair "message":"Hello World"
// The ref('/') part tells the operation to write to the base level of the database "/"
// This means it replaces the whole database with message:Hello World
/**************************************************************/
function fb_helloWorld(){
  console.log("Running fb_helloWorld()")
  firebase.database().ref('/').set(
    {
      message: 'Hello World WHeeeeee'
    }
  )
}
function fb_goodbye(){
  console.log("Running fb_goodbye()")
  firebase.database().ref('/').set(
    {
      message: 'goodbye2'
    }
  )
}
/**************************************************************/
// fb_readMessageOnce()
// Demonstrate a minimal read from firebase
// This function reads the current value from the 'message' field once
//
//
/**************************************************************/
function fb_readMessageOnce() {
  firebase.database().ref('/').child('message').once('value', fb_readOK, fb_readError);
  //database.ref('/').child('message').once('value').then(fb_readOK).catch(fb_readError);
  console.log("Leaving fb_readMessageOnce")
}

/**************************************************************/
// fb_readMessageOn()
// Demonstrate a minimal listener for firebase
// This function sets up a listener for the 'message' field.
// It will immediately run the appropriate callback.
// It will run the appropriate callback whenever the 'message' field is changed
// If the read is successful it will call the fb_readOK function
// If the read is not successful it will call the FB_readError function
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_readMessageOn() {
  //database.ref('/message').on('value', fb_readOK, fb_readError);
    database.ref('/message').on('value').then(fb_readOK).catch(fb_readError);
//firebase.database().ref('/').child('message').on('value').then(fb_readOK).catch(fb_readError);
  //firebase.database().ref('/').child('message').on('value').then(fb_readOK).catch(fb_readError);
}


function fb_readGet(){
database.ref("/").child("message").get('value').then(fb_readOK).catch(fb_readError);
//const dbRef = firebase.database().ref();
//dbRef.child("message").get('value').then(fb_readOK).catch(fb_readError);
//dbRef.child("message").get(fb_readOK, fb_readError)
  
  /*
dbRef.child("message").get().then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});*/
}







  /*-----------------------------------------*/
  // fb_readOK is a callback function. It will run when the database read has finished
  // the database call will pass a snapshot of the data to fb_readOK
  // Input:  data returned from firebase
  /*-----------------------------------------*/
  function fb_readOK(snapshot) {
    var dbData = snapshot.val();
    if (dbData == null) { 
      console.log('There was no record when trying to read the message');
    }
    else {
      console.log("The message is: "+dbData)
    }
  }

  function fb_readGamesList(snapshot) {
    page_updateGameList( snapshot.val())
  }
  
  /*-----------------------------------------*/
  // fb_readError(error)
  // DB read record failed
  // Input:  error message returned from firebase
  /*-----------------------------------------*/
  function fb_readError(error) {
    console.log("There was an error reading the message");
    console.error(error);
  }
