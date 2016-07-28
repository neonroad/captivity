player.Class = 'Demo';

talk = function(talker, mood, text){
	History.innerHTML += "<img src = 'assets/chars/demo/"+ mood + ".png' id='talk'><span id='talkText'><strong>" + talker.name + ":</strong>" + text + "</span><br>";
}


moveReticle = function(direction){
	if(direction == 'left' && grid[crosshair.x + crosshair.y*10 -1] !== undefined){
		grid[crosshair.x + crosshair.y*10].ui = null;
		crosshair.x --;
		grid[crosshair.x + crosshair.y*10].ui = crosshair;
		crosshair.update();
		aimAbility.update();
		updateGraph();
	}
	if(direction == 'right' && grid[crosshair.x + crosshair.y*10 +1] !== undefined){
		grid[crosshair.x + crosshair.y*10].ui = null;
		crosshair.x ++;
		grid[crosshair.x + crosshair.y*10].ui = crosshair;
		crosshair.update();
		aimAbility.update();
		updateGraph();
	}
	if(direction == 'down' && grid[crosshair.x + crosshair.y*10 +10] !== undefined){
		grid[crosshair.x + crosshair.y*10].ui = null;
		crosshair.y ++;
		grid[crosshair.x + crosshair.y*10].ui = crosshair;
		crosshair.update();
		aimAbility.update();
		updateGraph();
	}
	if(direction == 'up' && grid[crosshair.x + crosshair.y*10 -10] !== undefined){
		grid[crosshair.x + crosshair.y*10].ui = null;
		crosshair.y --;
		grid[crosshair.x + crosshair.y*10].ui = crosshair;
		crosshair.update();
		aimAbility.update();
		updateGraph();
	}
}

aimAbility = function(range, location, type){
	player.aiming = 1;
	crosshair = new UI(location.x, location.y, '+', "#FFFFFF");
	var availableSpace = [];
	aimAbility.update = function(){
		var f = range;
		var z = 1;
		var x = f+1;
		var y = f+1;
		var currentPos = (location.y*10) + location.x;
		var checkPos = "";
		var stopSearchXR = 0;
		var stopSearchYD = 0;
		var stopSearchXL = 0;
		var stopSearchYU = 0;
		availableSpace.push(grid[(location.y*10) + location.x]);
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
				if(((checkPos.y*10 + checkPos.x))%10 == 0){
					//console.log("Max grid reached! (XR)");
					stopSearchXR = 1;
					break;
				}
				if(checkPos.ui !== crosshair){
					rangeIndicator = new UI(checkPos.x, checkPos.y, checkPos.symbol, '#58C8ED');
					checkPos.UI = rangeIndicator;
					checkPos.UI.indicatorUpdate();
					availableSpace.push(checkPos);					
				}

			};
			for (var i = 0; i < y; i++) {
				if(stopSearchYD == 1){
					stopSearchYD = 0;
				}
				else if(stopSearchYD == 2){
					break;
				}
				checkPos = grid[currentPos + z + (i*10)];
				if(checkPos == undefined){
					stopSearchYD += 1;
					break;
				}
				//console.log(checkPos.x + checkPos.y*10);
				if(((checkPos.y*10 + checkPos.x))%10 == 0){
					console.log("Max grid reached! (YD)");
					stopSearchYD = 2;
					break;
				}
				if(checkPos.ui !== crosshair){
					rangeIndicator = new UI(checkPos.x, checkPos.y, checkPos.symbol, '#58C8ED');
					checkPos.UI = rangeIndicator;
					checkPos.UI.indicatorUpdate();
					availableSpace.push(checkPos);					
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
				if(((checkPos.y*10 + checkPos.x)+1)%10 == 0){
					//console.log("Max grid reached! (XL)");
					stopSearchXL = 1;
					break;
				}
				if(checkPos.ui !== crosshair){
					rangeIndicator = new UI(checkPos.x, checkPos.y, checkPos.symbol, '#58C8ED');
					checkPos.UI = rangeIndicator;
					checkPos.UI.indicatorUpdate();
					availableSpace.push(checkPos);					
				}
			};
			for (var i = 0; i < y; i++) {
				if(stopSearchYU == 1){
					stopSearchYU = 0;
				}
				else if(stopSearchYU == 2){
					break;
				}
				checkPos = grid[currentPos - z - (i*10)];
				if(checkPos == undefined){
					stopSearchYU += 1;
					break;
				}
				if((checkPos.y*10 + checkPos.x +1)%10 == 0){
					//console.log("Max grid reached! (YU)");
					stopSearchYU = 2;
					break;
				}		
				if(checkPos.ui !== crosshair){
					rangeIndicator = new UI(checkPos.x, checkPos.y, checkPos.symbol, '#58C8ED');
					checkPos.UI = rangeIndicator;
					checkPos.UI.indicatorUpdate();
					availableSpace.push(checkPos);					
				}
			};	
			z++;
		}		
	}
	aimAbility.update();

	crosshair.update = function(){
		crosshair.invalid = 1;
		for(a = 0; a< availableSpace.length; a++){
			if(grid[crosshair.x + crosshair.y*10] == availableSpace[a] && ((grid[crosshair.x + crosshair.y*10].character !== null && grid[crosshair.x + crosshair.y*10].character !== location) || grid[crosshair.x+crosshair.y*10].units.length !== 0 ) && type == 'targetNoTrail'){
				crosshair.invalid = 0;
				break;
			}
			else if(grid[crosshair.x + crosshair.y*10] == availableSpace[a] && !(grid[crosshair.x + crosshair.y*10].desc !== 'floor') && type == 'spawnUnit'){
				crosshair.invalid = 0;
				break;
			}
		}
		if(crosshair.invalid == 1){
			crosshair.color = '<span style="background-color:#AA0000;">X</span>';
		}
		else{
			crosshair.color = '<span style="background-color:#FFFFFF;">+</span>';
		}
	}
	crosshair.update();
	
	updateGraph();
}

