enemy = function(x,y,symbol,desc){
	this.x = x;
	this.y = y;
	this.symbol = symbol;
	this.desc = desc;
	this.name = desc;
	this.color = "<span style='background-color:#DDDDDD';>"+symbol+"</span>";
	this.inv = [];
	this.alive = true;
	this.limbs = new Object;
	this.limbs.parts = [];
	this.limbs.head = new health('healthy');
	this.limbs.head.name = 'head';
	this.limbs.parts.push(this.limbs.head);

	this.limbs.torso = new health('healthy');
	this.limbs.torso.name = 'torso';
	this.limbs.parts.push(this.limbs.torso);

	this.constructStandardRobot = function(){
		this.limbs.torso.neck = new health('healthy');
		this.limbs.torso.neck.name = 'neck';
		this.limbs.parts.push(this.limbs.torso.neck);
		
		this.limbs.torso.rUpArm = new health('healthy');
		this.limbs.torso.rUpArm.name = 'right upper arm';
		this.limbs.parts.push(this.limbs.torso.rUpArm);

		this.limbs.torso.lUpArm = new health('healthy');
		this.limbs.torso.lUpArm.name = "left upper arm";
		this.limbs.parts.push(this.limbs.torso.lUpArm);

		this.limbs.torso.rUpLeg = new health('healthy');
		this.limbs.torso.rUpLeg.name = "right upper leg";
		this.limbs.parts.push(this.limbs.torso.rUpLeg);

		this.limbs.torso.lUpLeg = new health('healthy');
		this.limbs.torso.lUpLeg.name = "left upper leg";
		this.limbs.parts.push(this.limbs.torso.lUpLeg);

		this.limbs.rArm = new health('healthy');
		this.limbs.rArm.name = "right lower arm";
		this.limbs.parts.push(this.limbs.rArm);

		this.limbs.rArm.claw = new health('healthy');
		this.limbs.rArm.claw.name = "right claw";
		this.limbs.parts.push(this.limbs.rArm.claw);

		this.limbs.lArm = new health('healthy');
		this.limbs.lArm.name = "left lower arm";
		this.limbs.parts.push(this.limbs.lArm);

		this.limbs.lArm.claw = new health('healthy');
		this.limbs.lArm.claw.name = "left claw";
		this.limbs.parts.push(this.limbs.lArm.claw);

		this.limbs.rLeg = new health('healthy');
		this.limbs.rLeg.name = "right lower leg";
		this.limbs.parts.push(this.limbs.rLeg);

		this.limbs.rLeg.foot = new health('healthy');
		this.limbs.rLeg.foot.name = "right foot";
		this.limbs.parts.push(this.limbs.rLeg.foot);

		this.limbs.lLeg = new health('healthy');
		this.limbs.lLeg.name = 'left lower leg';
		this.limbs.parts.push(this.limbs.lLeg);

		this.limbs.lLeg.foot = new health('healthy');
		this.limbs.lLeg.foot.name = 'left foot';
		this.limbs.parts.push(this.limbs.lLeg.foot);
	}

	this.skills = new Object;
	this.generateSkills = function(){
		this.unarmed = new skill('unarmed',5,1);
		this.dodging = new skill('dodging',1,1);
	}
	this.generateSkills();

	this.bleed = function(source, level){
	  grid[((this.y * 10) + this.x)].colorIn(3,9,0);
	  if(source.x > this.x){  //if they are to the RIGHT
	    if(level <= 3){
	      for(x=0;x<level +1;x++){
	        distance = randomGen(0,1);
	        locationB = randomGen(0,6);
	        if(locationB == 1){
	          grid[((this.y * 10) + this.x)+10 + distance].colorIn(3,9,0);
	        }
	        else if(locationB == 2){
	          grid[((this.y * 10) + this.x)-1 - distance].colorIn(3,9,2);
	        }
	        else if(locationB == 3){
	          grid[((this.y * 10) + this.x)-10 - distance].colorIn(3,9,2);
	        }
	        else if(locationB == 4){
	          grid[((this.y * 10) + this.x)-11 - distance].colorIn(3,9,2);
	        }
	        else if(locationB == 5){
	          grid[((this.y * 10) + this.x)+9 - distance].colorIn(3,9,2);
	        }
	      }
	    } 
	  }
	  if(source.y<this.y){  //if they are ABOVE
	    if(level <= 3){
	      for(x=0;x<level +1;x++){
	        distance = randomGen(0,1);
	        locationB = randomGen(0,6);
	        if(locationB == 1){
	          grid[((this.y * 10) + this.x)+10 + distance].colorIn(3,9,2);
	        }
	        else if(locationB == 2){
	          grid[((this.y * 10) + this.x)-1 - distance].colorIn(3,9,0);
	        }
	        else if(locationB == 3){
	          grid[((this.y * 10) + this.x)+1 - distance].colorIn(3,9,2);
	        }
	        else if(locationB == 4){
	          grid[((this.y * 10) + this.x)+11 - distance].colorIn(3,9,0);
	        }
	        else if(locationB == 5){
	          grid[((this.y * 10) + this.x)+9 - distance].colorIn(3,9,2);
	        }
	      }
	    } 
	  }
	  if(source.y>this.y){  //if they are BELOW
	    if(level <= 3){
	      for(x=0;x<level +1;x++){
	        distance = randomGen(0,1);
	        locationB = randomGen(0,6);
	        if(locationB == 1){
	          grid[((this.y * 10) + this.x)-10 + distance].colorIn(3,9,0);
	        }
	        else if(locationB == 2){
	          grid[((this.y * 10) + this.x)-1 - distance].colorIn(3,9,2);
	        }
	        else if(locationB == 3){
	          grid[((this.y * 10) + this.x)+1 - distance].colorIn(3,9,0);
	        }
	        else if(locationB == 4){
	          grid[((this.y * 10) + this.x)-11 - distance].colorIn(3,9,2);
	        }
	        else if(locationB == 5){
	          grid[((this.y * 10) + this.x)-9 - distance].colorIn(3,9,0);
	        }
	      }
	    } 
	  }
	  if(source.x < this.x){  //if they are to the LEFT
	    if(level <= 3){
	      for(x=0;x<level +1;x++){
	        distance = randomGen(0,1);
	        locationB = randomGen(0,6);
	        if(locationB == 1){
	          grid[((this.y * 10) + this.x)+10 + distance].colorIn(3,9,0);
	        }
	        else if(locationB == 2){
	          grid[((this.y * 10) + this.x)+1 - distance].colorIn(3,9,0);
	        }
	        else if(locationB == 3){
	          grid[((this.y * 10) + this.x)-10 - distance].colorIn(3,9,2);
	        }
	        else if(locationB == 4){
	          grid[((this.y * 10) + this.x)-9 - distance].colorIn(3,9,0);
	        }
	        else if(locationB == 5){
	          grid[((this.y * 10) + this.x)+11 - distance].colorIn(3,9,2);
	        }
	      }
	    } 
	  }
	}

	this.checkAvailability = function(direction){
		if(direction == "left"){
	    	//testTile = player;
	        prevLoc = ((this.y*10) + this.x);
	        //console.log(grid[prevLoc]);
	        if(grid[(prevLoc - 1)].desc !== "floor" || grid[(prevLoc - 1)].character !== null){
	          //console.log(grid[(prevLoc - 1)].symbol);
	          //console.log("Can't do that!");
	          	if(grid[(prevLoc - 1)].character == player && this.inv.length == 0){
			        combat(this,player,"unarmed");
			        return false;
		        }
	          return false;
	        }
	        else{
	          return true;
	        }
	    }
	    else if(direction == "up"){
	    	//testTile = player;
			prevLoc = ((this.y*10) + this.x);
			if(grid[(prevLoc - 10)].desc !== "floor" || grid[(prevLoc - 10)].character !== null){
			  //console.log(grid[(prevLoc - 10)].symbol);
			  //console.log("Can't do that!");
			  	if(grid[(prevLoc - 10)].character == player && this.inv.length == 0){
			    	combat(this,player,"unarmed");
			    	return false;
		        }
		        else if(grid[(prevLoc - 10)].character !== player) {
					if(this.checkAvailability('left')){
						this.x --;
				        prevLoc = ((this.y*10) + this.x);
				        grid[prevLoc].character = this;
				        grid[prevLoc+1].character = null;    
					}
				}
				return false;
			}
			else{
				return true;
			}
		}
		else if(direction == "right"){
	    	//testTile = player;
	        prevLoc = ((this.y*10) + this.x);
	        if(grid[(prevLoc + 1)].desc !== "floor" || grid[(prevLoc + 1)].character !== null){
	          //console.log(grid[(prevLoc + 1)].symbol);
	          //console.log("Can't do that!");
	          	if(grid[(prevLoc + 1)].character == player && this.inv.length == 0){
			        combat(this,player,"unarmed");
			        return false;
		        }
		        else if(grid[(prevLoc + 1)].character !== player) {
					if(this.checkAvailability('down')){
						this.y ++;
				        prevLoc = ((this.y*10) + this.x);
				        grid[prevLoc].character = this;
				        grid[prevLoc-10].character = null;    
					}
				}
	          return false;
	        }
	        else{
	          return true;
	        }
	    }
	    else if(direction == "down"){
	    	//testTile = player;
			prevLoc = ((this.y*10) + this.x);
			if(grid[(prevLoc + 10)].desc !== "floor" || grid[(prevLoc + 10)].character !== null){
			  //console.log(grid[(prevLoc - 10)].symbol);
			  //console.log("Can't do that!");
			  	if(grid[(prevLoc + 10)].character == player && this.inv.length == 0){
			        combat(this,player,"unarmed");
			        return false;
		        }
		        else if(grid[(prevLoc + 10)].character !== player) {
					if(this.checkAvailability('left')){
						this.x --;
				        prevLoc = ((this.y*10) + this.x);
				        grid[prevLoc].character = this;
				        grid[prevLoc+1].character = null;    
					}
				}
			  	return false;
			}

			else{
			  return true;
			}
		}
	}
	this.update = function(){
		if(this.alive == false && this.name !== "dead"){
			this.name == "dead";
			corpse = new item(this.x,this.y, "%", 'corpse');
			corpse.color = '<span style="background-color:#A0A0A0";>' +corpse.symbol+ "</span>";
			grid[((this.y*10) + this.x)].character = null;

		}
		else if(player.alive == true && this.alive == true){
			if(player.x < this.x){
				if(this.checkAvailability('left')){
					this.x --;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc+1].character = null;    
				}
			}
			else if(player.y < this.y){
				if(this.checkAvailability('up')){
					this.y --;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc+10].character = null;    
				}
			}
			else if(player.x > this.x){
				if(this.checkAvailability('right')){
					this.x ++;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc-1].character = null;    
				}
			}
			else if(player.y > this.y){
				if(this.checkAvailability('down')){
					this.y ++;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc-10].character = null;    
				}
			}
		}

	}
}


var robot = new enemy(8,2, "Θ",'Robot');
robot.constructStandardRobot();
entities.push(robot);
/**
var robot = new enemy(4,8, "Θ",'Robot');
robot.constructStandardRobot();
entities.push(robot);

var robot = new enemy(1,5, "Θ",'Robot');
robot.constructStandardRobot();
entities.push(robot);

var robot = new enemy(8,1, "Θ",'Robot');
robot.constructStandardRobot();
entities.push(robot);**/


var weapon = new item(5,5,"/","weapon");
weapon.type = "sharp";
