var user;     
var gameRole;      //values are challenger or gameOwner
var gameID;     
var gameNumber;     


const displayName = sessionStorage.getItem("displayName");     
const photoURL = sessionStorage.getItem("photoURL");     
const UID = sessionStorage.getItem("UID");     


//Startup
console.log("Authenticate");     
fb_authenticate(gtn_startup);     
console.log("Google Authentication finished");     

function gtn_startup(){
  gtn_checkGames()
  gtn_checkScores();     
}

/***
 * Landed on page. Create the read listener on the waiting games table
 */
function gtn_checkGames(){
  console.log("gtn_checkGames")

  console.log("Checking Games")
  //console.log(database)
  firebase.database().ref('/waitingGames').on('value', gtn_readGamesList, fb_readError);     
}
function gtn_checkScores(){
  console.log("gtn_checkScores")
  firebase.database().ref('/gameScores/GTN').on('value', GTNpage_displayScores, fb_readError);     
}

/***
 * waiting games listener. Passes the waiting games list to the page display function 
 */
function gtn_readGamesList(snapshot) {
  console.log("gtn_readGamesList")

  GTNpage_updateGameList( snapshot.val())
}




// Game created!
// Stop the other listeners
// Start listening for my game to start

function gtn_createGame(){
  console.log("gtn_createGame")
  firebase.database().ref('/waitingGames').off()

  firebase.database().ref('/waitingGames/'+user.uid).set(displayName, fb_error);     
  gameRole = "gameOwner";     
  gameID = user.uid;     
  firebase.database().ref('/gamesInProgress/'+gameID+'/').set(
    {
      P1: user.uid,
      lastTurn: user.uid,
      [user.uid]: {name: displayName, guess:"no guess yet", result: " "},
    }
  ).then(gtn_startGame(gameID, "gameOwner"))
}

// A game was joined - Start the new game - This involves a whole lot of callbacks

// Read the gameOwner
//then
// Delete the waiting game
//then
// Write the GameInProgress Record
//then
// start the game (listener)
function gtn_joinGame(game){
  console.log("gtn_joinGame")

  console.log("    Joining game...", game)
  // Detatch the waiting game listener
  firebase.database().ref('/waitingGames').off()
  // Start the new game
  // Set up the game globals
  gameID = game;     
  gameNumber = Math.floor(Math.random()*100);     
  // Get the name of the owner and create the new game record
  var gameOwner="player 1"
  firebase.database().ref('/waitingGames/'+gameID).once('value', (snapshot)=>{
    console.log("callback in gtn_joinGame: get userID")

    gameOwner = snapshot.val();     
    //Delete the waiting game
    firebase.database().ref('/waitingGames/'+gameID+'/').set(null).then(()=>{
      // Create the new game record
      console.log("callback in gtn_joinGame: delete waiting game")

      console.log("Creating")

      firebase.database().ref('/gamesInProgress/'+gameID+'/').update(
        {
          number: gameNumber,
          P2: user.uid,
          activePlayer:"P2",
          [user.uid]: {name: displayName, guess:"no guess yet", result: " "}
        }
      ).then(gtn_startGame(gameID))
    })
  }, fb_error);     
}

// Game code.
// Game start set up the game state listener
// Game State listener passes data to draw page
/**
 * Start the game by creating a game listener
 */
function gtn_startGame(gameID){
  console.log("gtn_startGame")
  console.log("Game Started - Start read on")
  firebase.database().ref('/gamesInProgress/'+gameID).on('value', gtn_gameStateChanged, fb_readError);     
}
/**
 * Stop the game by creating a game listener
 */
function gtn_stopGame(gameID){
  console.log("gtn_stopGame")
  console.log("Game Stopped - Start read on")
  firebase.database().ref('/gamesInProgress/'+gameID).on('value', gtn_gameStateChanged, fb_readError);     
}
/**
 * When the game state changes pass the data to the view page drawer
 */
