combat = function(fighter, defender,style, distance){ //distance is used mainly for ARMED combat. Leave blank if unnecessary.
	//UNARMED COMBAT
	var hasEyes = 0;
	if(style == "unarmed"){
		chance = Math.floor((fighter.unarmed.level/defender.dodging.level) * (Math.sqrt(fighter.unarmed.level)));
		console.log(chance);
		//History.innerHTML += chance + "<br>";

		//reduce with injuries
		for(i=0;i<fighter.limbs.parts.length;i++){
			hasEyes = 0;
			if(fighter.limbs.parts[i].name == "right eye" || fighter.limbs.parts[i].name == "left eye"){
				hasEyes = 1;
				if(fighter.limbs.parts[i].status == "injured"){
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
			if(fighter.desc == 'Robot'){
				hasEyes = 1;
			}
			if(hasEyes = 0){
				chance*=0.15;
			}
		}

		determineChance = randomGen(1,100);

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


		if(determineChance <= chance+10 && hurtPart.status == "healthy"){
			console.log(((chance+defender.dodging.level)/fighter.unarmed.level)+ " xp");
			fighter.unarmed.currentxp += (chance+defender.dodging.level)/fighter.unarmed.level;
			fighter.unarmed.level = calcXP(fighter.unarmed.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combat'>" + fighter.name + " injured " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ".</span> <br>";
			hurtPart.status = "injured";	
		}
		else if(determineChance <= chance+10 && hurtPart.status == "injured"){
			fighter.unarmed.currentxp += (chance+defender.dodging.level)/fighter.unarmed.level;
			fighter.unarmed.level = calcXP(fighter.unarmed.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatWound'>" + fighter.name + " wounded " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ". <br>";
			hurtPart.status = "wounded";
		}
		else if(determineChance <= chance+10 && hurtPart.status == "wounded"){
			fighter.unarmed.currentxp += (chance+defender.dodging.level)/fighter.unarmed.level;
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
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left lower arm" || defender.limbs.parts[g].name == "left hand"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left hand" || defender.limbs.parts[g].name == "left claw"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot" || defender.limbs.parts[g].name == "right lower leg"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot" || defender.limbs.parts[g].name == "left lower leg"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			//defender.limbs.parts.splice(hitChance,1);
		}
		else if(hurtPart.status == "broken" || hurtPart.status == "sliced" || hurtPart.status == "xshot"){
			combat(fighter,defender,style);
		}
		else{
			defender.dodging.currentxp += chance + (Math.sqrt(fighter.unarmed.level)/fighter.unarmed.level);
			defender.dodging.level = calcXP(defender.dodging.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatMiss'>" + fighter.name + " tried to hit " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ".</span> <br>";
			//defender.bleed(fighter, 5);

		}

	}
	//MELEE COMBAT
	else if(style == "melee" && fighter.wield.type == "sharp"){
		chance = Math.floor((((fighter.melee.level / defender.dodging.level) * (0.95)* Math.random()) * 100))
		//History.innerHTML += chance + "<br>";

		//reduce with injuries
		for(i=0;i<fighter.limbs.parts.length;i++){
			hasEyes = 0;
			if(fighter.limbs.parts[i].name == "right eye" || fighter.limbs.parts[i].name == "left eye"){
				hasEyes = 1;
				if(fighter.limbs.parts[i].status == "injured" || fighter.limbs.parts[i].status == "cut"){
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
			if(hasEyes = 0){
				chance *= 0.20;
			}
		}

		determineChance = randomGen(0,100);

		preference = []; //part to hit with
		hitChance = randomGen(0,defender.limbs.parts.length);
		//console.log(preference);
		
		hurtPart = defender.limbs.parts[hitChance]; //what the fighter will HIT


		if(determineChance <= chance && hurtPart.status == "healthy"){
			fighter.melee.currentxp += chance/100;
			fighter.melee.level = calcXP(fighter.melee.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combat'>" + fighter.name + " cut " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + ".</span> <br>";
			hurtPart.status = "cut";	
		}
		else if(determineChance <= chance && hurtPart.status == "cut"){
			fighter.melee.currentxp += chance/50;
			fighter.melee.level = calcXP(fighter.melee.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatWound'>" + fighter.name + " wounded " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + ". <br>";
			hurtPart.status = "wounded";
		}
		else if(determineChance <= chance && hurtPart.status == "wounded"){
			fighter.melee.currentxp += chance/25;
			fighter.melee.level = calcXP(fighter.melee.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatBreak'>" +fighter.name + " sliced " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + "! <br>";
			hurtPart.status = "sliced";
			defender.bleed(fighter, 2);
			defender.gib(hurtPart);
			if(hurtPart.name == "head" || hurtPart.name == "neck"){
				//defender.alive = false;
			}
			if(hurtPart.name == "right upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right lower arm" || defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left lower arm" || defender.limbs.parts[g].name == "left hand"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left hand" || defender.limbs.parts[g].name == "left claw"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot" || defender.limbs.parts[g].name == "right lower leg"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot" || defender.limbs.parts[g].name == "left lower leg"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot"){
						defender.limbs.parts[g].status = "sliced";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}

			//defender.limbs.parts.splice(hitChance,1);
		}
		else if(hurtPart.status == "broken" || hurtPart.status == "sliced" || hurtPart.status == "xshot"){
			combat(fighter,defender,style);
		}
		else{
			defender.dodging.currentxp += chance/100;
			defender.dodging.level = calcXP(defender.dodging.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatMiss'>" + fighter.name + " tried to hit " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + ".</span> <br>";
			//defender.bleed(fighter, 5);

		}

	}
	else if(style == "melee" && (fighter.wield.type == "blunt" || fighter.wield.type == "gun") ){
		chance = Math.floor((((fighter.melee.level / defender.dodging.level) * (0.95)* Math.random()) * 100))
		//History.innerHTML += chance + "<br>";

		//reduce with injuries
		for(i=0;i<fighter.limbs.parts.length;i++){
			hasEyes = 0;
			if(fighter.limbs.parts[i].name == "right eye" || fighter.limbs.parts[i].name == "left eye"){
				hasEyes = 1;
				if(fighter.limbs.parts[i].status == "injured" || fighter.limbs.parts[i].status == "cut"){
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
			if(hasEyes = 0){
				chance *= 0.20;
			}
		}

		determineChance = randomGen(0,100);

		preference = []; //part to hit with
		hitChance = randomGen(0,defender.limbs.parts.length);
		//console.log(preference);
		
		hurtPart = defender.limbs.parts[hitChance]; //what the fighter will HIT


		if(determineChance <= chance && hurtPart.status == "healthy"){
			fighter.melee.currentxp += chance/100;
			fighter.melee.level = calcXP(fighter.melee.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combat'>" + fighter.name + " injured " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + ".</span> <br>";
			hurtPart.status = "injured";	
		}
		else if(determineChance <= chance && hurtPart.status == "injured"){
			fighter.melee.currentxp += chance/50;
			fighter.melee.level = calcXP(fighter.melee.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatWound'>" + fighter.name + " wounded " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + ". <br>";
			hurtPart.status = "wounded";
		}
		else if(determineChance <= chance && hurtPart.status == "wounded"){
			fighter.melee.currentxp += chance/25;
			fighter.melee.level = calcXP(fighter.melee.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatBreak'>" +fighter.name + " broke " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + "! <br>";
			hurtPart.status = "broken";
			defender.bleed(fighter, 2);
			if(hurtPart.name == "head" || hurtPart.name == "neck" || hurtPart.name == "torso"){
				defender.alive = false;
			}
			if(hurtPart.name == "right upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right lower arm" || defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
			if(hurtPart.name == "right lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
			if(hurtPart.name == "left upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left lower arm" || defender.limbs.parts[g].name == "left hand"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
			if(hurtPart.name == "left lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left hand" || defender.limbs.parts[g].name == "left claw"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
			if(hurtPart.name == "right upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot" || defender.limbs.parts[g].name == "right lower leg"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
			if(hurtPart.name == "right lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
			if(hurtPart.name == "left upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot" || defender.limbs.parts[g].name == "left lower leg"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
			if(hurtPart.name == "left lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot"){
						defender.limbs.parts[g].status = "broken";
					}
				}
			}
		}
		else if(hurtPart.status == "broken" || hurtPart.status == "sliced" || hurtPart.status == "xshot"){
			combat(fighter,defender,style);
		}
		else{
			defender.dodging.currentxp += chance/100;
			defender.dodging.level = calcXP(defender.dodging.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatMiss'>" + fighter.name + " tried to hit " + defender.name + "'s " + hurtPart.name + " with " + fighter.wield.name + ".</span> <br>";
			//defender.bleed(fighter, 5);

		}

	}
	else if(style == "gun"){
		chance = Math.floor((((fighter.armed.level / defender.dodging.level) * (0.99 + defender.turnBuffer) * Math.random()) * 100))
		//console.log(chance + " f: " + fighter.turnBuffer);
		//History.innerHTML += chance + "<br>";

		//reduce with injuries
		for(i=0;i<fighter.limbs.parts.length;i++){
			hasEyes = 0;
			if(fighter.limbs.parts[i].name == "right eye" || fighter.limbs.parts[i].name == "left eye"){
				hasEyes = 1;
				if(fighter.limbs.parts[i].status == "injured"){
					chance*=0.5;
				}
				else if(fighter.limbs.parts[i].status == "wounded"){
					chance *=0.25;
				}
				else if(fighter.limbs.parts[i].status == "broken"){
					chance *= 0.05;
					//console.log(chance);
				}
			}
			if(fighter.desc == 'Robot'){
				hasEyes = 1;
			}
			if(hasEyes = 0){
				chance*=0.1;
			}
		}

		determineChance = randomGen(0,100+fighter.turnBuffer);

		hitChance = randomGen(0,defender.limbs.parts.length);
		
		//console.log(preference);
		
		hurtPart = defender.limbs.parts[hitChance]; //what the fighter will HIT


		if(determineChance <= chance && hurtPart.status == "healthy" && fighter.wield.damage == 1){
			fighter.armed.currentxp += chance/100;
			fighter.armed.level = calcXP(fighter.armed.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combat'>" + fighter.name + " wounded " + defender.name + "'s " + hurtPart.name + " with a shot from their " + fighter.wield.name + ".</span> <br>";
			defender.bleed(fighter, 2);
			hurtPart.status = "wounded";	
		}
		else if(determineChance <= chance && hurtPart.status == "wounded" || fighter.wield.damage > 1){
			fighter.armed.currentxp += chance/25;
			fighter.armed.level = calcXP(fighter.armed.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatBreak'>" +fighter.name + " shot through " + defender.name + "'s " + hurtPart.name + " with a shot from their " + fighter.wield.name + "! <br>";
			hurtPart.status = "xshot";
			defender.bleed(fighter, 4);
			if(hurtPart.name == "head" || hurtPart.name == "neck"){
				defender.alive = false;
			}
			if(hurtPart.name == "right upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right lower arm" || defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right hand" || defender.limbs.parts[g].name == "right claw"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left lower arm" || defender.limbs.parts[g].name == "left hand"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower arm"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left hand" || defender.limbs.parts[g].name == "left claw"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot" || defender.limbs.parts[g].name == "right lower leg"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "right lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "right foot"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left upper leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot" || defender.limbs.parts[g].name == "left lower leg"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			if(hurtPart.name == "left lower leg"){
				for(g=0;g<defender.limbs.parts.length;g++){
					if(defender.limbs.parts[g].name == "left foot"){
						defender.limbs.parts[g].status = "broken";
						//defender.limbs.parts.splice(g,1);
					}
				}
			}
			//defender.limbs.parts.splice(hitChance,1);
		}
		else if(hurtPart.status == "broken" || hurtPart.status == "sliced" || hurtPart.status == "xshot"){
			combat(fighter,defender,style);
		}
		else{
			defender.dodging.currentxp += chance/100;
			defender.dodging.level = calcXP(defender.dodging.currentxp);
			History.legible += 1;
			History.innerHTML += "<span id='combatMiss'>" + fighter.name + " tried to hit " + defender.name + "'s " + hurtPart.name + " with a shot from their " + fighter.wield.name + ".</span> <br>";
			//defender.bleed(fighter, 5);

		}

	}

}