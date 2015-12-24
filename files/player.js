//Here we go.
//saveTile = grid[((player.y*10) + player.x)];

var map = {37: false, 38: false, 39: false, 40:false, 190:false, 188:false};
document.body.onkeydown = function(event){
    if(debounce == 0){
      debounce = 1;
      var checkAvailability = function(direction){
        //testTile = new point(null,null,'0 <--- TESTING');
        if(direction == "right"){
          //testTile = player;
          prevLoc = ((player.y*10) + player.x);
          if(grid[(prevLoc + 1)].desc !== "floor" || grid[(prevLoc + 1)].character !== null){
            //console.log(grid[(prevLoc + 1)].symbol);
            //console.log("Can't do that!");
            if(grid[(prevLoc + 1)].character !== null && player.wield == 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc + 1)].character,"unarmed");
              turn++;
            }
            else if(grid[(prevLoc + 1)].character !== null && player.wield !== 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc + 1)].character,"melee");
              turn++;
            }
            return false;
          }
          else{
            player.checkBrokenBones();
            return true;
          }
        }
        else if(direction == "down"){
          prevLoc = ((player.y*10) + player.x);
          if(grid[(prevLoc + 10)].desc !== "floor" || grid[(prevLoc + 10)].character !== null){
            //console.log(grid[(prevLoc + 10)].symbol);
            //console.log("Can't do that!");
            if(grid[(prevLoc + 10)].character !== null && player.wield == 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc + 10)].character,"unarmed");
              turn++;
            }
            else if(grid[(prevLoc + 10)].character !== null && player.wield !== 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc + 10)].character,"melee");
              turn++;
            }
            return false;
          }
          else{
            player.checkBrokenBones();
            return true;
          }
        }
        else if(direction == "left"){
          //testTile = player;
          prevLoc = ((player.y*10) + player.x);
          if(grid[(prevLoc - 1)].desc !== "floor" || grid[(prevLoc - 1)].character !== null){
            //console.log(grid[(prevLoc - 1)].symbol);
            //console.log("Can't do that!");
            if(grid[(prevLoc -1)].character !== null && player.wield == 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc -1)].character,"unarmed");
              turn++;
            }
            else if(grid[(prevLoc - 1)].character !== null && player.wield !== 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc - 1)].character,"melee");
              turn++;
            }
            return false;
          }
          else{
            player.checkBrokenBones();
            return true;
          }
        }
        else if(direction == "up"){
          prevLoc = ((player.y*10) + player.x);
          if(grid[(prevLoc - 10)].desc !== "floor" || grid[(prevLoc - 10)].character !== null){
            //console.log(grid[(prevLoc - 10)].symbol);
            //console.log("Can't do that!");
            if(grid[(prevLoc - 10)].character !== null && player.wield == 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc - 10)].character,"unarmed");
              turn++;
            }
            else if(grid[(prevLoc - 10)].character !== null && player.wield !== 0){
              player.checkBrokenBones();
              combat(player,grid[(prevLoc - 10)].character,"melee");
              turn++;
            }
            return false;
          }
          else{
            player.checkBrokenBones();
            return true;
          }
        }
        else{
        }
      }
      event = event || window.event;
      var keycode = event.charCode || event.keyCode;
      if (event.keyCode in map && player.alive == true) {
        map[event.keyCode] = true;
         if((map[37] && !map[38] && !map[39] && !map[40] && !map[190] && !map[188]) ||
            (!map[37] && map[38] && !map[39] && !map[40] && !map[190] && !map[188]) ||
            (!map[37] && !map[38] && map[39] && !map[40] && !map[190] && !map[188]) ||
            (!map[37] && !map[38] && !map[39] && map[40] && !map[190] && !map[188]) ||
            (!map[37] && !map[38] && !map[39] && !map[40] && map[190] && !map[188]) ||
            (!map[37] && !map[38] && !map[39] && !map[40] && !map[190] && map[188])) {
            if (map[37]) {
                if(checkAvailability("left")){
                  turn++;
                  player.x --;
                  prevLoc = ((player.y*10) + player.x);
                  grid[prevLoc].character = player;
                  grid[prevLoc+1].character = null;
                }
            } 
            else if (map[38]) {
                if(checkAvailability("up")){
                  turn++;
                  player.y --;
                  prevLoc = ((player.y*10) + player.x);
                  grid[prevLoc].character = player;
                  grid[prevLoc+10].character = null;
                }
            } 
            else if (map[39]) {
                if(checkAvailability("right")){
                  turn++;
                  player.x ++;
                  prevLoc = ((player.y*10) + player.x);
                  grid[prevLoc].character = player;
                  grid[prevLoc-1].character = null;
                }
            } 
            else if (map[40]) {
                if(checkAvailability("down")){
                  turn++;
                  player.y ++;
                  prevLoc = ((player.y*10) + player.x);
                  grid[prevLoc].character = player;
                  grid[prevLoc-10].character = null;
                }  
            }
            else if (map[190]){
              turn++;
            }
            else if (map[188]){ //pick up
              map[event.keyCode] = false;
              for(i=0;i<grid[(player.y*10)+player.x].items.length;i++){
                if(grid[(player.y*10)+player.x].items[i].desc == 'weapon'){
                  if(confirm('Pick up ' + grid[(player.y*10)+player.x].items[i].name + "?")){
                    player.inv.push(grid[(player.y*10)+player.x].items[i]);
                    grid[(player.y*10)+player.x].items.splice(i,1);
                    turn++;
                    player.checkBrokenBones();
                    //update();
                    if(player.wield == 0 && player.grasp > 0){
                      if(confirm("Wield " + player.inv[player.inv.length-1].name + "?")){
                        player.wield = player.inv[player.inv.length-1];
                        turn++;
                        update();
                      }
                    }
                  }
                  else{

                  }
                }
              }
            }
            for(t=0;t<grid[(player.y*10)+player.x].items.length;t++){
              History.innerHTML += "You stand atop a " + grid[(player.y*10)+player.x].items[t].desc + "<br>";
            }
        }
      }
      
      /**
      if(player.alive == true){
        if(keycode == 39){
          if(checkAvailability("right")){
            turn++;
            player.x ++;
            prevLoc = ((player.y*10) + player.x);
            grid[prevLoc].character = player;
            grid[prevLoc-1].character = null;
          }
          //grid[prevLoc+1].character = player;
        }
        if(keycode == 40){
          if(checkAvailability("down")){
            turn++;
            player.y ++;
            prevLoc = ((player.y*10) + player.x);
            grid[prevLoc].character = player;
            grid[prevLoc-10].character = null;
          }  
        }
        if(keycode == 37){
          if(checkAvailability("left")){
            turn++;
            player.x --;
            prevLoc = ((player.y*10) + player.x);
            grid[prevLoc].character = player;
            grid[prevLoc+1].character = null;
          }
        }
        if(keycode == 38){
          if(checkAvailability("up")){
            turn++;
            player.y --;
            prevLoc = ((player.y*10) + player.x);
            grid[prevLoc].character = player;
            grid[prevLoc+10].character = null;
          }
        }
        if(keycode == 190){
          turn++;
        }
        if(keycode == 188){
          for(i=0;i<grid[(player.y*10)+player.x].items.length;i++){
            if(grid[(player.y*10)+player.x].items[i].desc = 'weapon'){
              alert('pick up?');
              turn++;
            }
          }
        }
      }
      else{
        //turn++;
      }
      **/
      debounce = 0;
    }
}
document.body.onkeyup = function(event){
  if (event.keyCode in map) {
        map[event.keyCode] = false;
    }
}