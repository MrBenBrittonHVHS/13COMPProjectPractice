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

function page_drawGame(gameState){
  owner = gameState.gameOwner.name;
  challenger = gameState.challenger.name;

challengerGuess = gameState.challenger.guess.name
challengerResult = gameState.challenger.result.name
ownerGuess = gameState.owner.guess.name
ownerResult = gameState.owner.result.name
console.log(challengerGuess)
  gameDisplay.innerHTML = 
  `
  <h2>Game on!</h2>
  it is
  <h1>${owner} vs. ${challenger}</h1>
  Make your guess!
<br>
<input type="number" id="guess"></input><br>
<button onclick="fb_makeGuess(getElementById('guess').value)">Guess</button>
  `
}