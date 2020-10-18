'use strict;'

// const btn = document.createElement('button');
// btn.innerText = 'New Button';
// document.body.appendChild(btn);
// btn.addEventListener('click',()=>{alert('vvv');}); 

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');




//var CANVAS_WIDTH = 1400;
//var CANVAS_HEIGHT = 780;
// var airimg = '#ffffff'; //air
// var lavaimg = '#ff0000'; //lava              !
// var wallimg = '#000000'; //wall            x
// var coinimg = '#ffbb00'; //coins          *
// var jumpimg = '#006934';  //jumpPlatform   =
// var blue = '#0000ff'; // player          @
// var platformimg = '#c702ae'; //platform      -
// var iceimg = '#00ffff'; //ice           ~
// var healimg = '#64ff4f'; //heal       +
// var mudimg = '#9c5500'; //mud             ,
var scale = 0.5;
var size = 32*scale;
var scaletime = 1;
scale=scale*1/scaletime;
var playerimg = new Image(size, size), playerwin = new Image(size, size), deadplayer = new Image(size, size),airimg = new Image(size, size),coinimg = new Image(size, size), platformimg = new Image(size, size), jumpimg = new Image(size, size), lavaimg = new Image(size, size), healimg = new Image(size, size), mudimg = new Image(size, size), iceimg = new Image(size, size), wallimg = new Image(size, size), duckimg = new Image(size, size), enemyimg = new Image(size, size), cat = new Image, corruptwin = new Image;
playerimg.src = 'player.png';
playerwin.src = 'playerwin.png';
deadplayer.src = 'deadplayer64.png';
airimg.src = 'air.png';
coinimg.src = 'coin.png';
platformimg.src = 'platform.png';
jumpimg.src = 'jump.png';
lavaimg.src = 'lava.png';
healimg.src = 'healg.png';
mudimg.src = 'mud.png';
iceimg.src = 'ice.png';
wallimg.src = 'wall.png';
duckimg.src = 'duck64.png';
enemyimg.src = 'enemy.png';
cat.src = 'cat.png';
corruptwin.src = 'corruptedwin.png';

var coinsound = new Audio, longjumpsound = new Audio,jumpsound = new Audio,enemysound = new Audio,diesound = new Audio,walksound = new Audio,mudsound = new Audio,icesound = new Audio,lavasound = new Audio,healsound = new Audio,platformsound = new Audio, thememusic = new Audio, enemydiessound = new Audio, shortjumpsound = new Audio, winsound = new Audio;
coinsound.src = 'coin.mp3';
longjumpsound.src = 'longjump.mp3';
jumpsound.src = 'jump.mp3';
enemysound.src = 'enemy.mp3';
diesound.src ='die.mp3';
walksound.src ='walk.mp3';
mudsound.src='mud.mp3';
icesound.src='ice.mp3';
lavasound.src='lava.mp3';
healsound.src='heal.mp3';
platformsound.src='platform.mp3';
thememusic.src ='BeepBox-Song_best2.mp3';
enemydiessound.src = 'enemydies.mp3';
shortjumpsound.src = 'shortjump.mp3';
winsound.src = 'win.mp3';
var FPS = 60*scaletime;
var then, now, past, fpsInterval;


function Object (x,y,width,height,pic)
{
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y;
    this.pic=pic;
}
function Enemy (x,y,width,height,pic,speed)
{
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.pic=pic;
    this.speed=speed;
}

var objects =[];
var enemies =[];
var coins =0;
var wasWin = true;
var playerPosX;
var playerPosY;
var gravitation = 0.8*scale
// гравець
var player = {
    width : size,
    height : size-1,
    xPrev:0,
    yPrev:0,
    x : 0,
    y : 0,
    xVelocity : 0,
    yVelocity : 0,
    pic : playerimg,
    points:0,
    kills:0,
    health:100,
    inAir:true,
    inLava:false,
    isDead:false,
    isAttaked:false
    
};

var controller= {
    left:false,
    right:false,
    up: false,
    down : false,
    KeyListener:function(evt)
    {
        var keyState = (evt.type == "keydown") ? true : false;
        switch(evt.keyCode)
        {
            case 37:
                controller.left = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 40:
                controller.down = keyState;
                break;
            case 65:
                controller.left = keyState;
                break;
            case 68:
                controller.right = keyState;
                break;
            case 87:
                controller.up = keyState;
                break;
            case 83:
                controller.down = keyState;
                break;
        }
    }
};


