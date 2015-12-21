graph = document.getElementById("gameGraph");
debounce = 0;

History = document.getElementById("history");
History.legible = 0;

turnBuffer= 0;
turn = 0;
pastTurn = turn;

var grid = [];

point = function(x,y,symbol,desc){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.character = null;
  this.desc = desc;
  this.items = [];
  this.color = "~";
  this.colorIn = function(constant, changing, version){
    color = randomGen(changing,1);
    if(version == 1){
      color = '<span style="background-color:#'+color+constant+color+constant+color+constant+';"">'+symbol+'</span>';
    }
    else if(version == 2){
      color = '<span style="background-color:#'+constant+color+color+color+color+color+';"">'+symbol+'</span>';
    }
    else{
      color = '<span style="background-color:#'+constant +color+constant+color+constant +color+';"">'+symbol+'</span>';
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
  this.color = symbol;
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
health = function(status){
  this.status = status;
}

//Create player
var player = new point(1,1,"@",'player');
player.color = "@";
player.name = "Player";
player.limbs = new Object;
player.limbs.parts = [];
player.alive = true;
player.inv = [];
player.blind = 0;
player.createLimbs = function(){
  player.limbs.head = new health('healthy');
  player.limbs.head.name = "head";
  player.limbs.parts.push(player.limbs.head);

  player.limbs.head.reye = new health('healthy');
  player.limbs.head.reye.name = "right eye";
  player.limbs.parts.push(player.limbs.head.reye);

  player.limbs.head.leye = new health('healthy');
  player.limbs.head.leye.name = "left eye";
  player.limbs.parts.push(player.limbs.head.leye);

  player.limbs.head.mouth = new health('healthy');
  player.limbs.head.mouth.name = "mouth";
  player.limbs.parts.push(player.limbs.head.mouth);

  player.limbs.torso = new health('healthy');
  player.limbs.torso.name = "torso";
  player.limbs.parts.push(player.limbs.torso);

  player.limbs.torso.neck = new health('healthy');
  player.limbs.torso.neck.name = "neck";
  player.limbs.parts.push(player.limbs.torso.neck);

  player.limbs.torso.rUpArm = new health('healthy');
  player.limbs.torso.rUpArm.name = "right upper arm";
  player.limbs.parts.push(player.limbs.torso.rUpArm);

  player.limbs.torso.lUpArm = new health('healthy');
  player.limbs.torso.lUpArm.name = "left upper arm";
  player.limbs.parts.push(player.limbs.torso.lUpArm);

  player.limbs.torso.rUpLeg = new health('healthy');
  player.limbs.torso.rUpLeg.name = "right upper leg";
  player.limbs.parts.push(player.limbs.torso.rUpLeg);

  player.limbs.torso.lUpLeg = new health('healthy');
  player.limbs.torso.lUpLeg.name = "left upper leg";
  player.limbs.parts.push(player.limbs.torso.lUpLeg);

  player.limbs.rLeg = new health('healthy');
  player.limbs.rLeg.name = "right lower leg";
  player.limbs.parts.push(player.limbs.rLeg);

  player.limbs.lLeg = new health('healthy');
  player.limbs.lLeg.name = "left lower leg";
  player.limbs.parts.push(player.limbs.lLeg);

  player.limbs.rLeg.foot = new health('healthy');
  player.limbs.rLeg.foot.name = "right foot";
  player.limbs.parts.push(player.limbs.rLeg.foot);

  player.limbs.lLeg.foot = new health('healthy');
  player.limbs.lLeg.foot.name = "left foot";
  player.limbs.parts.push(player.limbs.lLeg.foot);

  player.limbs.rArm = new health('healthy');
  player.limbs.rArm.name = "right lower arm";
  player.limbs.parts.push(player.limbs.rArm);

  player.limbs.lArm = new health('healthy');
  player.limbs.lArm.name = "left lower arm";
  player.limbs.parts.push(player.limbs.lArm);

  player.limbs.rArm.hand = new health('healthy');
  player.limbs.rArm.hand.name = "right hand";
  player.limbs.parts.push(player.limbs.rArm.hand);

  player.limbs.lArm.hand = new health('healthy');
  player.limbs.lArm.hand.name = "left hand";
  player.limbs.parts.push(player.limbs.lArm.hand);

}
player.createLimbs();

player.skills = new Object;
player.generateSkills = function(){
  player.dodging = new skill('dodging',1,1);
  player.unarmed = new skill('unarmed',10,1);
}
player.generateSkills();

player.bleed = function(source, level){
  grid[((player.y * 10) + player.x)].colorIn('C',4,2);
  if(source.x > player.x){  //if they are to the RIGHT
    if(level <= 3){
      for(x=0;x<level +1;x++){
        distance = randomGen(0,1);
        locationB = randomGen(0,6);
        if(locationB == 1){
          grid[((player.y * 10) + player.x)+10 + distance].colorIn('C',4,2);
        }
        else if(locationB == 2){
          grid[((player.y * 10) + player.x)-1 - distance].colorIn('C',4,2);
        }
        else if(locationB == 3){
          grid[((player.y * 10) + player.x)-10 - distance].colorIn('C',4,2);
        }
        else if(locationB == 4){
          grid[((player.y * 10) + player.x)-11 - distance].colorIn('C',4,2);
        }
        else if(locationB == 5){
          grid[((player.y * 10) + player.x)+9 - distance].colorIn('C',4,2);
        }
      }
    } 
  }
  if(source.y<player.y){  //if they are ABOVE
    if(level <= 3){
      for(x=0;x<level +1;x++){
        distance = randomGen(0,1);
        locationB = randomGen(0,6);
        if(locationB == 1){
          grid[((player.y * 10) + player.x)+10 + distance].colorIn('C',4,2);
        }
        else if(locationB == 2){
          grid[((player.y * 10) + player.x)-1 - distance].colorIn('C',4,2);
        }
        else if(locationB == 3){
          grid[((player.y * 10) + player.x)+1 - distance].colorIn('C',4,2);
        }
        else if(locationB == 4){
          grid[((player.y * 10) + player.x)+11 - distance].colorIn('C',4,2);
        }
        else if(locationB == 5){
          grid[((player.y * 10) + player.x)+9 - distance].colorIn('C',4,2);
        }
      }
    } 
  }
  if(source.y>player.y){  //if they are BELOW
    if(level <= 3){
      for(x=0;x<level +1;x++){
        distance = randomGen(0,1);
        locationB = randomGen(0,6);
        if(locationB == 1){
          grid[((player.y * 10) + player.x)-10 + distance].colorIn('C',4,2);
        }
        else if(locationB == 2){
          grid[((player.y * 10) + player.x)-1 - distance].colorIn('C',4,2);
        }
        else if(locationB == 3){
          grid[((player.y * 10) + player.x)+1 - distance].colorIn('C',4,2);
        }
        else if(locationB == 4){
          grid[((player.y * 10) + player.x)-11 - distance].colorIn('C',4,2);
        }
        else if(locationB == 5){
          grid[((player.y * 10) + player.x)-9 - distance].colorIn('C',4,2);
        }
      }
    } 
  }
  if(source.x < player.x){  //if they are to the LEFT
    if(level <= 3){
      for(x=0;x<level +1;x++){
        distance = randomGen(0,1);
        locationB = randomGen(0,6);
        if(locationB == 1){
          grid[((player.y * 10) + player.x)+10 + distance].colorIn('C',4,2);
        }
        else if(locationB == 2){
          grid[((player.y * 10) + player.x)+1 - distance].colorIn('C',4,2);
        }
        else if(locationB == 3){
          grid[((player.y * 10) + player.x)-10 - distance].colorIn('C',4,2);
        }
        else if(locationB == 4){
          grid[((player.y * 10) + player.x)-9 - distance].colorIn('C',4,2);
        }
        else if(locationB == 5){
          grid[((player.y * 10) + player.x)+11 - distance].colorIn('C',4,2);
        }
      }
    } 
  }
}

player.update = function(){
  if(player.alive == false && player.name !== "dead"){
    player.name = "dead";
    var playerCorpse = new item(player.x,player.y,"@",'corpse');
    playerCorpse.color = '<span style="background-color:#C40000";>@</span>';
    player.color = '<span style="background-color:#C40000";>@</span>';
    grid[((player.y * 10) + player.x)].character = null;
    //grid[((player.y * 10) + player.x)].items.push(playerCorpse);
  }
  for(l=0;l<player.limbs.parts.length;l++){
    if((player.limbs.parts[l].name == "left eye" || player.limbs.parts[l].name == "right eye") && player.limbs.parts[l].status == "broken"){
      //grid[((player.y * 10) + player.x)].colorIn('C',4,2);
      player.blind = 2;
      
    }
  }
}
player.die = function(){
  console.log("fusad");
}
player.checkBrokenBones = function(){
  for(h=0;h<player.limbs.parts.length;h++){
    if(player.limbs.parts[h].status == "broken"){
      turnBuffer ++;
    }
  }
}

var entities = [];

drawGraph = function(){
  graph.innerHTML = "";
  grid = [];
  GridX = 0;
  GridY = 0;
  for(y=0;y<10; y++){
    for(x=0;x<10;x++){
      if(y == 0 || y == 9){
        newPoint = new point(GridX,GridY,"-",'wall');
        newPoint.colorIn(7,9,0);
        grid.push(newPoint);
      }
      else if(x == 0 || x == 9){
        newPoint = new point(GridX,GridY,"|",'wall');
        newPoint.colorIn(7,9,0);
        grid.push(newPoint);
      }
      else{
        newPoint = new point(GridX,GridY,"+",'floor');
        newPoint.colorIn('B',9,0);
        grid.push(newPoint);
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
  graph.innerHTML = "";
  var counter = 0;
  for(y=0;y<10; y++){
    for(i=0;i<10;i++){
      if(condition == 'blind'){
        rand = randomGen(0,player.blind*2);
        if(rand == 3){
          graph.innerHTML += grid[counter].color = "<span style='background-color:#000000';>?</span>";
        }
        else{
          if(grid[counter].character != null){
            graph.innerHTML += grid[counter].character.color;
          }
          else if(grid[counter].items.length != 0){
            graph.innerHTML += grid[counter].items[grid[counter].items.length -1].color;
          }

          else{
            graph.innerHTML += grid[counter].color; //View as NORMAL
          }
        }
        
        counter++;
      }
      else{
        if(grid[counter].character != null){
          graph.innerHTML += grid[counter].character.color;
        }
        else if(grid[counter].items.length != 0){
          graph.innerHTML += grid[counter].items[grid[counter].items.length -1].color;
        }

        else{
          graph.innerHTML += grid[counter].color; //View as NORMAL
        }
        counter++;
      }
      //graph.innerHTML += "|("+grid[counter].x+","+grid[counter].y+")|"; //View the COORDINATES
      //graph.innerHTML += "|("+counter+")|"; //View the GRID ARRAY #

    } 
    graph.innerHTML += "<br>";
  }
  //grid[constant].symbol = "X";

  //update PLAYER
  for(d=0;d<grid.length;d++){
    if(grid[d].x == player.x && grid[d].y == player.y){
      grid[d].character = player;
    }
    for(e=0;e<entities.length;e++){
      if(grid[d].x == entities[e].x && grid[d].y == entities[e].y && entities[e].alive == true){
        grid[d].character = entities[e];
      }
    }
  }
};


drawGraph();
updateGraph();

update = function(){
  if(player.name !== "dead"){
    player.update();
  }
  if(turn > pastTurn && player.alive == true){
    if(History.legible > 10){
      History.innerHTML = "";
      History.legible = 0;
    }
    for(e=0;e<entities.length;e++){
      entities[e].update();
      if(entities[e].alive == false){
        entities.splice(e,1);
      }
    }
  }
  else if(player.alive == false){
    turn++;
    if(History.legible > 5){
      History.innerHTML = "";
      History.legible = 0;
    }
    for(e=0;e<entities.length;e++){
      if(entities[e].name !== "dead"){
        entities[e].update();
      }
    }
  }
  /**if(player.blind > 0 && debounce == 0){
    debounce = 1;
    updateGraph("blind");
  }
  else{
    updateGraph();
  } **/
  updateGraph();
}
//update();


setInterval(function(){
  update();
  pastTurn = turn;
},25);