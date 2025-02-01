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
  owner = gameData.gameOwner.name;
  challenger = gameData.challenger.name;

challengerGuess = gameData.challenger.guess;
challengerResult = gameData.challenger.result;
ownerGuess = gameData.gameOwner.guess;
ownerResult = gameData.gameOwner.result;
console.log(challengerGuess)
  if (challenger == "Waiting..."){
    gameDisplay.innerHTML = 
  `<h1> waiting for someone to join your game</h1>`
  }else{  
    gameDisplay.innerHTML = 
  `${gameData.number}
  <h1>${owner} vs. ${challenger}</h1>
  ${ownerGuess} ${ownerResult} : ${challengerGuess} ${challengerResult}<br>
<br>`

  if (ownerResult == "win"){
    gameDisplay.innerHTML += `${owner} wins!`

  }else if (challengerResult == "win"){
    gameDisplay.innerHTML += `${challenger} wins!`

  }else{
      gameDisplay.innerHTML += `
      Make your guess!
      <input type="number" id="guess"></input><br>
      <button onclick="gtn_makeGuess(getElementById('guess').value)">Guess</button>
        `
      }
  }
}