var drawTile = function(tile)
{
    if(tile.pic != airimg)
    {
        context.drawImage(tile.pic,tile.x,tile.y,size,size);
    }
  
}


var readTileImage = function(tile)
{
    switch(tile){
        case "@":
            return playerimg
            break;
        case "x":
            return wallimg
            break;
        case "!":
            return lavaimg
            break;
        case "$":
            return coinimg
            break;
        case "-":
            return platformimg
            break;
        case "~":
            return iceimg
            break;
        case "+":
            return healimg
            break;
        case "=":
            return jumpimg
            break;
        case ".":
            return mudimg
            break;
        case "<":
            return enemyimg
            break;
        default:
            return airimg
            break;
    }
}



var startAnimation = function(fps)
{
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animation(then);
}

var animation = function(newTime) // кадри щосекунди
{
    window.requestAnimationFrame(animation);
    now = newTime;
    past = now - then;
    if(past > fpsInterval)
    {
        then = now - (past%fpsInterval);
        draw();
        timer();
    }
}


var isCollided = function(obst, obj)
{
    
    if (obj.x+obj.width  > obst.x 
        && obj.x < obst.x + obst.width
        && obj.y < obst.y + obst.height
        && obj.y + obj.height  > obst.y)
        {
            //console.debug("coll");
            return true;
        }
        else
        {
            return false;
        }
}

var collideHandler = function(obst,obj,pic)
{
    
    if (isCollided(obst,obj))
    {
        if(pic==wallimg||pic==iceimg||pic==jumpimg||pic==mudimg)
        {
            if(obj.yPrev + obj.height <= obst.y)
            {
                obj.y = obst.y - obj.height;
                obj.yVelocity = 0;
                obj.inAir = false;
                if(pic==jumpimg)
                {
                    if(player.yPrev==player.y)
                {
                    shortjumpsound.play();
                   
                }
                else
                {
                    longjumpsound.play();
                }

                obj.yVelocity=-6*scale;
                
                }
                else if(pic==mudimg)
                {
                obj.yVelocity=+7*scale;
                obj.xVelocity*=0.3;
                if(controller.right||controller.left)
                {
                    mudsound.play();
                }
                
                }
                else if(pic==iceimg)
                {
                obj.xVelocity*=1.2;
                if(controller.right||controller.left)
                {
                    icesound.play();
                }
                }
               // console.debug("down : "+obj.x);
            }
            else if (obst.x + obst.width <= obj.xPrev) //зліва (obst.x + obst.width <= obj.xPrev)
            {
                obj.x = obst.x + obst.width;
                obj.xVelocity = 0;
                
                //console.debug("left : "+obj.x);
            }
            else if (obj.xPrev + obst.width <= obst.x) //справа
            {
                obj.x = obst.x - obj.width;
                obj.xVelocity = 0;
               // console.debug("right : "+obj.x);
            }
            else if (obj.yPrev > obst.y + obst.height)
            {
                obj.y = obst.y + obst.height;
                obj.yVelocity =0;
            }
            
            
        }
        if(pic==lavaimg)
        {
            lavasound.play();
            player.health-=1;
            player.inLava=true;
        }
        if(pic==platformimg)
        {
            if (controller.down)
            {
                console.debug("down");
                platformsound.play();
               // obj.y = obst.y + obst.height/2; 
            }
            else if(obj.yPrev + obj.height <= obst.y)
            {
                obj.y = obst.y - obj.height;
                obj.yVelocity = 0;
                obj.inAir = false;
               // console.debug("down : "+obj.x);
            }
            else if (obj.yPrev > obst.y + obst.height)
            {
                obj.y = obst.y + obst.height;
                obj.yVelocity *=1;
            }
            
        }
        if(pic==healimg)
        {
            healsound.play();
            player.health+=100;
            return true;
        }
        if(pic==coinimg)
        {
            coinsound.play();
            player.points++;
            return true;
        }
        if(pic==enemyimg)
        {
            if(obj.yPrev + obj.height <= obst.y)
            {
                obj.y = obst.y - obj.height;
                obj.yVelocity = -5;
                shortjumpsound.play();
                obj.inAir = true;
                return true;
            }
            else
            {
            enemysound.play();
            player.health-=3 ;
            }
        }
      
    }
}
var end=false;
var showCounter = function()
{
  
    context.fillStyle = '#000000';
    context.font = 'normal 30px lucida console';
    
    context.fillText("time : " +time,convertedLevel[0].length*size-size*19,size*3);
    context.fillText("coins : " +player.points+"/"+coins,convertedLevel[0].length*size-size*19,size*5);
    context.fillText("kills : "+player.kills+"/"+enemies.length,convertedLevel[0].length*size-size*19,size*7);
    
    context.font = 'normal 10px lucida console';
    if (player.health<=0)
            {
                player.health=0;
                diesound.play();
                player.pic = deadplayer;
                player.isDead=true;
            }
    context.fillText(player.health,player.x-1,player.y-5);
    
    
}
var time =0;
var counter=0;
var timer = function()
{
    if(!end)
    {
        counter++
        if(counter==60)
        {
            time++;
            counter=0;
        }
    }   
}

