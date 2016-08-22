checkClass = function(target){
	console.log('CHECKING CLASS FOR ' + target.name);
	console.log(target.name + " Level: " + target.level);
	switch(target.Class){
		case undefined:
			target.Class = prompt('No class found. Make class?');
			break;

		case 'Doom':
			console.log('Class: Doom');
			break;
		case 'Pirate':
			console.log('Class: Pirate');
			ability1.src = 'http://vignette3.wikia.nocookie.net/leagueoflegends/images/e/e3/Parrrley.png/revision/latest?cb=20150707190028&format=webp';
			ability2.src = 'http://vignette2.wikia.nocookie.net/leagueoflegends/images/9/9c/Remove_Scurvy.png/revision/latest?cb=20150707190028&format=webp';
			player.ability1 = parrrley;
			player.ability2 = removeScurry;
			player.ability3 = powderKeg;
			break;
		case 'Demo':
			console.log('Class: Demo');
			if(target == player){
				ability1.src = "assets/chars/demo/ability1.png";
				ability2.src = "";				
			}
			demoClass(target);
			target.classUpdate = function(reason){
				if(target.classUpdate.cooldown == undefined){
					target.classUpdate.cooldown = 0;
				}
				else if(target.classUpdate.cooldown > 0){
					target.classUpdate.cooldown --;
				}
				if(doRandom(1,101) && target.alive == true && target == player){
					History.legible ++;
					update(true);
					switch(randomGen(1,3)){
						case 1:
							talk(target, 'normal', 'I move.');
							break;
						case 2:
							talk(target, 'normal', 'This place bothers me.');
							break;
					}
				}
				else if(target.alive == false){
					if(target.killer.Class == target.Class){
						talk(target, 'panic', 'I-Impossible..!');
					}
					else{
						talk(target, 'panic', 'N...No..!');
					}
				}

				//Specific Reasons
				if(reason == 'kill'){
					var latestKill = target.kills[target.kills.length-1];
					if(latestKill.Class == target.Class){
						switch(randomGen(1,2)){
							case 1:
								talk(target, 'happy', 'Bwahaha! I am the superior one here, ' + latestKill.name + "!");
								break;
						}
					}
				}

				//CC'd
				if(target.mobility == false && doRandom(1,5)){
					switch(randomGen(1,3)){
						case 1:
							talk(target, 'panic', "Hnng! I can't... move..!");
							break;
						case 2:
							talk(target, 'panic', "My limbs fail me!");
							break;
					}					
				}

				//AI?
				if(target.target !== undefined){
					if(target.target.Class == target.Class && target.classUpdate.cooldown == 0){
						History.legible ++;
						update(true);
						switch(randomGen(1,5)){
							case 1:
								talk(target, 'normal', 'Though we are the same, only one of us will persih, ' + target.target.name + '.');
								break;
							case 2:
								talk(target, 'normal', 'I fear no mirror image.');
								break;
							case 3:
								talk(target, 'normal', 'I see past your tricks, ' + target.target.name + '.');
								break;
							case 4:
								talk(target, 'normal', 'Your end draws near, ' + target.target.name + '.');
								break;
						}
						target.classUpdate.cooldown = 60;
					}
				}
			}
			break;
		case 'Cowgal':
			console.log('Class: Cowgal');
			if(target == player){
				ability1.src = "assets/chars/cowgal/ability1.png";
				ability2.src = "assets/chars/cowgal/ability2.png";	
				ability3.src = "assets/chars/cowgal/ability3.png";	
				ability4.src = "assets/chars/cowgal/ability4.png";		
			}
			cowgalClass(target);
			target.classUpdate = function(reason){

			}
	}
}


checkClass(player);