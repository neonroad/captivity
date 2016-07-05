player.Class = 'Pirate';

moveReticle = function(direction){
	if(direction == 'left' && grid[crosshair.x + crosshair.y*10 -1] !== undefined){
		grid[crosshair.x + crosshair.y*10].reticle = null;
		crosshair.x --;
		grid[crosshair.x + crosshair.y*10].reticle = crosshair;
		crosshair.update();
		updateGraph();
	}
	if(direction == 'right' && grid[crosshair.x + crosshair.y*10 +1] !== undefined){
		grid[crosshair.x + crosshair.y*10].reticle = null;
		crosshair.x ++;
		grid[crosshair.x + crosshair.y*10].reticle = crosshair;
		crosshair.update();
		updateGraph();
	}
	if(direction == 'down' && grid[crosshair.x + crosshair.y*10 +10] !== undefined){
		grid[crosshair.x + crosshair.y*10].reticle = null;
		crosshair.y ++;
		grid[crosshair.x + crosshair.y*10].reticle = crosshair;
		crosshair.update();
		updateGraph();
	}
	if(direction == 'up' && grid[crosshair.x + crosshair.y*10 -10] !== undefined){
		grid[crosshair.x + crosshair.y*10].reticle = null;
		crosshair.y --;
		grid[crosshair.x + crosshair.y*10].reticle = crosshair;
		crosshair.update();
		updateGraph();
	}
}

aimAbility = function(range, location){
	player.aiming = 1;
	crosshair = new reticle(location.x, location.y, '+', "#FFFFFF");

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
	var availableSpace = [];
	availableSpace.push(currentPos);
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
			checkPos.color = '<span style="background-color:#DE8950;">'+checkPos.symbol+'</span>';
			if(checkPos.desc !== 'floor'){
				checkPos.color = '<span style="background-color:#A16137;">'+checkPos.symbol+'</span>';
			}
			availableSpace.push(checkPos);
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
			checkPos.color = '<span style="background-color:#DE8950;">'+checkPos.symbol+'</span>';
			if(checkPos.desc !== 'floor'){
				checkPos.color = '<span style="background-color:#A16137;">'+checkPos.symbol+'</span>';
			}
			availableSpace.push(checkPos);
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
			checkPos.color = '<span style="background-color:#DE8950;">'+checkPos.symbol+'</span>';
			if(checkPos.desc !== 'floor'){
				checkPos.color = '<span style="background-color:#A16137;">'+checkPos.symbol+'</span>';
			}
			availableSpace.push(checkPos);
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
			checkPos.color = '<span style="background-color:#DE8950;">'+checkPos.symbol+'</span>';
			if(checkPos.desc !== 'floor'){
				checkPos.color = '<span style="background-color:#A16137;">'+checkPos.symbol+'</span>';
			}
			availableSpace.push(checkPos);
		};	
		z++;
	}

	crosshair.update = function(){
		crosshair.invalid = 1;
		for(a = 0; a< availableSpace.length; a++){
			if(grid[crosshair.x + crosshair.y*10] == availableSpace[a] && !(grid[crosshair.x + crosshair.y*10].desc !== 'floor')){
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

Parrrley = function(user){
	aimAbility(2, user);
}