var draw = function()
{   
    thememusic.play();
    
    if(!player.isDead)
    {
        context.fillStyle = '#ffffff';
        context.fillRect(0,0,canvas.width,canvas.height);
        player.xPrev = player.x;
        player.yPrev = player.y;
        if (controller.up&& player.inAir == false)
        {
            jumpsound.play();
            player.yVelocity -= 15*scale;
            player.inAir = true;
        }
        
        if(controller.right)
        {
           // walksound.play();
            player.xVelocity +=1*scale;
        }
        if (controller.left)
        {
           // walksound.play();
            player.xVelocity -=1*scale;
        }
        
        for (let index = 0; index < objects.length; index++) 
        {
            drawTile(objects[index]);
        }
    
    
        player.yVelocity+=gravitation;

        
        if(player.inLava)
        {
        player.xVelocity*=0.6;
        player.yVelocity+=0.4*scale;
        player.inLava=false;
        }
        player.x += player.xVelocity;
        player.y += player.yVelocity;
        player.xVelocity *=0.8;
    
    

        showCounter();
        enemiesHandler();
        drawTile(player);
        
       
        for (let i = 0; i < objects.length; i++) {
            // collideHandler(objects[i],player,objects[i].color);
                if (collideHandler(objects[i],player,objects[i].pic) == true)
                {
                objects[i].pic = airimg;
                }
            }
      if(player.points==coins)
    {
            end=true; 
            player.pic=playerwin;
            context.drawImage(corruptwin,(canvas.width-canvas.height*1.5)/2,0,canvas.height*1.5,canvas.height);
            if(wasWin==true)
            winsound.play();
            wasWin = false;
            
    }
        
    }
    else
    {
        
        player.pic=deadplayer;
    }
    if(player.y>canvas.height+size)
    {
        
        context.drawImage(cat,(canvas.width-canvas.height*1.5)/2,0,canvas.height*1.5,canvas.height);
        
    }
}
   // var enemySpeed=2;
    var enemiesHandler = function()
    {
        for (let index = 0; index < enemies.length; index++) 
        {
            drawTile(enemies[index]);
            enemies[index].x+=enemies[index].speed;
           if( collideHandler(enemies[index],player,enemyimg)==true)
           {
               enemydiessound.play();
               player.kills++;
               enemies[index].y+=canvas.height*2;
           }
           //enemies[index].pic=airimg;
           
            for (let j = 0; j < objects.length; j++) 
            {
                if (objects[j].pic!=airimg)
                {
                    if(isCollided(objects[j],enemies[index]))
                    {
                        enemies[index].speed *=-1;
                    }
                }
            }
        }
        
    }

    var setObjects=function()
{
    for (let i = 0; i < convertedLevel.length; i++)
    {
        for (let j = 0; j < convertedLevel[0].length; j++) 
        {
            //drawTile(size*j,size*i,size,size,readTile(convertedLevel[i][j])) ;
            let object = new Object(size*j,size*i,size,size,readTileImage(convertedLevel[i][j]));
            objects.push(object);
            if(object.pic==playerimg)
            {  
                player.x = object.x;
                player.y = object.y;
                console.debug(object.pic);
                object.pic=airimg;
          
            }
            if(object.pic==enemyimg)
            {  
                let enemy = new Enemy(object.x,object.y,object.width,object.height,object.pic,-3)
                enemies.push(enemy);
                object.pic=airimg;
            }
            if(object.pic==coinimg)
            {  
                coins++;
          
            }
            
        }
    }
}

