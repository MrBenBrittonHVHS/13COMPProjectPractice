var user;
var gameRole; //values are challenger or gameOwner
var gameID;
var gameNumber;

//Startup
fb_initialise();
console.log("Authenticate");
fb_authenticate(gtn_checkGames);
console.log("Google Authentication finished");

/***
 * Landed on page. Create the read listener on the waiting games table
 */
function gtn_checkGames(){
  console.log("Checking Games")
  //console.log(database)
  firebase.database().ref('/waitingGames').on('value', gtn_readGamesList, fb_readError);
}

/***
 * waiting games listener. Passes the waiting games list to the page display function 
 */
function gtn_readGamesList(snapshot) {
  GTNpage_updateGameList( snapshot.val())
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
  }, fb_readError);
}

// Game flow code.
// Game start set up the game state listener
// Game State listener passes data to draw page
function gtn_startGame(gameID){
console.log("Game Started - Start read on")
firebase.database().ref('/gamesInProgress/'+gameID).on('value', gtn_gameStateChanged, fb_readError);
}
function gtn_gameStateChanged(snapshot){
  console.log("Game State changed ")
  console.log(snapshot.val())
  gameNumber = snapshot.val().number;
  GTNpage_drawGame(snapshot.val());
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

