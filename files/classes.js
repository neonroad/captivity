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
	}
}