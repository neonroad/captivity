graph = document.getElementById("gameGraph");
debounce = 0;
toggle = 0;

History = document.getElementById("history");
History.legible = 0;

skillBox = document.getElementById("skills");

invBox = document.getElementById("inventory");

statusBox = document.getElementById("statusScreen");

statusScreen = new Object();

turn = 0;
pastTurn = turn;

pause = 0;

fps = 25;

var grid = [];

checkList = function(list, object){
  for(x=0; x < list.length; x++){
    if(list[x] == object){
      list.splice(x,1);
    }
  }
}

reticle = function(x, y, symbol, color){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.color ='<span style="background-color:'+color+';"">'+this.symbol+'</span>';
  grid[this.x + this.y*10].reticle = this;
}

particles = [];

particle = function(x, y, symbol, color){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.color ='<span style="background-color:'+color+';"">'+this.symbol+'</span>';
  this.update = function(){
    grid[(y*10) + x].particles.push(this)
  }
  this.update();
  particles.push(this);
}

projectile = function(x, y, direction, color){
  this.x = x;
  this.y = y;
  this.symbol = "╬";
  this.color = color;
  this.exists = 1;
  if(direction == 'left' || direction == 'right'){
    this.symbol = "═";
  }
  else{
    this.symbol = "║"
  }
  this.symbol ='<span style="background-color:'+color+';"">'+this.symbol+'</span>';
}

point = function(x,y,symbol,desc){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.character = null;
  this.desc = desc;
  this.items = [];
  this.projectile = null;
  this.particles = [];
  this.reticle = null;
  this.color = "~";
  this.colorIn = function(constant, changing, version){
    color = randomGen(1,changing);
    if(version == 1){
      color = '<span style="background-color:#'+color+constant+color+constant+color+constant+';"">'+this.symbol+'</span>';
    }
    else if(version == 2){
      color = '<span style="background-color:#'+constant+color+color+color+color+color+';"">'+this.symbol+'</span>';
    }
    else if(version == 3){
      color = '<span style="background-color:#'+ constant +';"">'+this.symbol+'</span>';
    }
    else{
      color = '<span style="background-color:#'+constant +color+constant+color+constant +color+';"">'+this.symbol+'</span>';
    }
    this.color = color;
  }
};

//item gen
item = function(x,y,symbol,desc){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.desc = desc;
  this.color = "<span style='background-color:#555555';>"+symbol+"</span>";
  this.name = desc;
  grid[(this.y * 10) + this.x].items.push(this);
}