aimAbility.cancel = function(){
	for (var i = 0; i < grid.length; i++) {
		grid[i].ui = null;
	};
	crosshair = null;
	availableSpace = [];
	player.aiming = 0;
	updateGraph();
}

pirateClass = function(){
	pirateClass.ability1 = function(){
		parrrley = new spell('Parrrley');
		parrrley.cooldownElement = cooldown1;
		parrrley.aim = function(user){
			aimAbility(2, user, 'targetNoTrail');
		}
		parrrley.fire = function(user){
			crosshair.update();
			if(crosshair.invalid == 0 && grid[crosshair.x+crosshair.y*10].character !== player){
				var parrrleyBullet = new projectile(crosshair.x, crosshair.y, user, '#5E3E1C', 'parrley bullet');
				parrrleyBullet.checkContact(user);
				aimAbility.cancel();
				parrrley.cooldown = 4;
				update();
			}
		}
		abilities.push(parrrley);		
	}
	pirateClass.ability2 = function(){
		removeScurry = new spell('Remove Scurry');
		removeScurry.cooldownElement = cooldown2;
		removeScurry.fire = function(user){
			for (var i = 0; i < user.limbs.parts.length; i++) {
				user.limbs.parts[i].status = 'healthy';
			};
			History.innerHTML += user.name + " feels great! Yarr!<br>";
			removeScurry.cooldown = 8;
			update();
		}
		abilities.push(removeScurry);
	}
	pirateClass.ability3 = function(){
		powderKeg = new spell('Powder Keg');
		powderKeg.cooldownElement = cooldown3;
		powderKeg.aim = function(user){
			aimAbility(1,user,'spawnUnit');
		}	
		powderKeg.fire = function(user){
			crosshair.update();
			if(crosshair.invalid == 0){
				var barrel = new unit(crosshair.x, crosshair.y, "¢", "#B3733B", "Barrel", user);
				barrel.update();
				makeExplosion = function(place){
					explosion = new zone(place.x, place.y, 'barrel explosion', barrel.owner);
					explosion.update = function(){
						this.location = grid[this.x+this.y*10];
						if(this.location.character !== null && this.location.character !== this.owner){
							combat(this.owner, this.location.character, 'unarmed');
						}

						for (var i = 0; i < this.location.units.length; i++) {
							if(this.location.units[i].desc == 'Barrel' && this.location.units[i].owner == this.owner){
								this.location.units[i].checkContact(this);

							}
							else{
								console.log(this.owner.name);
								console.log("Not owner?");
							}
						};
						// checkList(this.location.zones, this);
						// checkList(zones, this);
					}
					explosion.clear = function(){
						checkList(grid[explosion.x+explosion.y*10].zones, this);
						checkList(zones, explosion);
					}
					explosion.update();
					explosion.clear();
				}
				barrel.checkContact = function(projectile){
					grid[barrel.x + barrel.y*10].units.splice(barrel,1);
					if(projectile.owner == barrel.owner && (projectile.desc == 'parrley bullet' || projectile.desc == 'barrel explosion')){
						History.innerHTML += barrel.owner.name + " blows up their powder keg!<br>";

						makeExplosion(grid[this.x+this.y*10]);
						var f = 1;
						var z = 1;
						var x = f+1;
						var y = f+1;
						var currentPos = (barrel.y*10) + barrel.x;
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
								if(((checkPos.y*10 + checkPos.x))%10 == 0){
									//console.log("Max grid reached! (XR)");
									stopSearchXR = 1;
									break;
								}		
								makeExplosion(checkPos);				
							};
							for (var i = 0; i < y; i++) {
								if(stopSearchYD == 1){
									stopSearchYD = 0;
								}
								else if(stopSearchYD == 2){
									break;
								}
								checkPos = grid[currentPos + z + (i*10)];
								if(checkPos == undefined){
									stopSearchYD += 1;
									break;
								}
								//console.log(checkPos.x + checkPos.y*10);
								if(((checkPos.y*10 + checkPos.x))%10 == 0){
									//console.log("Max grid reached! (YD)");
									stopSearchYD = 2;
									break;
								}
								makeExplosion(checkPos);
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
								if(((checkPos.y*10 + checkPos.x)+1)%10 == 0){
									//console.log("Max grid reached! (XL)");
									stopSearchXL = 1;
									break;
								}			
								makeExplosion(checkPos);			
							};
							for (var i = 0; i < y; i++) {
								if(stopSearchYU == 1){
									stopSearchYU = 0;
								}
								else if(stopSearchYU == 2){
									break;
								}
								checkPos = grid[currentPos - z - (i*10)];

								if(checkPos == undefined){
									stopSearchYU += 1;
									break;
								}
								if((checkPos.y*10 + checkPos.x +1)%10 == 0){
									//console.log("Max grid reached! (YU)");
									stopSearchYU = 2;
									break;
								}		
								makeExplosion(checkPos);				
							};	
							z++;
						}	
						//grid[barrel.x + barrel.y*10].units.splice(barrel,1);
						//updateGraph();						
					}
					else{
						History.innerHTML += projectile.owner.name + " defused " + barrel.owner.name + "'s powder keg!<br>";
						console.log(projectile.desc);
						//grid[barrel.x + barrel.y*10].units.splice(barrel,1);
						updateGraph();
					}
					checkList(units,barrel);
				}
			}
			update();
		}
	}

	pirateClass.ability1();
	pirateClass.ability2();
	pirateClass.ability3();
}
pirateClass();

demoClass = function(unit){
	unit.hp = 100;
	unit.hpMax = 100;
	unit.pd = 5;
	unit.md = 0;
	unit.ac = 2;
	unit.mr = 2;

	demoClass.ability1 = function(){
		alpha = new spell('Alpha');
		if(unit == player){
			alpha.cooldownElement = cooldown1;
		}
		alpha.fire = function(){
			unit.hp = unit.hpMax;
			alpha.cooldown = 3;
			History.innerHTML += unit.name + " used Alpha to increase hp to " + unit.hpMax + ".<br>";
			History.legible ++;
			if(doRandom(1,5)){
				switch(randomGen(1,5)){
					case 1:
						talk(unit,'normal', 'My life extends.');
						break;
					case 2:
						talk(unit,'normal', 'Alpha!');
						break;
					case 3:
						talk(unit,'normal', 'Max health increased.');
						break;
					case 4:
						talk(unit, 'normal', 'Stronger I am!');
						break;
				}
			}

			update();
		}
		alpha.aim = function(){
			alpha.fire();
		}
		abilities.push(alpha);

	}
	demoClass.ability1();
	unit.ability1 = alpha;
}