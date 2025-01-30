function page_updateGameList(gameList){
  console.log(gameList)
    if(gameList == null){
    gameDisplay.innerHTML = 
    `No Games here, you can wait or you can create your own game! :(<br>
      <button onclick="fb_createGame()">Create a game</button>
    `
    }else{
    gameDisplay.innerHTML = 'Games available:<br>';
    Object.keys(gameList).forEach(function(key) {
      gameDisplay.innerHTML += "<button onclick='fb_joinGame(\""+key+"\")'>Join "+gameList[key]+'\'s game</button><br>';
      //console.log(key, gameList[key]);
    });
    gameDisplay.innerHTML += "<br>or <button onclick='fb_createGame()'>Create a new one</button>";

  }
}

function page_updateGameScreen(gameState){
  console.log("GameListener running")
}

function page_drawGame(gameData){
  owner = gameData.gameOwner.name;
  challenger = gameData.challenger.name;

challengerGuess = gameData.challenger.guess;
challengerResult = gameData.challenger.result;
ownerGuess = gameData.gameOwner.guess;
ownerResult = gameData.gameOwner.result;
console.log(challengerGuess)
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
      <button onclick="fb_makeGuess(getElementById('guess').value)">Guess</button>
        `
      }
  }