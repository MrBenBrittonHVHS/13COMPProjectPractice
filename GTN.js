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
  console.log("gtn_checkGames")

  console.log("Checking Games")
  //console.log(database)
  firebase.database().ref('/waitingGames').on('value', gtn_readGamesList, fb_readError);
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

  firebase.database().ref('/waitingGames/'+user.uid).set(user.displayName)
  gameRole = "gameOwner";
  gameID = user.uid;
  firebase.database().ref('/gamesInProgress/'+gameID+'/').set(
    {
      P1: user.uid,
      lastTurn: user.uid,
      [user.uid]: {name: user.displayName, guess:"no guess yet", result: " "},
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
  var gameOwner=""
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
          [user.uid]: {name: user.displayName, guess:"no guess yet", result: " "}
        }
      ).then(gtn_startGame(gameID))
    })
  }, fb_readError);
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
 * When the game state changes pass the data to the view page drawer
 */
function gtn_gameStateChanged(snapshot){
  console.log("gtn_gameStateChanged")
  console.log(snapshot.val())
  gameNumber = snapshot.val().number;
  GTNpage_drawGame(snapshot.val());
}

// When a guess is made 'play' the game, save result to the database
/**
 * Called by the webpage - Guess button
 */
function gtn_makeGuess(guess){
  console.log("gtn_makeGuess")

  var gamePath = "/gamesInProgress/"+gameID+"/"

  
  var result;
  if (guess < gameNumber){
    result = 'too low';
  }else if (guess > gameNumber){
    result = 'too high';
  }else{
    result = 'win';
    //Update scores in the database
     gtn_updateScore();
  }
  var updates = {};
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
  var theirID;
  function _readPlayers(snapshot){
    console.log("callback in gtn_updateScore: _readPlayers")

    if(snapshot.val().P1 == user.uid)
      //I am player 1;
      theirID = snapshot.val().P2;
    else{
      theirID = snapshot.val().P1;
    }
    console.log("MyID = "+user.uid)
    console.log("TheirID = "+theirID)
    firebase.database().ref('/gameScores/GTN/').once('value', _readScores);

    function _readScores(snapshot){
      if(snapshot.val() == null){
        //ScoreTable is missing, rebuild!
        console.log("Scores Table missing, rebuilding")
        firebase.database().ref('/gameScores/GTN/').set({dummyID:"dummyScore"}).then(gtn_updateScore);
      }else{
        console.log("callback in gtn_updateScore: _readScores")

        console.log(snapshot.val());
        var scores = snapshot.val();
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
        firebase.database().ref('/gameScores/GTN/').update(
          {
            [user.uid]: {
              wins:myWins,
              losses:myLosses
            },
            [theirID]: {
              wins:theirWins,
              losses:theirLosses
            }
          }
        )
      }
    }
  }
}