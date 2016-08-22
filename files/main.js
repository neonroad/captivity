
//Starting off by grabbing everything from the document and setting variables for them
graph = document.getElementById("gameGraph");
debounce = 0;
toggle = 0;

History = document.getElementById("history");
History.legible = 0;

skillBox = document.getElementById("skills");

statBox = document.getElementById("stats");

buffBox = document.getElementById("buffs");

statusBox = document.getElementById("statusScreen");

abilityScreen = document.getElementById('abilities');

ability1 = document.getElementById('ability1');

cooldown1 = document.getElementById('cooldown1');

ability2 = document.getElementById('ability2');

cooldown2 = document.getElementById('cooldown2');

statusScreen = new Object();

turn = 0;
pastTurn = turn;

pause = 0;

fps = 25;

//Random number gen
function randomGen(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function doRandom(min,max){
  var x = randomGen(min, max);
  if(x == min){
    return true;
  }
  else{
    return false;
  }
}

abilities = [];

spell = function(name, user){
  this.user = user;
  this.name = name;
  this.cooldown = 0;
}

buff = function(buff, name, duration){
  this.buff = buff;
  this.name = name;
  this.duration = duration;
  this.update = function(){
    this.duration -= 1;
  }
}

checkBuffs = function(unit){
    for (var i = 0; i < unit.buffs.length; i++) {
    unit.buffs[i].unit = unit;

    //activate buffs
    if(unit.buffs[i].name == "Roll Dodge!"){
      unit.immuneToCombat = 1;
      unit.immuneToDamage = 1;
      unit.immuneToCC = 1;
      unit.immuneToTarget = 1;
    }


    if(unit.buffs[i].name == "Pocket Sand Stunned!" && unit.immuneToAll !== 1){
      unit.mobility = false;
    }
    //remove buffs
    unit.buffs[i].update();
    if(unit.buffs[i].duration <= 0){
      unit.buffs[i].purify();
    checkList(unit.buffs, unit.buffs[i]);
    }
    };
}

var grid = [];

checkList = function(list, object){
  for(x=0; x < list.length; x++){
    if(list[x] == object){
      list.splice(x,1);
    }
  }
}
zones = [];

zone = function(x, y, desc, owner){
  this.x = x;
  this.y = y;
  this.desc = desc;
  this.owner = owner;
  zones.push(this);
  this.update = function(){
      grid[this.x + this.y*10].zones.push(this);
  }  
  this.update();
}

units = [];

unit = function(x, y, symbol, color, desc, owner){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.color ='<span style="background-color:'+color+';">'+this.symbol+'</span>';
  this.desc = desc;
  this.owner = owner;
  this.update = function(){
      grid[this.x + this.y*10].units.push(this);
  }
}

UI = function(x, y, symbol, color){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.color ='<span style="background-color:'+color+';">'+this.symbol+'</span>';
  grid[this.x + this.y*10].ui = this;
  this.indicatorUpdate = function(){
    if(grid[this.x+this.y*10].desc !== 'floor'){
      this.color = '<span style="background-color:#3C9DBD;">'+this.symbol+'</span>';
    }
    if(grid[this.x+this.y*10].character !== null){
      this.color = '<span style="background-color:#317991;">'+grid[this.x+this.y*10].character.symbol+'</span>';
    }
    if(grid[this.x+this.y*10].units.length !== 0){
      this.color = '<span style="background-color:#317991;">'+grid[this.x+this.y*10].units[grid[this.x+this.y*10].units.length-1].symbol+'</span>';
    }
  }
}

particles = [];

particle = function(x, y, symbol, color, owner){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.color ='<span style="background-color:'+color+';"">'+this.symbol+'</span>';
  this.owner = owner;
  this.update = function(){
    grid[(y*10) + x].particles.push(this)
  }
  this.update();
  this.removeParticle = function(){
    checkList( grid[(y*10) + x].particles, this);
    checkList( particles, this);
  }
}

var makeParticle = function(unit, symbol, color, step){
  var dust = new particle(unit.x,unit.y, symbol, color, unit);
  dust.step = step;
  dust.update = function(){
    dust.step --;
    if(dust.step <= 0){
      dust.removeParticle();
    }
  }
  particles.push(dust);             
}

projectile = function(x, y, owner, color, desc){
  this.x = x;
  this.y = y;
  this.symbol = "╬";
  this.desc = desc;
  this.owner = owner;
  this.exists = 1;
  this.color ='<span style="background-color:'+color+';"">'+this.symbol+'</span>';
  this.update = function(){
    grid[(this.y*10) + this.x].projectiles.push(this);
  }
  this.checkContact = function(){
    if(grid[(this.y*10) + this.x].character !== owner && grid[(this.y*10) + this.x].character !== null){
      combat(owner, grid[(this.y*10) + this.x].character, 'armed');
      for (var i = 0; i < grid[this.x+this.y*10].projectiles.length; i++) {
        if(grid[this.x+this.y*10].projectiles[i] == this){
          grid[this.x+this.y*10].projectiles.splice(this, 1);
        }
      };
    }
    else if(grid[(this.y*10) + this.x].units.length !== 0){
      grid[(this.y*10) + this.x].units[grid[(this.y*10) + this.x].units.length-1].checkContact(this);
      for (var i = 0; i < grid[this.x+this.y*10].projectiles.length; i++) {
        if(grid[this.x+this.y*10].projectiles[i] == this){
          grid[this.x+this.y*10].projectiles.splice(this, 1);
        }
      };
    }
  }
  this.update();  
}

point = function(x,y,symbol,desc){
  this.x = x;
  this.y = y;
  this.symbol = symbol;
  this.character = null;
  this.desc = desc;
  this.items = [];
  this.zones = [];
  this.projectiles = [];
  this.particles = [];
  this.units = [];
  this.ui = null;
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
player.kills = [];
player.buffs = [];
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


player.checkBrokenBones = function(){

  player.turnBuffer = 1;
  player.grasp = 0;

}

player.update = function(){
  checkBuffs(player);
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
  if(player.classUpdate !== undefined){
    player.classUpdate();
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
        
        if(randomGen(1,15) == 1){
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
  for(y=0;y<graphSize; y++){
    for(i=0;i<graphSize;i++){
      if(true){
        if(grid[counter].ui != null){
          graph.innerHTML += grid[counter].ui.color;
        }
        else if(grid[counter].character != null){
          graph.innerHTML += grid[counter].character.color;
        }
        else if(grid[counter].projectiles.length != 0){
          graph.innerHTML += grid[counter].projectiles[grid[counter].projectiles.length - 1].color;
        }
        else if(grid[counter].units.length != 0){
          graph.innerHTML += grid[counter].units[grid[counter].units.length - 1].color;
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

clearHistory = function(){
  History.innerHTML = "";
}

update = function(skip){

  //statusScreen.draw();
  if(skip !== true){
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
  if(History.legible > 4){
    log += History.innerHTML;
    History.innerHTML = "<span style='background-color:#6D6E5F'>[HISTORY]</span><br>";
    History.legible = 1;
  }

  statBox.innerHTML = "<span style='background-color:#90C3D4'>[STATS]</span><br>";
  statBox.innerHTML += "Health Points:" + player.hp + "/ " + player.hpMax + "<br>";
  statBox.innerHTML += "Physical Damage:" + player.pd + "<br>";
  statBox.innerHTML += "Magical Damage:" + player.md + "<br>";
  statBox.innerHTML += "Armor Class:" + player.ac + "<br>";
  statBox.innerHTML += "Magic Resistance:" + player.mr + "<br>";

  buffBox.innerHTML = "<span style='background-color:#5E9FB5'>[BUFFS]</span><br>";

  for (var i = 0; i < player.buffs.length; i++) {
    if(player.buffs[i].buff == true){
      buffBox.innerHTML+= "<span style ='background-color:#3EB54F'>[" + player.buffs[i].name + ":" + "(" + player.buffs[i].duration + ")" + " " + player.buffs[i].desc + "]</span><br>";
    }
    else{
      buffBox.innerHTML+= "<span style ='background-color:#A33C3C'>[" + player.buffs[i].name + ":" + "(" + player.buffs[i].duration + ")" + " " + player.buffs[i].desc + "]</span><br>";
    }
  };

  for(var e=0;e<zones.length;e++){
    zones[e].update();
    if(zones[e] == undefined){
      break;
    }
  }

  var currentParticles = particles.length;
  for(p=0; p < particles.length; p++){
    if(particles[p] == undefined){
      break;
    }
    else{
      particles[p].update();
      if(currentParticles !== particles.length){
        p --;
        currentParticles = particles.length;
      }
      
    }
  }

  for (var i = 0; i < units.length; i++) {
    units[i].update();
  };

  for (var i = 0; i < abilities.length; i++) {
    if(abilities[i].cooldown > 0){
      abilities[i].cooldown --;
      if(abilities[i].cooldownElement !== undefined){
        abilities[i].cooldownElement.innerHTML = abilities[i].cooldown + "";
      }
    }
    else{
      abilities[i].cooldown = 0;
      if(abilities[i].cooldownElement !== undefined){
        abilities[i].cooldownElement.innerHTML = "";
      }
    }

  };
  updateGraph();
}

//update();
 grid[player.x + player.y*10].character = player;


update();
// setInterval(function(){
//   updateGraph();
// },100);