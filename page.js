function page_updateGameList(gameList){
  console.log(gameList)
    if(gameList == null){
    gameDisplay.innerHTML = 
    `No Games here, you can wait or you can create your own game! :(<br>
      <button onclick="fb_createGame()">Create a game</button>
    `
    }else{
    gameDisplay.innerHTML = '';
      gameList.keys().forEach()
  }
}