//Random number gen
function randomGen(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//var t = new point(3,4);
//var constant = 0;

//Experience
calcXP = function(X){
  return L = Math.floor(Math.floor(5 + Math.sqrt(25 + 100 * X)) / 10);
}
//skill
skill = function(name,level,currentxp){
  this.name = name;
  this.level = level;
  this.currentxp = currentxp;
}


//create basic human
health = function(name,child,parent,status){
  this.name = name;
  if(status == undefined){
    this.status = 'healthy';
  }
  else{
    this.status = status;
  }
  player.limbs.parts.push(this);
}

//Create player
var player = new point(6,1,"@",'player');
player.color = this.color = "<span style='background-color:#FFFFFF';>@</span>";;
player.name = "Player";
player.limbs = new Object;
player.limbs.parts = [];
player.alive = true;
player.inv = [];
player.wield = 0;
player.aiming = 0;
player.level = 1;
player.turnBuffer = 1;
player.createLimbs = function(){
  player.limbs.head = new health('head');
  player.limbs.neck = new health('neck');
  player.limbs.rHand = new health('right hand');
  player.limbs.lHand = new health('left hand');
  player.limbs.rFoot = new health('right foot');
  player.limbs.lFoot = new health('left foot');
  player.limbs.rArm = new health('right lower arm',player.limbs.rHand)
  player.limbs.lArm = new health('left lower arm',player.limbs.lHand);
  player.limbs.rLeg = new health('right lower leg',player.limbs.rFoot);
  player.limbs.lLeg = new health('left lower leg',player.limbs.lFoot);
  player.limbs.rUpArm = new health('right upper arm',player.limbs.rArm);
  player.limbs.lUpArm = new health('left upper arm', player.limbs.lArm);
  player.limbs.rUpLeg = new health('right upper leg', player.limbs.rLeg);
  player.limbs.lUpLeg = new health('left upper leg', player.limbs.lLeg);


  player.limbs.lFoot.fight = true;
  player.limbs.rFoot.fight = true;
  player.limbs.lHand.fight = true;
  player.limbs.rHand.fight = true;

}
player.createLimbs();

player.bleed = function(source, level){
    grid[((source.y * 10) + source.x)].colorIn('C',4,2);
    blood = new particle(source.x,source.y, '░','#FF0000');
    blood.step = 0;
    blood.direction = randomGen(1,9)
    blood.parent = source;
    if(level == undefined){
      level = 2;
    }
    blood.update = function(){
      this.step ++;
      if(this.step < randomGen(level,4) && grid[(this.y * 10) + this.x].desc !== 'wall'){
        checkList(grid[(this.y * 10) + this.x].particles, this);

        switch(this.direction){
          case 1:
            this.x++;
            break;
          case 2:
            this.x++;
            this.y++;
            break;
          case 3:
            this.y++;
            break;
          case 4:
            this.x--;
            this.y++;
            break;
          case 5:
            this.x--;
            break;
          case 6:
            this.x--;
            this.y--;
            break;
          case 7:
            this.y--;
            break;
          case 8:
            this.x++;
            this.y--;
            break;
        }
        if((this.parent.alive == false || this.parent.alive == undefined) && this.step %2 == 0){
          player.bleed(this.parent);
        }
        grid[(this.y * 10) + this.x].particles.push(this);
      }
      else{
        checkList(grid[(this.y * 10) + this.x].particles, this);
        grid[((this.y * 10) + this.x)].colorIn('C',4,2);
        checkList(particles, this);
      }


    }
    
}

player.gib = function(part, force){
    this.partSymbol = "~";
    part.status = "sliced";
    if(part !== undefined){
      if(part.name == 'head' && this.alive == 1){
        this.alive = 0;
        this.update();
      }
      if(part.name == 'neck'){
        for(x=0;x<this.limbs.parts.length;x++){
          //console.log("hey");
          if(this.limbs.parts[x].name == 'head'){
            this.gib(this.limbs.parts[x]);
          }
        }
        for(x=0;x<this.limbs.parts.length;x++){
          if(this.limbs.parts[x] == part){
            //this.limbs.parts.splice(x,1);
          }
        }
        return;
      }
      if(part.name == 'torso'){
        this.partSymbol = "¥";
        this.alive = 0;
        for(x=0;x<this.limbs.parts.length;x++){
          if(this.limbs.parts[x] == part){
            //console.log('its the torso');
            break;
          }
          else{
            //this.gib(this.limbs.parts[x]);
          }
        }
        //return;

      }
      if(force == undefined){
        force = randomGen(2,3);
      }
      giblet = new item(this.x,this.y,this.partSymbol,part.name);
      grid[(this.y*10) + this.x].colorIn('C',4,2);
      grid[(this.y*10) + this.x].items.push(giblet);
      giblet.color = "<span style='background-color:#6B0000';>"+giblet.symbol+"</span>"
      var direction = randomGen(1,9);


      if(direction == 1){
        direction = 'up';
        dirNum = 10;
        dirAdvX = 0;
        dirAdvY = -1;
      }
      else if(direction == 2){
        direction = "left";
        dirNum = 1;
        dirAdvX = -1;
        dirAdvY = 0;
      }
      else if(direction == 3){
        direction = "down";
        dirNum = -10;
        dirAdvX = 0;
        dirAdvY = 1;
      }
      else if(direction == 4){
        direction = "right";
        dirNum = -1;
        dirAdvX = 1;
        dirAdvY = 0;
      }
      else if(direction == 5){
        direction = "upright";
        dirNum = 9;
        dirAdvX = 1;
        dirAdvY = -1;
      }
      else if(direction == 6){
        direction = "upleft";
        dirNum = 11;
        dirAdvX = -1;
        dirAdvY = -1;
      }
      else if(direction == 7){
        direction = "downright";
        dirNum = -11;
        dirAdvX = 1;
        dirAdvY = 1;
      }
      else if(direction == 8){
        direction = "downleft";
        dirNum = -9;
        dirAdvX = -1;
        dirAdvY = 1;
      }
      for(f=0;f<force;f++){
        if(direction !== undefined){
          for(g=0;g<grid[(giblet.y*10) + giblet.x +dirNum].items.length;g++){
            if(grid[(giblet.y*10) + giblet.x+dirNum].items[g] == giblet){
              //console.log(part.name + " IS GONNA BUG OUT");
              grid[(giblet.y*10) + giblet.x+dirNum].items.splice(g,1);
              grid[(giblet.y*10) + giblet.x].colorIn('C',4,2);
            }
          }
          if(grid[(giblet.y*10) + giblet.x +(dirNum*-1)].desc !== 'floor'){
            for(g=0;g<grid[(giblet.y*10) + giblet.x +dirNum].items.length;g++){
              if(grid[(giblet.y*10) + giblet.x+dirNum].items[g] == giblet){
                //console.log(part.name + " IS GONNA BUG OUT");
                grid[(giblet.y*10) + giblet.x+dirNum].items.splice(g,1);
                grid[(giblet.y*10) + giblet.x].colorIn('C',4,2);
              }
            }
            //console.log(part.name + " IS GONNA BUG OUT1");
          }
          else{
            giblet.x = giblet.x + dirAdvX;
            giblet.y = giblet.y + dirAdvY;
            grid[(giblet.y*10) + giblet.x].items.push(giblet);
            for(g=0;g<grid[(giblet.y*10) + giblet.x +dirNum].items.length;g++){
              if(grid[(giblet.y*10) + giblet.x+dirNum].items[g] == giblet){
                //console.log("destroy");
                grid[(giblet.y*10) + giblet.x+dirNum].items.splice(g,1);
                grid[(giblet.y*10) + giblet.x].colorIn('C',4,2);
                //console.log(part.name + " IS GONNA BUG OUT");
              }
            }
            //console.log(part.name + " IS GONNA BUG OUT");
          }

        }
        
      }
      for(g=0;g<grid[(giblet.y*10) + giblet.x +dirNum].items.length;g++){
        if(grid[(giblet.y*10) + giblet.x+dirNum].items[g] == giblet){
          //console.log(part.name + " IS GONNA BUG OUT");
          grid[(giblet.y*10) + giblet.x+dirNum].items.splice(g,1);
          grid[(giblet.y*10) + giblet.x].colorIn('C',4,2);
        }
      }
      // for(x=0;x<this.limbs.parts.length;x++){
      //   if(this.limbs.parts[x] == part){
      //     //this.limbs.parts.splice(x,1);
      //   }
      // }
      if(part.name == "right upper arm"){
        for(x=0;x<this.limbs.parts.length;x++){
          //console.log("hey");
          if(this.limbs.parts[x].name == 'right lower arm'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      if(part.name == 'right lower arm'){
        for(x=0;x<this.limbs.parts.length;x++){
          if(this.limbs.parts[x].name == 'right hand'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      if(part.name == "left upper arm"){
        for(x=0;x<this.limbs.parts.length;x++){
          if(this.limbs.parts[x].name == 'left lower arm'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      if(part.name == 'left lower arm'){
        for(x=0;x<this.limbs.parts.length;x++){
          if(this.limbs.parts[x].name == 'left hand'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      if(part.name == "right upper leg"){
        for(x=0;x<this.limbs.parts.length;x++){
          //console.log("hey");
          if(this.limbs.parts[x].name == 'right lower leg'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      if(part.name == "right lower leg"){
        for(x=0;x<this.limbs.parts.length;x++){
          //console.log("hey");
          if(this.limbs.parts[x].name == 'right foot'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      if(part.name == "left upper leg"){
        for(x=0;x<this.limbs.parts.length;x++){
          //console.log("hey");
          if(this.limbs.parts[x].name == 'left lower leg'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      if(part.name == "left lower leg"){
        for(x=0;x<this.limbs.parts.length;x++){
          //console.log("hey");
          if(this.limbs.parts[x].name == 'left foot'){
            this.gib(this.limbs.parts[x]);
          }
        }
      }
      console.log('Gibbed ' + part.name);
    }

}


player.checkBrokenBones = function(){


  player.turnBuffer = 1;
  player.grasp = 0;
  player.turnBuffer = 19-player.limbs.parts.length;
  for(h=0;h<player.limbs.parts.length;h++){
    if(player.limbs.parts[h].status == "broken" || player.limbs.parts[h].status == "sliced" || player.limbs.parts[h].status == "xshot"){
      player.turnBuffer += 1;
    }

    if((player.limbs.parts[h].name == "right hand" || player.limbs.parts[h].name == "left hand") && (player.limbs.parts[h].status !== "broken" || player.limbs.parts[h].status !== "sliced" || player.limbs.parts[h].status !== "xshot")){
      player.grasp ++;
    }
    if((player.limbs.parts[h].name == "right upper arm" || player.limbs.parts[h].name == "left upper arm" || player.limbs.parts[h].name == "left lower arm" || player.limbs.parts[h].name == "right lower arm") && (player.limbs.parts[h].status == "broken" || player.limbs.parts[h].status == "sliced" || player.limbs.parts[h].status == "xshot")){
      //player.grasp --;
      /*for(k=0;k<player.limbs.parts.length;k++){
        if(player.limbs.parts[k].name == "left lower arm" || player.limbs.parts[k].name == "right lower arm" || player.limbs.parts[k].name == "right hand" || player.limbs.parts[k].name == "left hand"){
          player.limbs.parts[k].status = "broken";
        }
      }*/

    }
    
  }
  if(player.grasp == 0){
    if(player.wield !== 0){
        for(y=0;y<player.inv.length;y++){
          if(player.inv[y] = player.wield){
            player.inv.splice(y,1);
          }
        }
        grid[(player.y *10) + player.x].items.push(player.wield);
        player.wield = 0;
    }
  }
}

player.fireAt = function(direction){
  pause = 1;
  //History.legible ++;
  fire = function(frontx, fronty){
    player.aiming = 0;
    friendlyBullet = new projectile(frontx,fronty,direction, '#00FF00');
    friendlyBullet.distance = 0;
    grid[(fronty*10)+frontx].projectile = friendlyBullet;
    //clearInterval(timer);
    while(friendlyBullet.exists == 1){
      console.log('calculating bullet');
      if(grid[(friendlyBullet.y*10)+friendlyBullet.x].character !== null || grid[(friendlyBullet.y*10)+friendlyBullet.x].desc !== 'floor'){
        friendlyBullet.exists = 0;
        pause = 0;
        if(grid[(friendlyBullet.y*10)+friendlyBullet.x].desc !== 'floor'){
          grid[(friendlyBullet.y*10)+friendlyBullet.x].symbol = "#";
          //grid[(friendlyBullet.y*10)+friendlyBullet.x].color = '<span style="background-color:#00AA00;"">'+grid[(friendlyBullet.y*10)+friendlyBullet.x].symbol+'</span>';
          grid[(friendlyBullet.y*10)+friendlyBullet.x].colorIn(6,9,1);
        }
        else if(grid[(friendlyBullet.y*10)+friendlyBullet.x].character !== null){
          combat(player, grid[(friendlyBullet.y*10)+friendlyBullet.x].character, player.wield.type, friendlyBullet.distance); //on HIT
        }
        grid[(friendlyBullet.y*10)+friendlyBullet.x].projectile = null;
      }
      else{
        grid[(friendlyBullet.y*10)+friendlyBullet.x].projectile = null;
        if(direction == 'left'){
          friendlyBullet.x --;
        }
        else if(direction == 'up'){
          friendlyBullet.y --;
        }
        else if(direction == 'right'){
          friendlyBullet.x ++;
        }
        else if(direction == 'down'){
          friendlyBullet.y ++;
        }
        grid[(friendlyBullet.y*10)+friendlyBullet.x].projectile = friendlyBullet;
        friendlyBullet.distance ++;

      }
    }
    fps = 25;
  }
  if(direction == 'left'){
    fire(player.x-1,player.y);
  }
  else if(direction == 'up'){
    fire(player.x, player.y-1);
  }
  else if(direction == 'right'){
    fire(player.x+1, player.y);
  }
  else if(direction == 'down'){
    fire(player.x, player.y+1);
  }
  
}

player.update = function(){
  player.checkBrokenBones();
  if(player.alive == false){
    var playerCorpse = new item(player.x,player.y,"@",'corpse');
    playerCorpse.color = '<span style="background-color:#C40000";>@</span>';
    player.color = '<span style="background-color:#C40000";>@</span>';
    grid[((player.y * 10) + player.x)].character = null;
    // setInterval(function(){
    //   update();
    // },100);
    //grid[((player.y * 10) + player.x)].items.push(playerCorpse);
  }
}


var entities = [];
entities.killAll = function(){
  for(e=0;e<entities.length;e++){
    entities[e].alive = 0;
  }
  console.log("Killed all entities.");
}
entities.gibAll = function(){ //hehe this one is fun and glitchy
  for(e=0;e<entities.length;e++){
    entities[e].gib(entities[e].limbs.parts[1]);
  }
}

drawGraph = function(){
  graphSize = 10;
  graph.innerHTML = "";
  grid = [];
  GridX = 0;
  GridY = 0;
  for(y=0;y<graphSize; y++){
    for(x=0;x<graphSize;x++){
      if(y == 0 || y == graphSize-1){
        newPoint = new point(GridX,GridY,"-",'wall');
        newPoint.colorIn(7,9,0);
        grid.push(newPoint);
      }
      else if(x == 0 || x == graphSize-1){
        newPoint = new point(GridX,GridY,"|",'wall');
        newPoint.colorIn(7,9,0);
        grid.push(newPoint);
      }
      else{
        
        if(randomGen(0,15) == 1){
          newPoint = new point(GridX,GridY,"O",'wall');
          newPoint.colorIn(9,9,0);
          grid.push(newPoint);
        }
        else{
          newPoint = new point(GridX,GridY,".",'floor');
          newPoint.colorIn('B',9,0);
          grid.push(newPoint);
        }
      }
      graph.innerHTML += newPoint.color;
      GridX++;
    } 
    GridX = 0;
    graph.innerHTML += "<br>";
    GridY++;
  }
};

updateGraph = function(condition){
  //console.log('updating graph');
  graph.innerHTML = "";
  var counter = 0;
  for(p=0; p < particles.length; p++){
    particles[p].update();
  }
  for(y=0;y<graphSize; y++){
    for(i=0;i<graphSize;i++){
      if(true){
        if(grid[counter].reticle != null){
          graph.innerHTML += grid[counter].reticle.color;
        }
        else if(grid[counter].character != null){
          graph.innerHTML += grid[counter].character.color;
        }
        else if(grid[counter].projectile != null){
          graph.innerHTML += grid[counter].projectile.symbol;
        }
        else if(grid[counter].items.length != 0){
          graph.innerHTML += grid[counter].items[grid[counter].items.length -1].color;
        }
        else if(grid[counter].particles.length != 0){
          graph.innerHTML += grid[counter].particles[grid[counter].particles.length -1].color;
        }

        else{
          graph.innerHTML += grid[counter].color; //View as NORMAL
        }
        counter++;
      }
      //graph.innerHTML += "|("+grid[counter].x+","+grid[counter].y+")|"; //View the COORDINATES
      //graph.innerHTML += "|("+(counter -1) +")|"; //View the GRID ARRAY #

    } 
    graph.innerHTML += "<br>";
  }
  //grid[constant].symbol = "X";

  //update PLAYER
  // for(d=0;d<grid.length;d++){
  //   if(grid[d].x == player.x && grid[d].y == player.y){
  //     grid[d].character = player;
  //   }
  //   for(e=0;e<entities.length;e++){
  //     if(grid[d].x == entities[e].x && grid[d].y == entities[e].y && entities[e].alive == true){
  //       grid[d].character = entities[e];
  //     }
  //   }
  // }
  //return true;
};


drawGraph();
updateGraph();

log = "";

update = function(skip){

  //statusScreen.draw();
  if(true){
    player.update();
  }
  if(player.alive == true && skip !== true){
    for(e=0;e<entities.length;e++){
      entities[e].update();
      if(entities[e] == undefined){
        break;
      }
      if(entities[e].alive == false){
        entities.splice(e,1);
      }
    }
  }
  else if(player.alive == false){
    turn++;
    for(e=0;e<entities.length;e++){
      if(entities[e].alive == true){
        entities[e].update();
      }

    }
  }
  if(History.legible > 5){
    log += History.innerHTML;
    History.innerHTML = "<span style='background-color:#6D6E5F'>[HISTORY]</span><br>";
    History.legible = 0;
  }

  skillBox.innerHTML = "<span style='background-color:#497280'>[SKILLS]</span><br>";

  invBox.innerHTML = "<span style='background-color:#826033'>[INVENTORY]</span><br>";

  

  for(i=0;i<player.inv.length;i++){
    invBox.innerHTML += player.inv[i].name;
    if(player.wield == player.inv[i]){
      invBox.innerHTML += " (wielding)";
    }
    invBox.innerHTML += "<br>";
  }

  /**if(player.blind > 0 && debounce == 0){
    debounce = 1;
    updateGraph("blind");
  }
  else{
    updateGraph();
  } **/
  //location.href = "#historyend";
  updateGraph();
}
//update();
 grid[player.x + player.y*10].character = player;


update();
// setInterval(function(){
//   updateGraph();
// },100);