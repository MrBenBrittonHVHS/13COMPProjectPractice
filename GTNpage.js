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
    P1id = gameData.P1;
    P2id = gameData.P2;
    P1 = gameData[P1id]["name"];
    P2 = gameData[P2id]["name"];   
    P2Guess = gameData[P2id]["guess"];
    P2Result = gameData[P2id]["result"];
    P1Guess = gameData[P1id]["guess"];
    P1Result = gameData[P1id]["result"];
    console.log(P2Guess)

    gameDisplay.innerHTML = 
    `${gameData.number}
    <h1>${P1} vs. ${P2}</h1>
    ${P1Guess} ${P1Result} : ${P2Guess} ${P2Result}<br>
  <br>`

    if (P1Result == "win"){
      gameDisplay.innerHTML += `${P1} wins!`
    }else if (P2Result == "win"){
      gameDisplay.innerHTML += `${P2} wins!`
    }else{
        gameDisplay.innerHTML += `
        Make your guess!
        <input type="number" id="guess"></input><br>
        <button onclick="gtn_makeGuess(getElementById('guess').value)">Guess</button>
          `
    }
  }else{
    //The game has not started, waiting for someone to join
    gameDisplay.innerHTML = 
    `<h1> waiting for someone to join your game</h1>`
  }
}
