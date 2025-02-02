function GTNpage_updateGameList(gameList){
  console.log(gameList)
    if(gameList == null){
    gameDisplay.innerHTML = 
    `No Games here, you can wait or you can create your own game! :(<br>
      <button onclick="gtn_createGame()">Create a game</button>
    `
    }else{
    gameDisplay.innerHTML = 'Games available:<br>';
    Object.keys(gameList).forEach(function(key) {
      gameDisplay.innerHTML += "<button onclick='gtn_joinGame(\""+key+"\")'>Join "+gameList[key]+'\'s game</button><br>';
      //console.log(key, gameList[key]);
    });
    gameDisplay.innerHTML += "<br>or <button onclick='gtn_createGame()'>Create a new one</button>";

  }
}

function GTNpage_updateGameScreen(gameState){
  console.log("GameListener running")
}

function GTNpage_drawGame(gameData){
  
  if("P2" in gameData){
    //The game has started!
    lastTurn = gameData.lastTurn;
    P1id = gameData.P1;
    P2id = gameData.P2;
    P1 = gameData[P1id]["name"];
    P2 = gameData[P2id]["name"];   
    P2Guess = gameData[P2id]["guess"];
    P2Result = gameData[P2id]["result"];
    P1Guess = gameData[P1id]["guess"];
    P1Result = gameData[P1id]["result"];

    //Who am I - Detect which player I am
if (P1id == user.uid){
  //I am Player1
  theirName = P2;
}else{
  // I am player 2
  theirName = P1;
}

    console.log(P2Guess)

    gameDisplay.innerHTML = 
    `${gameData.number}
    <div style="display:flex">
    <div style="width:40%">
      <h1>${P1}</h1>
      ${P1Guess} ${P1Result}
    </div>
    <div style="width:15%"><h1>vs.</h1></div>
    <div style="width:40%">
      <h1>${P2}</h1>
      ${P2Guess} ${P2Result}
    </div>
</div>
  <br>`
// If the game has been won...
    if (P1Result == "win"){
      gameDisplay.innerHTML += `<h2>${P1} wins!</h2>
      <button onClick="gtn_checkGames()">Back to the lobby</button>`
    }else if (P2Result == "win"){
      gameDisplay.innerHTML += `<h2>${P2} wins!</h2>
            <button onClick="gtn_checkGames()">Back to the lobby</button>`
    }else{
// If the game is ongoing
      if((lastTurn != user.uid)||(P1id==P2id)){
          // It is my turn if I didn't have the last go
          // OR 
          // It is me playiung myself (Testing)
        gameDisplay.innerHTML += `
        Your turn. Make your guess!
        <input type="number" id="guess"></input><br>
        <button onclick="gtn_makeGuess(getElementById('guess').value)">Guess</button>
          `
      }else{
        //You had the last turn - you need to wait
        gameDisplay.innerHTML += `
        Waiting for ${theirName} To make a move
          `
      }
    }
  }else{
    //The game has not started, waiting for someone to join
    gameDisplay.innerHTML = 
    `<h1> waiting for someone to join your game</h1>`
  }
}

function GTNpage_displayScores(snapshot){
  scores = snapshot.val()
//	Visit non-inherited enumerable keys
//
scoresDisplay.innerHTML =`Name, Wins, Losses, win ratio<br>`
Object.keys(scores).forEach(function(key) {
  scoresDisplay.innerHTML += `${scores[key]["name"]}, ${scores[key]["wins"]}, ${scores[key]["losses"]}, ${scores[key]["wins"]/scores[key]["losses"]}<br>`

});
}