checkLimbs = function(part){
	if(part.child !== undefined){
		part.child.status = 'broken';
		checkLimbs(part.child)
	}
}

combat = function(fighter, defender,style, finisher, continued){
	if(style == "unarmed" && finisher !== true){
		//chance = Math.floor(((fighter.unarmed.level/defender.dodging.level) * (Math.sqrt(fighter.unarmed.level))) );
		chance = randomGen(1,3);

		preference = []; //part to hit with

		hurtChance = randomGen(0,defender.limbs.parts.length); //what the fighter will HIT

		for(b=0;b<fighter.limbs.parts.length;b++){ //what the fighter will hit WITH
			if(fighter.limbs.parts[b].fight == true){
				if(fighter.limbs.parts[b].status !== 'broken'){
					preference.push(fighter.limbs.parts[b]);
				}
			}
		}
		if(preference.length == 0){
			return false;
		}

		hittingPart = randomGen(0, preference.length);

		hittingPart = preference[hittingPart];
		
		hurtPart = defender.limbs.parts[hurtChance]; //what the fighter will HIT


		if(hurtPart.status == "healthy"){
			
			History.legible += 1;
			History.innerHTML += "<span id='combat'>" + fighter.name + " injured " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ".</span> <br>";
			hurtPart.status = "injured";	
		}


		else if(hurtPart.status == "injured"){
			History.legible += 1;
			History.innerHTML += "<span id='combatWound'>" + fighter.name + " wounded " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ". <br>";
			hurtPart.status = "wounded";
		}


		else if(hurtPart.status == "wounded"){

			if(hurtPart.name == "head" || hurtPart.name == "neck" || hurtPart.name == "torso"){
				finisher = 1;
				defender.alive = false;
				if(finisher == 1){
					combat(fighter,defender, style, true);
				}
				update(false);
			}

			else{
				History.innerHTML += "<span id='combatBreak'>" +fighter.name + " broke " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + "! <br>";
				hurtPart.status = "broken";
				defender.bleed(defender, 2);
				//defender.limbs.parts.splice(hitChance,1);
				checkLimbs(hurtPart);				
			}


		}


		else if(hurtPart.status == "broken" || hurtPart.status == "sliced" || hurtPart.status == "xshot"){
			combat(fighter,defender,style);
		}


		else{
			History.legible += 1;
			History.innerHTML += "<span id='combatMiss'>" + fighter.name + " tried to hit " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ".</span> <br>";
			//defender.bleed(fighter, 5);

		}
	}

	else if( style == 'unarmed' && finisher == true){
		if(continued == true){
			History.innerHTML += ", then ";
		}
		setTimeout(function(){
			History.style.backgroundColor = "#989987";
		}, 100)
		History.style.backgroundColor = "#FF0000";
		defender.bleed(defender);
		finisher = randomGen(1,4);
		preference = [];
		hurtChance = randomGen(0,defender.limbs.parts.length); //what the fighter will HIT


		for(h=0; h < fighter.limbs.parts.length; h++){ //Heal fighter
			if(fighter.limbs.parts[h].status !== 'healthy'){
				fighter.limbs.parts[h].status = 'healthy';
			}
		}

		for(b=0;b<fighter.limbs.parts.length;b++){ //what the fighter will hit WITH
			if(fighter.limbs.parts[b].fight == true){
				if(fighter.limbs.parts[b].status !== 'broken'){
					preference.push(fighter.limbs.parts[b]);
				}
			}
		}
		if(preference.length == 0){
			return false;
		}

		hittingPart = randomGen(0, preference.length);
		finisherCont = randomGen(1,5);
		hittingPart = preference[hittingPart];
		
		hurtPart = defender.limbs.parts[hurtChance];

		if(hurtPart.status == 'broken'){
			History.innerHTML += fighter.name + " tears out " + defender.name + "'s heart!</span><br>";
			return;
		}
		
		hurtPart.status = 'broken';

		if(finisher == 1 && hurtPart.name == 'neck'){	
			History.innerHTML += fighter.name + " snaps " + defender.name + "'s " + hurtPart.name;
		}
		else if(finisher == 1 && hurtPart.name == 'head'){
			History.innerHTML += fighter.name + " cracks open " + defender.name + "'s " + hurtPart.name + " with their " + hittingPart.name;
		}
		else if(finisher == 1){
			History.innerHTML += fighter.name + " beats up " +defender.name;
			finisherCont = 2;
		}
		else if(finisher == 2 && (hittingPart.name == 'right hand' || hittingPart.name == 'left hand') ){
			History.innerHTML += fighter.name + " punches through " + defender.name + "'s " + hurtPart.name;
		}
		else if(finisher == 2 && (hittingPart.name == 'right foot' || hittingPart.name == 'left foot') ){
			History.innerHTML += fighter.name + " kicks through " + defender.name + "'s " + hurtPart.name;
		}
		else if(finisher == 3 && (hurtPart.name !== 'torso' && hurtPart.name !== 'neck') && (hittingPart.name == 'right hand' || hittingPart.name == 'left hand')){
			History.innerHTML += fighter.name + " tears off " + defender.name + "'s " + hurtPart.name + " with their " + hittingPart.name;
			fighter.wield = hurtPart;
			finisherCont = 5;
			checkLimbs(hurtPart);
		}
		else if(finisher == 3){
			History.innerHTML += defender.name + " gets torn in half!<br>";
			return;
		}

		if(finisherCont == 2){
			combat(fighter,defender,'unarmed',true,true);
		}
		else if(finisherCont == 5){
			combat(fighter,defender,'limbed',true,true);
		}
		else{
			History.innerHTML += "!</span><br>";
		}
	}
	else if( style == 'limbed' && finisher == true){
		if(continued == true){
			History.innerHTML += ", then ";
		}
		History.style.backgroundColor = "#FF0000";
		for (var i = 0; i < 8; i++) {
			defender.bleed(fighter);
		};
		finisher = randomGen(1,2);
		hurtChance = randomGen(0,defender.limbs.parts.length); //what the fighter will HIT

		hittingPart = fighter.wield;
		finisherCont = randomGen(1,5);
		
		hurtPart = defender.limbs.parts[hurtChance];
		//console.log(fighter.name + " hits with " +defender.name + "'s " + hittingPart.name + " to attack the defender's " + hurtPart.name);

		if(hurtPart.status == 'broken'){
			History.innerHTML += fighter.name + " drops the " + hittingPart.name + ".</span><br>";
			gib = new item(fighter.x,fighter.y, "~", hittingPart.name);
			for (var i = 0; i < 8; i++) {
				defender.bleed(fighter,3);
			};
			fighter.wield = undefined;
			return;
		}
		
		hurtPart.status = 'broken';

		if(finisher == 1){	
			History.innerHTML += fighter.name + " smashes " + defender.name + "'s " + hurtPart.name + " with " + defender.name + "'s own " + hittingPart.name;

		}

		if(finisherCont == 2){
			combat(fighter,defender,'limbed',true,true);
		}
		else{
			History.innerHTML += "!<br>";
			History.innerHTML += fighter.name + " tosses the " + hittingPart.name + " away.</span><br>";
			gib = new item(fighter.x,fighter.y, "~", hittingPart.name);
			for (var i = 0; i < 8; i++) {
				defender.bleed(fighter,3);
			};
			fighter.wield = undefined;
		}
	}

	else if(style == 'armed' && finisher !== true){
		hurtChance = randomGen(0,defender.limbs.parts.length); //what the fighter will HIT
		hurtPart = defender.limbs.parts[hurtChance]; //what the fighter will HIT

		for (var i = 0; i < grid[defender.x + defender.y*10].projectiles.length; i++) {
			if(grid[defender.x + defender.y*10].projectiles[i].owner == fighter){
				hittingPart = grid[defender.x + defender.y*10].projectiles[i];
			}
		};

		if(hurtPart.status == "healthy"){
			History.legible += 1;
			History.innerHTML += "<span id='combat'>" + fighter.name + " injured " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + ".</span> <br>";
			hurtPart.status = "wounded";	
		}

		else if(hurtPart.status == "wounded"){

			if(hurtPart.name == "head" || hurtPart.name == "neck"){
				finisher = 1;
				defender.alive = false;
				if(finisher == 1){
					combat(fighter,defender, style, true);
				}
				update(false);
			}

			else{
				History.innerHTML += "<span id='combatBreak'>" +fighter.name + " broke " + defender.name + "'s " + hurtPart.name + " with " + hittingPart.name + "! <br>";
				hurtPart.status = "broken";
				defender.bleed(defender, 2);
				//defender.limbs.parts.splice(hitChance,1);
				checkLimbs(hurtPart);				
			}


		}


		else{
			combat(fighter,defender,style);
		}
	}

	else if( style == 'armed' && finisher == true){

		setTimeout(function(){
			History.style.backgroundColor = "#989987";
		}, 100)
		History.style.backgroundColor = "#FF0000";
		defender.bleed(defender);
		hurtChance = randomGen(0,defender.limbs.parts.length); //what the fighter will HIT

		for (var i = 0; i < grid[defender.x + defender.y*10].projectiles.length; i++) {
			if(grid[defender.x + defender.y*10].projectiles[i].owner == fighter){
				hittingPart = grid[defender.x + defender.y*10].projectiles[i];
			}
		};		

		for(h=0; h < fighter.limbs.parts.length; h++){ //Heal fighter
			if(fighter.limbs.parts[h].status !== 'healthy'){
				fighter.limbs.parts[h].status = 'healthy';
			}
		}
		
		hurtPart = defender.limbs.parts[hurtChance];

		hurtPart.status = 'broken';

		if(hurtPart.status == 'broken'){
			History.innerHTML += fighter.name + " shoots through " + defender.name + "'s "+ hurtPart.name + "!</span><br>";
			return;
		}

		History.innerHTML += "!</span><br>";
		
	}	

}