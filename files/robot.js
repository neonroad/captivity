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
	this.skills = new Object;
	this.generateSkills = function(){
		this.unarmed = new skill('unarmed',1,1);
		this.dodging = new skill('dodging',1,1);
		this.melee = new skill('melee',1,1);
	}
	this.generateSkills();

	this.bleed = function(source, level){
	  	grid[((source.y * 10) + source.x)].colorIn(3,9,0);
		blood = new particle(source.x,source.y, '░','#E1F74F');
		blood.step = 0;
		blood.direction = randomGen(1,9)
		blood.parent = source;
		blood.update = function(){
			this.step ++;
			if(this.step < randomGen(1,10) && grid[(this.y * 10) + this.x].desc !== 'wall'){
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
			console.log('Gibbed ' + part.name);
			this.bleed(giblet);
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
		//this.target = this;
		/**for(r=0;r<this.sight*this.sight;r++){//range of sight?
			for(d=0;d<this.sight;d++){
				if(grid[(this.y*10)+this.x-d].character !== null && grid[(this.y*10)+this.x-d].character.desc !== "Robot"){
					this.target = grid[(this.y*10)+this.x-d].character;
				}
				else if(grid[(this.y*10)+this.x-d].items.length !== 0 && grid[(this.y*10)+this.x-d].items[grid[(this.y*10)+this.x-d].items.length-1].desc == "weapon"){
					this.target = grid[(this.y*10)+this.x-d].items[grid[(this.y*10)+this.x-d].items.length - 1];
				}

			}
		}**/
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

var robot = new enemy(1,5, "Θ",'Robot');

var weapon = new item(5,2,"/","weapon");
weapon.type = "sharp";
weapon.name = "knife";
weapon.value = 2;
weapon.color = "<span style='background-color:#636B5F';>"+weapon.symbol+"</span>";

var weapon = new item(7,2,"¬","weapon");
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