function gtn_gameStateChanged(snapshot){
  console.log("gtn_gameStateChanged")
  console.log(snapshot.val())
  gameNumber = snapshot.val().number;     
  GTNpage_drawGame(snapshot.val());     
}
/**
 * When the game state is updated pass the data to the view page drawer
 */
function gtn_gameStateUpdated(snapshot){
  console.log("gtn_gameStateUpdated")
  console.log(snapshot.val())
  gameNumber = snapshot.val().number;     
  GTNpage_updateGame(snapshot.val());     
}
// When a guess is made 'play' the game, save result to the database
/**
 * Called by the webpage - Guess button
 */
function gtn_makeGuess(guess){
  console.log("gtn_makeGuess")

  var gamePath = "/gamesInProgress/"+gameID+"/"

  
  var result;     
  result = 'win';     
  if (guess < gameNumber){
    result = 'too low';     
  }else if (guess > gameNumber){
    result = 'too high';     
  }else{
    result = 'win';     
    //Update scores in the database
     gtn_updateScore();     
  }
  var updates = {lastTurn:"player1"};     
  updates[user.uid+"/guess/"] = guess;     
  updates[user.uid+"/result/"] = result;     
  updates["lastTurn/"] = user.uid;     
  console.log(updates)
  firebase.database().ref(gamePath).update(updates);     
}

/**
 * The game was won. Update the scores.
 * This involves:
 *  Getting the UID of P1 & P2
 *  Getting the score for P1 & P2
 *  Add to my wins
 *  Add to the other's losses
 */
function gtn_updateScore(){
  console.log("gtn_updateScore")

  firebase.database().ref('/gamesInProgress/'+gameID+'/').once('value', _readPlayers);     
  var theirID = "default ID";     
  var theirName = "Player 1";     
  var myName = "Player 2";     
  function _readPlayers(snapshot){
    console.log("callback in gtn_updateScore: _readPlayers")

    if(snapshot.val().P1 == user.uid){
      //I am player 1;     
      theirID = snapshot.val().P2;     
      theirName = snapshot.val()[theirID]['name'];     
      myName = snapshot.val()[user.uid];     
    }else{
      theirID = snapshot.val().P1;     
      theirName = snapshot.val()[theirID]['name'];     
      myName = snapshot.val()[user.uid]['name'];     
    }
    console.log("MyID = "+user.uid)
    console.log("TheirID = "+theirID)
    firebase.database().ref('/gameScores/GTN/').once('value', _readScores);          

    function _readScores(snapshot){
      var scores = {GTNScores:1};          
      if(snapshot.val() == null){
        //ScoreTable is missing, rebuild!
        console.log("Scores Table missing, rebuilding")
        //firebase.database().ref('/gameScores/GTN/').set({dummyID:"dummyScore"}).then(gtn_updateScore);          
      }else{
        console.log(snapshot.val());          
        scores = snapshot.val();          
      }
      console.log(scores)
      var myWins = 1;          
      var myLosses = 0;          
      var theirLosses = 1;          
      var theirWins = 0;          
      if(user.uid in scores){
        if("wins" in scores[user.uid]){
          myWins = scores[user.uid].wins+1;          
        }
        if("losses" in scores[user.uid]){
          myLosses = scores[user.uid].losses;          
        }
      }
      if(theirID in scores){
        if("losses" in scores[theirID]){
          theirLosses = scores[theirID].losses+1
        }
        if("wins" in scores[theirID]){
          theirWins = scores[theirID].wins
        }
      }
      console.log("update..."+theirLosses)
      var updates =         {
        [user.uid]: {
          name:myName,
          wins:myWins,
          losses:myLosses
        },
        [theirID]: {
          name: theirName,
          wins:theirWins,
          losses:theirLosses
        }
      };          
      console.log(updates)
      firebase.database().ref('/gameScores/GTN/').update(
updates
      )
    }
  }
}