var level = [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "x     x+   x                                                              x",
    "x     x    x                                                              x",
    "x     x                                            +                      x",
    "x--x  x     <                                                             x",
    "x  x xx    !                                     $                        x",
    "x  x     ~..~~!!!        x  x  xxxxxxxxx~~~~~~~~~                         x",
    "x  x      x   xxx~~~..   x x  x                                           x",
    "x  x~~~~  x              x x  x                                           x",
    "x            ............x x  xxx                                         x",
    "x    $    <     $ + $ + $  x  $+x                                         x",
    "x         $        <       x  xxx                                         x",
    "x==           ~~~~~~~~~~~~~x  x                                           x",
    "x                          x  x                                           x",
    "x                          x  x                                           x",
    "x ~~  ..  ...              x  x                                           x",
    "x              $           x  x                                           x",
    "x                          x  x                                           x",
    "x  ...........   x         x  x                                           x",
    "x            x!!!x         x  x                                           x",
    "x            xxxxx         x  x                                           x",
    "xx........x--x             x$ x                                           x",
    "x$        x  x             x $x                                           x",
    "x   <     x  x             x$ x                                           x",
    "x-------x-x--x             x $x                                           x",
    "x       x x  x             x$ x                                           x",
    "x       x x  x             x $x                                           x",
    "x xxxxxxx x--x             x$ x    x                                      x",
    "x       x x  x       $x    x  x  $ x x                                    x",
    "x   $   x x  x      x x    x  x    x x                                    x",
    "xxxxxxx x x  xxxxxxxx xxxxxx  xxxxxx xxxxxxx                             xx",
    "x       x x  x                             x          $              xxxxxx",
    "x@      x            <                    +x!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!x",
    "xxxxxxxxxxx==xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx x"  
];
  var converted = [];
  
  var convertLevel = function(lvl)
  {
      
      for (let i = 0; i < lvl.length; i++)
      {
          converted.push(level[i].split(''));
      }
      return converted;
  }
 


document.getElementById('btn1').onclick = function()
{
    document.getElementById('btn1').style.display='none';
    document.getElementById('file').style.display='none';
    document.getElementById('helpbutton').style.display='none';
    convertedLevel = convertLevel(level);
    canvas.width = convertedLevel[0].length*size;
    canvas.height = convertedLevel.length*size;
    setObjects();
    startAnimation(FPS);
}
document.getElementById('helpbutton').onclick = function()
{
    window.open("https://github.com/denshust/PlatformerBeta/blob/main/info.txt");
}
function setLevelDefault()
{   
        
         
   
       
}


    if ( ! (window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
  }
  
  function handleFileSelect(evt) {
    document.getElementById('btn1').style.display='none';
    document.getElementById('file').style.display='none';
    document.getElementById('helpbutton').style.display='none';
      var file = evt.target.files[0];
      if (!file.type.match('text.*')) {
              return alert(file.name + " is not a valid text file.");
      }
      var reader = new FileReader();
       reader.readAsText(file);
       reader.onload = function (e) {
         var textToArray = reader.result.split("\n").map(function(x){return x.split("")});
         console.log(textToArray); 
         convertedLevel = textToArray;
         canvas.width = convertedLevel[0].length*size;
         canvas.height = convertedLevel.length*size;
         setObjects();
         startAnimation(FPS);
       };
   }
  
   window.onload = function () {
    document.getElementById('file').addEventListener('change', handleFileSelect, false); 
   
  }


//setObjects();
//startAnimation(FPS);


// window.addEventListener('scroll', e => {
//     window.scrollTo({top: 0})
//     window.scrollTo({left: 0})
//   })




window.addEventListener("keydown",controller.KeyListener);
window.addEventListener("keyup",controller.KeyListener);




