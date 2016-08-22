player.Class = 'Cowgal';



talk = function(talker, mood, text){
	// History.legible ++;
	// update(true);
	History.innerHTML += "<img src = 'assets/chars/"+ talker.Class + "/"+ mood + ".png' id='talk'><span id='talkText'><strong>" + talker.name + ":</strong>" + text + "</span><br>";
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
			else if(grid[crosshair.x + crosshair.y*10] == availableSpace[a] && !(grid[crosshair.x + crosshair.y*10].desc !== 'floor') && type == 'direction'){
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

function checkDir(unit){
	var direction = grid[crosshair.x + crosshair.y*10];
	if(direction.x == unit.x && direction.y == unit.y + 1){
		direction = 'down';
	}
	else if(direction.x == unit.x && direction.y == unit.y - 1){
		direction = 'up';
		
	}
	else if(direction.x == unit.x +1 && direction.y == unit.y){
		direction = 'right';
		
	}
	else if(direction.x == unit.x -1 && direction.y == unit.y){
		direction = 'left';
		
	}
	else if(direction.x == unit.x -1 && direction.y == unit.y-1){
		direction = 'upleft';
		
	}
	else if(direction.x == unit.x -1 && direction.y == unit.y+1){
		direction = 'downleft';
		
	}
	else if(direction.x == unit.x +1 && direction.y == unit.y-1){
		direction = 'upright';
		
	}
	else if(direction.x == unit.x +1 && direction.y == unit.y+1){
		direction = 'downright';
		
	}
	return direction;
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

demoClass = function(unit){
	unit.hp = 100;
	unit.hpMax = 100;
	unit.pd = 544;
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

cowgalClass = function(unit){
	unit.hp = 50;
	unit.hpMax = 50;
	unit.pd = 15;
	unit.md = 0;
	unit.ac = 1;
	unit.mr = 0;	

	cowgalClass.ability1 = function(){
		sharpshot = new spell('Sharpshot');
		if(unit == player){
			sharpshot.cooldownElement = cooldown1;
		}
		sharpshot.fire = function(){
			crosshair.update();
			if(crosshair.invalid == 0){
				var dir = checkDir(unit);
				var sharpshotBullet = new projectile(crosshair.x, crosshair.y, unit, '#7A794D', 'sharpshot bullet');
				sharpshotBullet.step = 2;
				sharpshotBullet.direction = dir;
				sharpshotBullet.bounce = 5;

				sharpshotBullet.ricochet = function(){
					sharpshotBullet.exists = 1;
					while(sharpshotBullet.exists == 1){
						sharpshotBullet.step ++;	
						checkList(grid[sharpshotBullet.x + sharpshotBullet.y*10].projectiles, sharpshotBullet);
						switch(dir){
							case 'downright':
								sharpshotBullet.x ++;
								sharpshotBullet.y ++;
								break; 
							case 'downleft':
								sharpshotBullet.x --;
								sharpshotBullet.y ++;
								break;
							case 'upleft':
								sharpshotBullet.x --;
								sharpshotBullet.y --;
								break;
							case 'upright':
								sharpshotBullet.x ++;
								sharpshotBullet.y --;
								break;	
						}
						sharpshotBullet.checkContact(true);				
					}
				}

				sharpshotBullet.checkContact = function(ricochet){
					if(grid[sharpshotBullet.x + sharpshotBullet.y*10] == undefined){
						sharpshotBullet.exists = 0;
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10].desc !== 'wall' && ricochet == false){
						var dust = new particle(sharpshotBullet.x,sharpshotBullet.y, '.', '#DDDDDD', unit);
						dust.step = sharpshotBullet.step;
						dust.update = function(){
							dust.step --;
							if(dust.step == 1){
								dust.color = '<span style="background-color:#FAF5ED;"">.</span>';
							}
							if(dust.step <= 0){
								dust.removeParticle();
							}
						}
						particles.push(dust);
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10].desc == 'wall'){
						sharpshotBullet.exists = 0;
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10] !== undefined){
						if(grid[sharpshotBullet.x + sharpshotBullet.y*10].character !== unit && grid[sharpshotBullet.x + sharpshotBullet.y*10].character !== null){
							sharpshotBullet.exists = 0;
							sharpshotBullet.pd = sharpshotBullet.step + unit.pd/2;
							if(ricochet == true){
								sharpshotBullet.pd *= 2;
								talk(unit, 'happy', "This one is gonna hurt.");
							}
							combat(sharpshotBullet, grid[sharpshotBullet.x + sharpshotBullet.y*10].character, 'ability');
						}
					}

					var makeParticle = function(){
						var dust = new particle(sharpshotBullet.x,sharpshotBullet.y, 'X', '#CCA870', unit);
						dust.step = sharpshotBullet.step;
						dust.update = function(){
							dust.step --;
							if(dust.step == 1){
								dust.color = '<span style="background-color:#DEB97E;"">x</span>';
							}
							if(dust.step <= 0){
								dust.removeParticle();
							}
						}
						particles.push(dust);							
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 -9].desc == 'wall' && (dir == 'upright') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();				
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 -11].desc == 'wall' && (dir == 'upleft') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();				
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 +11].desc == 'wall' && (dir == 'downright') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();				
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 +9].desc == 'wall' && (dir == 'downleft') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();				
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 + 1].desc == 'wall' && (dir == 'downright' || dir == 'upright') && sharpshotBullet.bounce > 0  && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						sharpshotBullet.bounce --;
						switch(dir){
							case 'upright':
								dir = 'upleft';
								break;
							case 'downright':
								dir = 'downleft';
								break;
						}
						makeParticle();						
						sharpshotBullet.ricochet();
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 + 10].desc == 'wall' && (dir == 'downright' || dir == 'downleft') && sharpshotBullet.bounce > 0 && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						sharpshotBullet.bounce --;
						switch(dir){
							case 'downright':
								dir = 'upright';
								break;
							case 'downleft':
								dir = 'upleft';
								break;
						}
						makeParticle();
						sharpshotBullet.ricochet();
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 -1 ].desc == 'wall' && (dir == 'upleft' || dir == 'downleft') && sharpshotBullet.bounce > 0 && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						sharpshotBullet.bounce --;
						switch(dir){
							case 'downleft':
								dir = 'downright';
								break;
							case 'upleft':
								dir = 'upright';
								break;
						}
						makeParticle();
						sharpshotBullet.ricochet();
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 -10 ].desc == 'wall' && (dir == 'upleft' || dir == 'upright') && sharpshotBullet.bounce > 0 && sharpshotBullet.exists == 1){
						//History.innerHTML += sharpshotBullet;
						sharpshotBullet.exists = 0;
						sharpshotBullet.bounce --;
						switch(dir){
							case 'upleft':
								dir = 'downleft';
								break;
							case 'upright':
								dir = 'downright';
								break;
						}
						makeParticle();
						sharpshotBullet.ricochet();
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 -10 ].desc == 'wall' && (dir == 'up') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 +10 ].desc == 'wall' && (dir == 'down') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 -1 ].desc == 'wall' && (dir == 'left') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();
					}

					if(grid[sharpshotBullet.x + sharpshotBullet.y*10 + 1 ].desc == 'wall' && (dir == 'right') && sharpshotBullet.exists == 1){
						sharpshotBullet.exists = 0;
						makeParticle();
					}

					else if(grid[sharpshotBullet.x + sharpshotBullet.y*10].desc == 'wall' && ricochet == true){
						sharpshotBullet.exists = 0;
					}

					else if(grid[sharpshotBullet.x + sharpshotBullet.y*10].desc !== 'wall' && ricochet == true){
						var dust2 = new particle(sharpshotBullet.x,sharpshotBullet.y, '.', '#E8CEA5', unit);
						dust2.step = sharpshotBullet.step;
						dust2.update = function(){
							dust2.step --;
							if(dust2.step == 1){
								dust2.color = '<span style="background-color:#D9B06F;"">.</span>';
							}
							if(dust2.step <= 0){
								dust2.removeParticle();
							}
						}
						particles.push(dust2);
					}


					// else if(ricochet == true){
					// 	dust = new particle(sharpshotBullet.x,sharpshotBullet.y, 'x', '#A86A3E', unit);
					// 	dust.update = function(){
					// 		dust.removeParticle();
					// 	}
					// }
				}

				sharpshotBullet.travel = function(){
					while(sharpshotBullet.exists == 1){
						sharpshotBullet.checkContact(false);
						sharpshotBullet.step ++;
						checkList(grid[sharpshotBullet.x + sharpshotBullet.y*10].projectiles, sharpshotBullet);
						switch(dir){
							case 'left':
								sharpshotBullet.x --;
								break;
							case 'down':
								sharpshotBullet.y ++;
								break;		
							case 'right':
								sharpshotBullet.x ++;
								break;		
							case 'up':
								sharpshotBullet.y --;
								break;	
							case 'downleft':
								sharpshotBullet.x --;
								sharpshotBullet.y ++;
								break;	
							case 'downright':
								sharpshotBullet.x ++;
								sharpshotBullet.y ++;
								break;
							case 'upright':
								sharpshotBullet.x ++;
								sharpshotBullet.y --;
								break;
							case 'upleft':
								sharpshotBullet.x --;
								sharpshotBullet.y --;
								break;									
						}						
					}
				}
				sharpshotBullet.travel();
				sharpshot.cooldown = 3;
				update();
			}			
		}
		sharpshot.aim = function(){
			aimAbility(1,unit, 'direction');
		}
		abilities.push(sharpshot);
	}
	cowgalClass.ability2 = function(){
		pocketSand = new spell('Pocket Sand');
		if(unit == player){
			pocketSand.cooldownElement = cooldown2;
		}
		pocketSand.fire = function(){
			crosshair.update();
			if(grid[crosshair.x + crosshair.y*10].character !== null && crosshair.invalid == false){
				
				pocketSandStun = new buff(false, 'Pocket Sand Stunned!', 5);
				pocketSandStun.desc = "Unit is stunned and cannot perform actions while sand irritates their eyes.";
				pocketSandStun.purify = function(){
					pocketSandStun.unit.mobility = true;
				}

				grid[crosshair.x + crosshair.y*10].character.buffs.push(pocketSandStun);
				pocketSand.cooldown = 15;
				History.legible ++;
				update(true);
				History.innerHTML += unit.name + " tosses pocket sand into " + grid[crosshair.x + crosshair.y*10].character.name + "'s eyes!<br>";

				switch(randomGen(1,5)){
					case 1:
						talk(unit,'happy', 'Pocket sand!');
						break;
					case 2:
						talk(unit,'happy', 'Sand in your eye!');
						break;
					case 3:
						talk(unit,'happy', 'Does this look grainy to you?');
						break;
					case 4:
						talk(unit, 'happy', 'Sha-sha-sha!');
						break;
				}
				
			}

		}
		pocketSand.aim = function(){
			aimAbility(1,unit,'targetNoTrail');
		}
		abilities.push(pocketSand);
	}
	cowgalClass.ability3 = function(){
		dodgeRoll = new spell('Dodge Roll');
		if(unit == player){
			dodgeRoll.cooldownElement = cooldown3;
		}
		dodgeRoll.fire = function(){
			if(crosshair.invalid == false){
				var dir = checkDir(unit);
				var currentPos = grid[unit.x + unit.y*10];
				console.log(dir);

				roll = function(){
					switch(dir){
						case 'up':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 - 10].desc !== 'wall'){
								unit.y --;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc+10].character = null;
							}
							break;
						case 'down':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 + 10].desc !== 'wall'){
								unit.y ++;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc-10].character = null;
							}
							break;
						case 'right':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 + 1].desc !== 'wall'){
								unit.x ++;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc-1].character = null;
							}
							break;
						case 'left':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 - 1].desc !== 'wall'){
								unit.x --;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc+1].character = null;
							}
							break;
						case 'upright':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 - 9].desc !== 'wall'){
								unit.x ++;
								unit.y --;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc+9].character = null;
							}
							break;
						case 'downright':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 + 11].desc !== 'wall'){
								unit.x ++;
								unit.y ++;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc-11].character = null;
							}
							break;
						case 'downleft':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 + 9].desc !== 'wall'){
								unit.x --;
								unit.y ++;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc-9].character = null;
							}
							break;
						case 'upleft':
							if(currentPos - 10 !== undefined && grid[unit.x + unit.y*10 - 11].desc !== 'wall'){
								unit.x --;
								unit.y --;
								prevLoc = ((unit.y*10) + unit.x);
								grid[prevLoc].character = player;
								grid[prevLoc+11].character = null;
							}
							break;
					}	
					update();
				}

				rollDodgeImmune = new buff(true, 'Roll Dodge!', 2);
				rollDodgeImmune.desc = "Unit is immune to EVERYTHING as the roll persists.";
				rollDodgeImmune.purify = function(){
					unit.immuneToCombat = 0;
					unit.immuneToDamage = 0;
					unit.immuneToCC = 0;
					unit.immuneToTarget = 0;
				}
				unit.buffs.push(rollDodgeImmune);

				roll();

				var dust = new particle(unit.x,unit.y, '*', '#DDDDDD', unit);
				dust.step = 2;
				dust.update = function(){
					dust.step --;
					if(dust.step <= 0){
						dust.removeParticle();
					}
				}
				particles.push(dust);

				roll();
				
				dodgeRoll.cooldown = 15;

			}

		}
		dodgeRoll.aim = function(){
			aimAbility(1,unit,'direction');
		}
		abilities.push(dodgeRoll);
	}
	cowgalClass.ability4 = function(){
		quickDraw = new spell('Quick Draw');
		if(unit == player){
			quickDraw.cooldownElement = cooldown4;
		}
		quickDraw.fire = function(){
			quickDraw.cooldown = 30;
			if(entities.length == 1){
				switch(randomGen(1,10)){
					case 1:
						talk(unit,'mad', "It's just you and me...");
						break;
					case 2:
						talk(unit,'mad', "It comes down to this, " + entities[0].name + "...");
						break;
					case 3:
						talk(unit,'mad', "What a shame...");
						break;
					case 4:
						talk(unit,'mad',"Only one of us is leaving alive...");
						break;
					case 5:
						talk(unit, 'mad', "On your mark...");
						break;
					case 6:
						talk(unit, 'mad', "...");
						break;
					case 7:
						talk(unit, 'mad', "Say your prayers...");
						break;
					case 8:
						talk(unit, 'mad', "Get ready...");
						break;
					case 9:
						talk(unit, 'happy', "DRAW!");
						break;
				}
			}
			else{
				switch(randomGen(1,10)){
					case 1:
						talk(unit,'mad',"One woman, in a world of foes...");
						break;
					case 2:
						talk(unit,'mad',"Try and hide, if you can...");
						break;
					case 3:
						talk(unit,'mad',"Time to get to work...");
						break;
					case 4:
						talk(unit,'mad',"Show me what you got...");
						break;
					case 5:
						talk(unit,'mad',"Hope your heads are worth something...");
						break;
					case 6:
						talk(unit,'mad', "End of the line...");
						break;
					case 7:
						talk(unit,'mad', "You're severely outnumbered...");
						break;
					case 8:
						talk(unit,'mad', "You're gonna need more bad guys...");
						break;
					case 9:
						talk(unit,'mad', "Let's settle this...");
						break;
				}
			}

			var currentEntities = entities.length;
			var num = 0;
			for (var i = 0; i < entities.length; i++) {
				num ++;
				var quickDrawBullet = new projectile(unit.x, unit.y, unit, "#AAAAAA", "Quickdraw bullet");
				quickDrawBullet.checkContact = function(){
					quickDrawBullet.pd = unit.pd*2;
					var tag = grid[quickDrawBullet.x + quickDrawBullet.y * 10].character;
					combat(quickDrawBullet, grid[quickDrawBullet.x + quickDrawBullet.y * 10].character, 'ability');
					quickDrawBullet.exists = 0;
					if(tag.alive == false){
						switch(randomGen(1,10)){
							case 1:
								talk(unit, 'happy', 'Gotcha!');
								break;
							case 2:
								talk(unit, 'happy', 'Easiest one yet!');
								break;
							case 3:
								talk(unit, 'happy', 'Happy to be of service!');
								break;
							case 4:
								talk(unit, 'happy', 'I still got it!');
								break;
							case 5:
								talk(unit, 'happy', 'Enjoy your new grave!');
								break;
							case 6:
								talk(unit, 'happy', "Now that's some fine shooting!");
								break;
							case 7:
								talk(unit, 'normal', "Think about what you've done.");
								break;
							case 8:
								talk(unit, 'normal', "That's enough out of you.");
								break;
							case 9:
								talk(unit, 'happy', "Bullseye!");
								break;
						}
						unit.ability1.cooldown = 0;
						unit.ability2.cooldown = 0;
						unit.ability3.cooldown = 0;
						unit.ability4.cooldown = 0;
					}
				}
				while(quickDrawBullet.exists == 1){
					checkList(grid[quickDrawBullet.x+quickDrawBullet.y*10].projectiles, quickDrawBullet)
					if(grid[quickDrawBullet.x + quickDrawBullet.y * 10].desc == 'wall'){
						quickDrawBullet.exists = 0;
					}
					else if(grid[quickDrawBullet.x + quickDrawBullet.y * 10].character !== unit && grid[quickDrawBullet.x + quickDrawBullet.y * 10].character !== null ){
						quickDrawBullet.checkContact();
					}
					else{
						makeParticle(quickDrawBullet,'.',"#AA65B8",num + entities.length);
						if(entities[i].x > quickDrawBullet.x){
							quickDrawBullet.x ++;
						}
						if(entities[i].x < quickDrawBullet.x){
							quickDrawBullet.x --;
						}
						if(entities[i].y > quickDrawBullet.y){
							quickDrawBullet.y ++;
						}
						if(entities[i].y < quickDrawBullet.y){
							quickDrawBullet.y --;
						}
					}

				}
				if(entities.length !== currentEntities){
					i --;
					currentEntities = entities.length;
				}
			};
			update();

		}
		quickDraw.aim = function(){
			if(entities.length > 0){
				quickDraw.fire();
			}
		}
		abilities.push(quickDraw);
	}
	cowgalClass.ability1();
	cowgalClass.ability2();
	cowgalClass.ability3();
	cowgalClass.ability4();
	unit.ability1 = sharpshot;
	unit.ability2 = pocketSand;
	unit.ability3 = dodgeRoll;
	unit.ability4 = quickDraw;
}