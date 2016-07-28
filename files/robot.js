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
	this.turnBuffer = 0;
	this.stall = 0;
	this.wield = 0;
	this.grasp = 0;
	this.sight = 5;
	this.limbs.torso = new health('healthy');
	this.limbs.torso.name = 'torso';
	this.limbs.parts.push(this.limbs.torso);
	this.target = player;
	entities.push(this);

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
	this.constructStandardRobot();

	this.bleed = function(source, level){
	  	grid[((source.y * 10) + source.x)].colorIn(3,9,0);
		blood = new particle(source.x,source.y, '░','#E1F74F');
		blood.step = 0;
		blood.direction = randomGen(1,9)
		blood.parent = source;
		blood.update = function(){
			this.step ++;
			if(this.step < randomGen(1,6) && grid[(this.y * 10) + this.x].desc !== 'wall'){
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
					robot.bleed(this.parent);
				}
				grid[(this.y * 10) + this.x].particles.push(this);
			}
			else{
				checkList(grid[(this.y * 10) + this.x].particles, this);
				grid[((this.y * 10) + this.x)].colorIn(3,9,0);
				checkList(particles, this);
			}


		}
	  
	}

	this.gib = function(part, force){
		this.partSymbol = "~";
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
						this.limbs.parts.splice(x,1);
					}
				}
				return;
			}
			if(part.name == 'torso'){
				this.partSymbol = "¥";
				this.alive = 0;
				this.update();
				for(x=0;x<this.limbs.parts.length;x++){
					if(this.limbs.parts[x] == part){
						//console.log('its the torso');
						break;
					}
					else{
						this.gib(this.limbs.parts[x]);
						x= 0;
					}
				}
				//return;

			}
			if(force == undefined){
				force = randomGen(2,3);
			}
			giblet = new item(this.x,this.y,this.partSymbol,part.name);
			grid[(this.y*10) + this.x].colorIn(3,9,0);
			grid[(this.y*10) + this.x].items.push(giblet);
			giblet.color = "<span style='background-color:#594341';>"+giblet.symbol+"</span>"
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
							grid[(giblet.y*10) + giblet.x].colorIn(3,9,2);
						}
					}
					if(grid[(giblet.y*10) + giblet.x +(dirNum*-1)].desc !== 'floor'){
						for(g=0;g<grid[(giblet.y*10) + giblet.x +dirNum].items.length;g++){
							if(grid[(giblet.y*10) + giblet.x+dirNum].items[g] == giblet){
								//console.log(part.name + " IS GONNA BUG OUT");
								grid[(giblet.y*10) + giblet.x+dirNum].items.splice(g,1);
								grid[(giblet.y*10) + giblet.x].colorIn(3,9,2);
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
								grid[(giblet.y*10) + giblet.x].colorIn(3,9,2);
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
					grid[(giblet.y*10) + giblet.x].colorIn(3,9,2);
				}
			}
			for(x=0;x<this.limbs.parts.length;x++){
				if(this.limbs.parts[x] == part){
					this.limbs.parts.splice(x,1);
				}
			}
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
					if(this.limbs.parts[x].name == 'right claw'){
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
					if(this.limbs.parts[x].name == 'left claw'){
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
			//console.log('Gibbed ' + part.name);
			this.bleed(giblet);
		}

	}

	this.fireAt = function(direction){
	  pause = 1;
	  //History.legible ++;
		fire = function(frontx, fronty, parent){
			parent.aiming = 0;
			enemyBullet = new projectile(frontx,fronty,direction, '#00FF00');
			enemyBullet.distance = 0;
			grid[(fronty*10)+frontx].projectile = enemyBullet;
			//clearInterval(timer);
			while(enemyBullet.exists == 1){
			  //console.log('calculating bullet');
			  if(grid[(enemyBullet.y*10)+enemyBullet.x].character !== null || grid[(enemyBullet.y*10)+enemyBullet.x].desc !== 'floor'){
			    enemyBullet.exists = 0;
			    pause = 0;
			    if(grid[(enemyBullet.y*10)+enemyBullet.x].desc !== 'floor'){
			      grid[(enemyBullet.y*10)+enemyBullet.x].symbol = "#";
			      //grid[(enemyBullet.y*10)+enemyBullet.x].color = '<span style="background-color:#00AA00;"">'+grid[(enemyBullet.y*10)+enemyBullet.x].symbol+'</span>';
			      grid[(enemyBullet.y*10)+enemyBullet.x].colorIn(6,9,1);
			    }
			    else if(grid[(enemyBullet.y*10)+enemyBullet.x].character !== null){
			      combat(parent, grid[(enemyBullet.y*10)+enemyBullet.x].character, parent.wield.type, enemyBullet.distance); //on HIT
			    }
			    grid[(enemyBullet.y*10)+enemyBullet.x].projectile = null;
			  }
			  else{
			    grid[(enemyBullet.y*10)+enemyBullet.x].projectile = null;
			    if(direction == 'left'){
			      enemyBullet.x --;
			    }
			    else if(direction == 'up'){
			      enemyBullet.y --;
			    }
			    else if(direction == 'right'){
			      enemyBullet.x ++;
			    }
			    else if(direction == 'down'){
			      enemyBullet.y ++;
			    }
			    grid[(enemyBullet.y*10)+enemyBullet.x].projectile = enemyBullet;
			    enemyBullet.distance ++;

			  }
			}
			fps = 25;
		}
		if(direction == 'left'){
		fire(this.x-1,this.y, this);
		}
		else if(direction == 'up'){
		fire(this.x, this.y-1, this);
		}
		else if(direction == 'right'){
		fire(this.x+1, this.y, this);
		}
		else if(direction == 'down'){
		fire(this.x, this.y+1, this);
		}
	  
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
	          	if(grid[(prevLoc - 1)].character == player && this.inv.length == 0){
			        combat(this,player,"unarmed");
			        return false;
		        }
		        if(grid[(prevLoc - 1)].character == player && this.inv.length > 0){
			        combat(this,player,"melee");
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
		        if(grid[(prevLoc - 10)].character == player && this.inv.length > 0){
			        combat(this,player,"melee");
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
		        if(grid[(prevLoc + 1)].character == player && this.inv.length > 0){
			        combat(this,player,"melee");
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
		        if(grid[(prevLoc + 10)].character == player && this.inv.length > 0){
			        combat(this,player,"melee");
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

	this.findTarget = function(){
		var f = 3;
		var z = 1;
		var x = f+1;
		var y = f+1;
		var currentPos = (this.y*10) + this.x;
		var checkPos = "";
		var stopSearchXR = 0;
		var stopSearchYD = 0;
		var stopSearchXL = 0;
		var stopSearchYU = 0;
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

					if(checkPos.character !== null){
						this.target = checkPos.character;
					}

					checkPos.color = "!";
				}
			};
			for (var i = 0; i < y; i++) {
				//console.log(stopSearchYD + " :^)");
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
					//console.log(stopSearchYD + " :)");
					break;
				}
				if(checkPos.desc !== 'wall' && stopSearchYD == 0){
					//console.log(stopSearchYD + " :)");
					if(checkPos.character !== null){
						this.target = checkPos.character;
					}
					checkPos.color = "<span id = 'combatWound'>?</span>";
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
					if(checkPos.character !== null){
						this.target = checkPos.character;
					}
					checkPos.color = "<span id='combatMiss'>S</span>";	
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
					if(checkPos.character !== null){
						this.target = checkPos.character;
					}
					checkPos.color = "<span id = 'combatBreak'>{</span>";
				}		
			};	
			z++;
		}
		

		updateGraph();
	}

	this.update = function(){
		if(this.alive == false && this.name !== "dead"){
			this.name == "dead";
			corpse = new item(this.x,this.y, "%", 'corpse');
			corpse.color = '<span style="background-color:#A0A0A0";>' +corpse.symbol+ "</span>";
			grid[((this.y*10) + this.x)].character = null;
			if(this.wield !== 0){
				for(y=0;y<this.inv.length;y++){
					if(this.inv[y] = this.wield){
						this.inv.splice(y,1);
					}
				}
				grid[(this.y *10) + this.x].items.push(this.wield);
				this.wield = 0;
			}
			for(f=0;f<this.inv.length;f++){
				grid[(this.y *10) + this.x].items.push(this.inv[f]);
			}
			this.inv = [];
			this.turnBuffer = 0;


		}
		this.stall --;
		this.turnBuffer --;
		if(this.turnBuffer > 0 && this.stall <= 0){
			this.stall = this.turnBuffer;
		}
		if(player.alive == true && this.alive == true && this.stall <= 0){
			
			this.turnBuffer = 15-this.limbs.parts.length;

			this.grasp = 0;
			for(i=0;i<this.limbs.parts.length;i++){
			
				if(this.limbs.parts[i].status == "broken"){
					this.turnBuffer ++;
				}
				if(this.limbs.parts[i].name == "right claw" || this.limbs.parts[i].name == "left claw"){
					this.grasp ++;
				}
			}

			if(this.grasp <= 0){
				//console.log("butter fingers");
				if(this.wield !== 0){
					for(y=0;y<this.inv.length;y++){
						if(this.inv[y] = this.wield){
							this.inv.splice(y,1);
						}
					}
					grid[(this.y *10) + this.x].items.push(this.wield);
					this.wield = 0;
				}
			}

			for(i=0;i<grid[(this.y*10)+this.x].items.length;i++){
				if(grid[(this.y*10)+this.x].items[i].desc == 'weapon' && this.grasp > 0){
					History.innerHTML += this.name + " picked up " + grid[(this.y*10)+this.x].items[i].name + ".<br>";
					this.inv.push(grid[(this.y*10)+this.x].items[i]);
					grid[(this.y*10)+this.x].items.splice(i,1);
					this.turnTaken = 1;
				}
			}
			if(this.wield == 0 && this.inv.length > 0 && this.turnTaken == 0 && this.grasp > 0){
				this.wield = this.inv[this.inv.length - 1];
				this.turnTaken = 1;
				History.innerHTML += this.name + " wielded " + this.wield.name + ".<br>";
			}
			if(this.turnTaken == 1){
				//console.log("took a turn");
				this.turnTaken = 0;
			}

			// else{
			// 	this.findTarget();
			// }

			else if(this.target.x < this.x){
				if(this.checkAvailability('left')){
					this.x --;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc+1].character = null;    
				}
			}
			else if(this.target.y < this.y){
				if(this.checkAvailability('up')){
					this.y --;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc+10].character = null;    
				}
			}
			else if(this.target.x > this.x){
				if(this.checkAvailability('right')){
					this.x ++;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc-1].character = null;    
				}
			}
			else if(this.target.y > this.y){
				if(this.checkAvailability('down')){
					this.y ++;
			        prevLoc = ((this.y*10) + this.x);
			        grid[prevLoc].character = this;
			        grid[prevLoc-10].character = null;    
				}
			}
		}

	}
	this.update();
}

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
		if(player.alive == true && this.alive == true){
			grid[this.x + this.y*10].character = this;
			if(this.findTarget('Dummy') == this.actTarget('Dummy') && this.findTarget('Dummy') !== undefined){
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

		}
		else if(player.alive == false){
		}
	}
	this.update();
}

//robot = new enemy(randomGen(1,7),randomGen(2,9), "Θ",'Robot');
// //robot.findTarget();
// for (var i = 0; i < 5; i++) {
// 	mann = new dummy(randomGen(3,7),randomGen(3,9), "?");
// };
mann = new dummy(9,7, "?");

checkClass(mann);


var weapon = new item(5,2,"/","weapon");
weapon.type = "sharp";
weapon.name = "knife";
weapon.value = 2;
weapon.color = "<span style='background-color:#636B5F';>"+weapon.symbol+"</span>";

var weapon = new item(1,4,"¬","weapon");
weapon.type = "gun";
weapon.name = "laser pistol";
weapon.value = 3;
weapon.damage = 1;
weapon.color = "<span style='background-color:#636B5F';>"+weapon.symbol+"</span>";

var weapon = new item(7,1,"¬","weapon");
weapon.type = "gun";
weapon.name = "minigun";
weapon.value = 3;
weapon.damage = 1;
weapon.color = "<span style='background-color:#999B5F';>"+weapon.symbol+"</span>";

update();