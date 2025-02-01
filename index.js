fb_initialise();
fb_authenticate();

function readUserDetails(){
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
}