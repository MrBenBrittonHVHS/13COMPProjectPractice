var user;
var gameRole; //values are challenger or gameOwner
var gameID;
var gameNumber;

//Startup
fb_initialise();
console.log("Authenticate");
fb_authenticate(gtn_checkGames);
console.log("Google Authentication finished");


function gtn_authenticate(RUN_NEXT){
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
function gtn_checkUser(){
  console.log(user)
}
function gtn_checkGames(){
  console.log("Checking Games")
  //console.log(database)
  firebase.database().ref('/waitingGames').on('value', gtn_readGamesList, gtn_readError);
}

// Game created!
// Stop the other listeners
// Start listening for my game to start

function gtn_createGame(){
  firebase.database().ref('/waitingGames').off()

  firebase.database().ref('/waitingGames/'+user.uid).set(user.displayName)
  gameRole = "gameOwner";
  gameID = user.uid;
  firebase.database().ref('/gamesInProgress/'+gameID+'/').set(
    {
      gameOwner: {name: user.displayName, guess:"no guess yet", result: " "},
      challenger: {name: "Waiting...", guess:"no guess yet", result: " "}
    }
  ).then(gtn_startGame(gameID, "gameOwner"))
}

// A game was clicked - Start the new game - This involves a whole lot of callbacks

// Read the gameOwner
//then
// Delete the waiting game
//then
// Write the GameInProgress Record
//then
// start the game listener
function gtn_joinGame(game){
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
      ).then(gtn_startGame(gameID, "challenger"))
    })
  }, gtn_readError);
}

// Game flow code.
// Game start set up the game state listener
// Game State listener passes data to draw page
function gtn_startGame(gameID){
console.log("Game Started - Start read on")
firebase.database().ref('/gamesInProgress/'+gameID).on('value', gtn_gameStateChanged, gtn_readError);
}
function gtn_gameStateChanged(snapshot){
  console.log("Game State changed ")
  console.log(snapshot.val())
  gameNumber = snapshot.val().number;
  page_drawGame(snapshot.val());
}
// When a guess is made 'play' the game, save result to the database
function gtn_makeGuess(guess){
  console.log("guess made by ", gameRole)
  console.log(guess)
  console.log(gameNumber)
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
// gtn_helloWorld()
// Demonstrate a minimal write to firebase
// This function replaces the entire database with the message "Hello World"
// 
// This uses the set() operation to write the key:value pair "message":"Hello World"
// The ref('/') part tells the operation to write to the base level of the database "/"
// This means it replaces the whole database with message:Hello World
/**************************************************************/
function gtn_helloWorld(){
  console.log("Running gtn_helloWorld()")
  firebase.database().ref('/').set(
    {
      message: 'Hello World WHeeeeee'
    }
  )
}
function gtn_goodbye(){
  console.log("Running gtn_goodbye()")
  firebase.database().ref('/').set(
    {
      message: 'goodbye2'
    }
  )
}
/**************************************************************/
// gtn_readMessageOnce()
// Demonstrate a minimal read from firebase
// This function reads the current value from the 'message' field once
//
//
/**************************************************************/
function gtn_readMessageOnce() {
  firebase.database().ref('/').child('message').once('value', gtn_readOK, gtn_readError);
  //database.ref('/').child('message').once('value').then(gtn_readOK).catch(gtn_readError);
  console.log("Leaving gtn_readMessageOnce")
}

/**************************************************************/
// gtn_readMessageOn()
// Demonstrate a minimal listener for firebase
// This function sets up a listener for the 'message' field.
// It will immediately run the appropriate callback.
// It will run the appropriate callback whenever the 'message' field is changed
// If the read is successful it will call the gtn_readOK function
// If the read is not successful it will call the gtn_readError function
// Input:  n/a
// Return: n/a
/**************************************************************/
function gtn_readMessageOn() {
  //database.ref('/message').on('value', gtn_readOK, gtn_readError);
    database.ref('/message').on('value').then(gtn_readOK).catch(gtn_readError);
//firebase.database().ref('/').child('message').on('value').then(gtn_readOK).catch(gtn_readError);
  //firebase.database().ref('/').child('message').on('value').then(gtn_readOK).catch(gtn_readError);
}


function gtn_readGet(){
database.ref("/").child("message").get('value').then(gtn_readOK).catch(gtn_readError);
//const dbRef = firebase.database().ref();
//dbRef.child("message").get('value').then(gtn_readOK).catch(gtn_readError);
//dbRef.child("message").get(gtn_readOK, gtn_readError)
  
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
  // gtn_readOK is a callback function. It will run when the database read has finished
  // the database call will pass a snapshot of the data to gtn_readOK
  // Input:  data returned from firebase
  /*-----------------------------------------*/
  function gtn_readOK(snapshot) {
    var dbData = snapshot.val();
    if (dbData == null) { 
      console.log('There was no record when trying to read the message');
    }
    else {
      console.log("The message is: "+dbData)
    }
  }

  function gtn_readGamesList(snapshot) {
    page_updateGameList( snapshot.val())
  }
  
  /*-----------------------------------------*/
  // gtn_readError(error)
  // DB read record failed
  // Input:  error message returned from firebase
  /*-----------------------------------------*/
  function gtn_readError(error) {
    console.log("There was an error reading the message");
    console.error(error);
  }
