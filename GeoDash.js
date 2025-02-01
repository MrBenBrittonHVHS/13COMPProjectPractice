/*******************************************************/
// P5.play: t01_create_sprite
// Create a sprite
// Written by ??? 
/*******************************************************/
console.log("%c t01_create_sprite", "color: blue;");

const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 200;
const PLAYER_HEIGHT = 25;
const PLAYER_WIDTH = 25;


const OBSTACLE_HEIGHT = PLAYER_HEIGHT;
const OBSTACLE_WIDTH = PLAYER_WIDTH;

var spawnDist = 0;
var nextSpawn = 0;
var score = 0;
var player;
  
var screenSelector = "start";  

var obstacles;
/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    console.log("setup: ");
    
    cnv= new Canvas(800, 600);
    
        cnv= new Canvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    obstacles = new Group();

    floor =  new Sprite(SCREEN_WIDTH/2,  SCREEN_HEIGHT, SCREEN_WIDTH, 4, 's');
    floor.color = color("black");
    world.gravity.y = 80;
    
    document.addEventListener("keydown", 
        function(event) {
            if(screenSelector == "start"||screenSelector == "end"){
                screenSelector = "game"
                resetGame();
            }else{
                if(player.y > 184 ){// 184 - found from testing - floor level
                    console.log("Key pressed!");
                    player.vel.y = -20;
                }
            }
    });

}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    if(screenSelector=="game"){
        gameScreen();
    }else if(screenSelector=="end"){
        endScreen();
    }else if(screenSelector=="start"){
        startScreen();
    }else{
        text("wrong screen - you shouldnt get here", 50, 50);
        console.log("wrong screen - you shouldnt get here")
    }
}

function newObstacle(){
    obstacle = new Sprite((SCREEN_WIDTH -100),  SCREEN_HEIGHT - OBSTACLE_HEIGHT/2, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, 'k');
    obstacle.color = color("yellow");
    obstacle.vel.x = -10;
    
    obstacles.add(obstacle);
}

function youDead(_player, _obstacle){
    screenSelector = "end";
    player.remove();
    obstacles.removeAll();
}

// Main screen functions

function startScreen(){
    background("white");

    allSprites.visible = false;
    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text("Welcome to the game", 50, 50);
    textSize(24);
    text("Press any key to start", 50, 110);
}

function gameScreen(){
    background("#C39BD3");
    allSprites.visible = true;
    score++;
    if(frameCount> nextSpawn){
        newObstacle();
        nextSpawn = frameCount + random(10,100);
    }
    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text(score, 50, 50);
}

function endScreen(){
    background("white");

    allSprites.visible = false;
    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text("You died! Too bad :-(", 50, 50);
    textSize(24);
    text("your score was: "+score, 50, 110);
    textSize(14);
    text("press any key to restart", 50, 150);
    saveScore();
}

function resetGame(){
    player = new Sprite(PLAYER_WIDTH*1.2,  SCREEN_HEIGHT/2, PLAYER_WIDTH, PLAYER_HEIGHT, 'd');
    player.color = color("purple");
    player.collides(obstacles, youDead);
    score = 0;
}

function saveScore(){
        console.log("saveScore")

          firebase.database().ref('/gameScores/GeoDash/').once('value', _readScores);
      
          function _readScores(snapshot){
            if(snapshot.val() == null){
              //ScoreTable is missing, rebuild!
              console.log("Scores Table missing, rebuilding")
              firebase.database().ref('/gameScores/GeoDash/').set({dummyID:"dummyScore"}).then(saveScore);
            }else{
              console.log("callback in saveScore: _readScores")
      
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
}
/*******************************************************/
//  END OF APP
/*******************************************************/