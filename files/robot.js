dummy = function(x,y,symbol){
	this.name = "Dummy";
	this.x = x;
	this.y = y;
	this.symbol = symbol;
	this.color = "<span style='background-color:#ED6D53';>"+symbol+"</span>";
	this.inv = [];
	this.alive = true;
	this.limbs = new Object;
	this.limbs.parts = [];
	this.Class = "Demo";
	this.level = 1;
	this.kills = [];
	this.buffs = [];
	if(grid[this.x + this.y*10].character !== undefined){
	}
	this.health = function(name,parent,child,status){
	  this.name = name;
	  if(status == undefined){
	    this.status = 'healthy';
	  }
	  else{
	    this.status = status;
	  }
	}
	this.limbs.head = new this.health('head');
	this.limbs.parts.push(this.limbs.head);
	this.limbs.neck = new this.health('neck');
	this.limbs.parts.push(this.limbs.neck);
	this.limbs.torso = new this.health('torso');
	this.limbs.parts.push(this.limbs.torso);
	this.turnBuffer = 0;
	this.stall = 0;
	this.sight = 5;
	entities.push(this);
	//Functions
	this.createLimbs = function(){
		this.limbs.lHand = new this.health('left hand');
		this.limbs.parts.push(this.limbs.lHand);
		this.limbs.rHand = new this.health('right hand');
		this.limbs.parts.push(this.limbs.rHand);
		this.limbs.rArm = new this.health('right arm',this.limbs.rHand);
		this.limbs.parts.push(this.limbs.rArm);
		this.limbs.lArm = new this.health('left arm',this.limbs.lHand);
		this.limbs.parts.push(this.limbs.lArm);

		this.limbs.rHand.fight = true;
		this.limbs.lHand.fight = true;
	}
	this.createLimbs();
	this.bleed = function(source, level){
	  	grid[((source.y * 10) + source.x)].colorIn('7D2222',0,3);
		blood = new particle(source.x,source.y, '░','#730E0E');
		blood.step = 0;
		blood.direction = randomGen(1,9)
		blood.parent = source;
		if(level == undefined){
			level = 2;
		}
		blood.update = function(){
			this.step ++;
			if(this.step < randomGen(level,6) && grid[(this.y * 10) + this.x].desc !== 'wall'){
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
					this.parent.bleed(this.parent);
				}
				grid[(this.y * 10) + this.x].particles.push(this);
			}
			else{
				checkList(grid[(this.y * 10) + this.x].particles, this);
				grid[((this.y * 10) + this.x)].colorIn('7D2222',0,3);
				checkList(particles, this);
			}


		}
	  
	}

	this.findTarget = function(ignore){
		var f = this.sight;
		var z = 1;
		var x = f+1;
		var y = f+1;
		var currentPos = (this.y*10) + this.x;
		var checkPos = "";
		var stopSearchXR = 0;
		var stopSearchYD = 0;
		var stopSearchXL = 0;
		var stopSearchYU = 0;
		this.target = undefined;
		for(var g = 0; g < f; g++){
			for (var i = 0; i < x; i++) {
				if(stopSearchXR == 1){
					stopSearchXR = 0;
				}
				checkPos = grid[currentPos-(z*10) + i];
				if(checkPos == undefined){
					stopSearchXR = 2;
					break;
				}
				if(((checkPos.y*10 + checkPos.x)+1)%10 == 0){
					//console.log("Max grid reached! (XR)");
					stopSearchXR = 1;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchXR == 0){

					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}

					//checkPos.color = "!";
				}
			};
			for (var i = 0; i < y; i++) {
				if(stopSearchYD == 1){
					stopSearchYD = 0;
				}
				checkPos = grid[currentPos + z + (i*10)];
				if(checkPos == undefined){
					stopSearchYD += 1;
					break;
				}
				//console.log(checkPos.x + checkPos.y*10);
				if(((checkPos.y*10 + checkPos.x)+1)%10 == 0){
					//console.log("Max grid reached! (YD)");
					stopSearchYD = 2;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchYD == 0){
					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}
					//checkPos.color = "<span id = 'combatWound'>?</span>";
				}
			};
			for (var xl = 0; xl < x; xl++) {
				if(stopSearchXL == 1){
					stopSearchXL = 0;
				}
				checkPos = grid[currentPos+(z*10) - xl];
				if(checkPos == undefined){
					stopSearchXL = 2;
					break;
				}
				if(((checkPos.y*10 + checkPos.x))%10 == 0){
					//console.log("Max grid reached! (XL)");
					stopSearchXL = 1;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchXL == 0){
					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}
					//checkPos.color = "<span id='combatMiss'>S</span>";	
				}
			};
			for (var i = 0; i < y; i++) {
				if(stopSearchYU == 1){
					stopSearchYU = 0;
				}
				checkPos = grid[currentPos - z - (i*10)];
				if(checkPos == undefined){
					stopSearchYU += 1;
					break;
				}
				if((checkPos.y*10 + checkPos.x)%10 == 0){
					//console.log("Max grid reached! (YU)");
					stopSearchYU = 2;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchYU == 0){
					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}
					//checkPos.color = "<span id = 'combatBreak'>{</span>";
				}		
			};	
			z++;
		}
		return this.target;

		updateGraph();
	}
	this.actTarget = function(ignore){
		var f = 1;
		var z = 1;
		var x = 1;
		var y = 1;
		var currentPos = (this.y*10) + this.x;
		var checkPos = "";
		var stopSearchXR = 0;
		var stopSearchYD = 0;
		var stopSearchXL = 0;
		var stopSearchYU = 0;
		this.target = undefined;
		for(var g = 0; g < f; g++){
			for (var i = 0; i < x; i++) {
				if(stopSearchXR == 1){
					stopSearchXR = 0;
				}
				checkPos = grid[currentPos-(z*10) + i];
				if(checkPos == undefined){
					stopSearchXR = 2;
					break;
				}
				if(((checkPos.y*10 + checkPos.x)+1)%10 == 0){
					//console.log("Max grid reached! (XR)");
					stopSearchXR = 1;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchXR == 0){

					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}

					//checkPos.color = "!";
				}
			};
			for (var i = 0; i < y; i++) {
				if(stopSearchYD == 1){
					stopSearchYD = 0;
				}
				checkPos = grid[currentPos + z + (i*10)];
				if(checkPos == undefined){
					stopSearchYD += 1;
					break;
				}
				//console.log(checkPos.x + checkPos.y*10);
				if(((checkPos.y*10 + checkPos.x)+1)%10 == 0){
					//console.log("Max grid reached! (YD)");
					stopSearchYD = 2;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchYD == 0){
					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}
					//checkPos.color = "<span id = 'combatWound'>?</span>";
				}
			};
			for (var xl = 0; xl < x; xl++) {
				if(stopSearchXL == 1){
					stopSearchXL = 0;
				}
				checkPos = grid[currentPos+(z*10) - xl];
				if(checkPos == undefined){
					stopSearchXL = 2;
					break;
				}
				if(((checkPos.y*10 + checkPos.x))%10 == 0){
					//console.log("Max grid reached! (XL)");
					stopSearchXL = 1;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchXL == 0){
					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}
					//checkPos.color = "<span id='combatMiss'>S</span>";	
				}
			};
			for (var i = 0; i < y; i++) {
				if(stopSearchYU == 1){
					stopSearchYU = 0;
				}
				checkPos = grid[currentPos - z - (i*10)];
				if(checkPos == undefined){
					stopSearchYU += 1;
					break;
				}
				if((checkPos.y*10 + checkPos.x)%10 == 0){
					//console.log("Max grid reached! (YU)");
					stopSearchYU = 2;
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchYU == 0){
					if(checkPos.character !== null && checkPos.character.name !== ignore){
						this.target = checkPos.character;
					}
					//checkPos.color = "<span id = 'combatBreak'>{</span>";
				}		
			};	
			z++;
		}
		return this.target;

		updateGraph();
	}

	this.checkAvailability = function(direction){
		//check for available items at feet
		if(direction == "left"){
	    	//testTile = player;
	        prevLoc = ((this.y*10) + this.x);
	        //console.log(grid[prevLoc]);
	        if(grid[(prevLoc - 1)].desc !== "floor" || grid[(prevLoc - 1)].character !== null){
	          //console.log(grid[(prevLoc - 1)].symbol);
	          //console.log("Can't do that!");
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
			  	return false;
			}

			else{
			  return true;
			}
		}
	}

	this.update = function(){
		checkBuffs(this);
		if(player.alive == true && this.alive == true && this.mobility !== false){
			grid[this.x + this.y*10].character = this;
			if(this.findTarget('Dummy') == this.actTarget('Dummy') && this.findTarget('Dummy') !== undefined && this.actTarget('Dummy').immuneToCombat !== 1){
				combat(this, this.actTarget('Dummy'), 'stats');
			}
			if(this.findTarget('Dummy') == undefined){
				return;
			}
			else if(this.findTarget('Dummy').x < this.x){
				if(this.checkAvailability('left')){
					this.x --;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc+1].character = null;    
				}
			}
			else if(this.findTarget('Dummy').y < this.y){
				if(this.checkAvailability('up')){
					this.y --;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc+10].character = null;    
				}
			}
			else if(this.findTarget('Dummy').x > this.x){
				if(this.checkAvailability('right')){
					this.x ++;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc-1].character = null;    
				}
			}
			else if(this.findTarget('Dummy').y > this.y){
				if(this.checkAvailability('down')){
					this.y ++;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc-10].character = null;    
				}
			}			
		}
		else if(this.alive == false){
			corpse = new item(this.x,this.y, "%", 'corpse');
			corpse.color = '<span style="background-color:#5B6124";>' +corpse.symbol+ "</span>";
			grid[((this.y*10) + this.x)].character = null;
			checkList(entities,this);
		}
		if(this.classUpdate !== undefined){
			this.classUpdate();
		}
	}
	this.update();
}

//robot = new enemy(randomGen(1,7),randomGen(2,9), "Θ",'Robot');
// //robot.findTarget();
// for (var i = 0; i < 5; i++) {
// 	mann = new dummy(randomGen(3,7),randomGen(3,9), "?");
// };
//mann = new dummy(3,7, "?");
for (var i = 1; i < 8; i++) {
	mann = new dummy(i,8, "?");
	checkClass(mann);
};

//checkClass(mann);


update();