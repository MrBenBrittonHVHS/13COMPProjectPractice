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
var lastScore = "";
var highScore = "";
  
var screenSelector = "start";  

var obstacles;
/*******************************************************/
// setup()
/*******************************************************/
var user;
fb_initialise();
fb_authenticate(()=>{});

function setup() {
    console.log("setup: ");
    readScore();
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
    saveScore(score);
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
    text("Press any key to start", 50, 80);
    textSize(14);
    text("your last score was "+lastScore, 50, 150);    
    text("your best score is "+highScore, 220, 150);
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
    textSize(14);
    text("your last score was "+lastScore, 50, 150);    
    text("your best score is "+highScore, 220, 150);
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
}

function resetGame(){
    player = new Sprite(PLAYER_WIDTH*1.2,  SCREEN_HEIGHT/2, PLAYER_WIDTH, PLAYER_HEIGHT, 'd');
    player.color = color("purple");
    player.collides(obstacles, youDead);
    score = 0;
}

function readScore(){
    firebase.database().ref('/gameScores/GeoDash/'+user.uid).once('value', _readScores);

    function _readScores(snapshot){
        if(snapshot.val() == null){
        }else{
        lastScore = snapshot.val().lastScore;
        highScore = snapshot.val().highScore
        }
    }
}

function saveScore(score){
    console.log("saveScore")

    firebase.database().ref('/gameScores/GeoDash/'+user.uid).once('value', _readScores);

    function _readScores(snapshot){
        if(snapshot.val() == null){
            //Score is missing, rebuild!
            console.log("Initialising a new score...")
            firebase.database().ref('/gameScores/GeoDash/'+user.uid).set({lastScore:score,highScore:score});
        }else{
            //Score exists, update highscore
            console.log("callback in saveScore: _readScores")
            console.log(snapshot.val());
            var highScore = snapshot.val().highScore;
            console.log(highScore);

            if (score > highScore){
                highScore = score;
            }
            firebase.database().ref('/gameScores/GeoDash/'+user.uid).update(
                {
                    lastScore: score,
                    highScore: highScore
                }
            )
        }
    }
}
/*******************************************************/
//  END OF APP
/*******************************************************/