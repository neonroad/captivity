combat = function(fighter, defender,style){
	//UNARMED COMBAT
	if(style == "unarmed"){
		chance = Math.floor((((fighter.unarmed.level / defender.dodging.level) * (0.5)* Math.random()) * 100))
		//History.innerHTML += chance + "<br>";

		//reduce with injuries
		for(i=0;i<fighter.limbs.parts.length;i++){
			if(fighter.limbs.parts[i].name == "right eye"){
				if(fighter.limbs.parts[i].status == "bruised"){
					chance*=0.75;
				}
				else if(fighter.limbs.parts[i].status == "wounded"){
					chance *=0.5;
				}
				else if(fighter.limbs.parts[i].status == "broken"){
					chance *= 0.25;
					//console.log(chance);
				}
			}
			else if(fighter.limbs.parts[i].name == "left eye"){
				if(fighter.limbs.parts[i].status == "bruised"){
					chance*=0.75;
				}
				else if(fighter.limbs.parts[i].status == "wounded"){
					chance *=0.5;
				}
				else if(fighter.limbs.parts[i].status == "broken"){
					chance *= 0.25;
					//console.log(chance);
				}
			}
		}

		determineChance = randomGen(0,100);

		preference = []; //part to hit with
		hitChance = randomGen(0,defender.limbs.parts.length);
		for(b=0;b<fighter.limbs.parts.length;b++){ //what the fighter will hit WITH
			if(fighter.limbs.parts[b].name == 'left claw' || fighter.limbs.parts[b].name == 'left foot' || fighter.limbs.parts[b].name == 'right claw' || fighter.limbs.parts[b].name == 'right foot' || fighter.limbs.parts[b].name == 'right hand' || fighter.limbs.parts[b].name == 'left hand'){
				if(fighter.limbs.parts[b].status !== 'broken'){
					preference.push(fighter.limbs.parts[b]);
				}
			}
		}
		if(preference.length == 0){
			return false;
		}
		//console.log(preference);
		hittingPart = randomGen(0, preference.length);
		//console.log(hittingPart);
		hittingPart = preference[hittingPart];
		
		hurtPart = defender.limbs.parts[hitChance]; //what the fighter will HIT


		if(determineChance <= chance && hurtPart.status == "healthy"){
			fighter.unarmed.currentxp += chance/100;
			fighter.unarmed.level = calcXP(fighter.unarmed.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combat'>" + fighter.name + " bruised " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ".</span> <br>";
			hurtPart.status = "bruised";	
		}
		else if(determineChance <= chance && hurtPart.status == "bruised"){
			fighter.unarmed.currentxp += chance/50;
			fighter.unarmed.level = calcXP(fighter.unarmed.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatWound'>" + fighter.name + " wounded " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ". <br>";
			hurtPart.status = "wounded";
		}
		else if(determineChance <= chance && hurtPart.status == "wounded"){
			fighter.unarmed.currentxp += chance/25;
			fighter.unarmed.level = calcXP(fighter.unarmed.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatBreak'>" +fighter.name + " broke " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + "! <br>";
			hurtPart.status = "broken";
			defender.bleed(fighter, 2);
			if(hurtPart.name == "head" || hurtPart.name == "neck" || hurtPart.name == "torso"){
				defender.alive = false;
			}
			if(hurtPart.name == "right upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right lower arm" || defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left lower arm" || defender.limbs.parts[g].name == "left hand"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left hand" || defender.limbs.parts[g].name == "left claw"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot" || defender.limbs.parts[g].name == "right lower leg"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot" || defender.limbs.parts[g].name == "left lower leg"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot"){
						defender.limbs.parts[g].status == "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			//defender.limbs.parts.splice(hitChance,1);
		}
		else if(determineChance <= chance && hurtPart.status == "broken"){
			combat(fighter,defender,style);
		}
		else{
			defender.dodging.currentxp += chance/100;
			defender.dodging.level = calcXP(defender.dodging.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatMiss'>" + fighter.name + " tried to hit " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ".</span> <br>";
			//defender.bleed(fighter, 5);

		}

	}

}