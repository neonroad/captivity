checkClass = function(target){
	console.log('CHECKING CLASS FOR ' + target.name);
	console.log(target.name + " Level: " + target.level);
	abilityScreen = document.getElementById('abilities');
	ability1 = document.getElementById('ability1');
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
			player.ability1 = Parrrley;
			break;
	}
}

checkClass(player);