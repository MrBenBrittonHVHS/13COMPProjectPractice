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
      gameDisplay.innerHTML += "<br>or <button onclick="fb_createGame()">Create a new one</button>";
      //console.log(key, gameList[key]);
    });
  }
}