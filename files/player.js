//Here we go.
//saveTile = grid[((player.y*10) + player.x)];


document.body.onkeydown = function(event){
    var checkAvailability = function(direction){
      //testTile = new point(null,null,'0 <--- TESTING');
      if(direction == "right"){
        //testTile = player;
        prevLoc = ((player.y*10) + player.x);
        if(grid[(prevLoc + 1)].desc !== "floor" || grid[(prevLoc + 1)].character !== null){
          //console.log(grid[(prevLoc + 1)].symbol);
          //console.log("Can't do that!");
          if(grid[(prevLoc + 1)].character !== null && player.inv.length == 0){
            player.checkBrokenBones();
            combat(player,grid[(prevLoc + 1)].character,"unarmed");
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
          if(grid[(prevLoc + 10)].character !== null && player.inv.length == 0){
            player.checkBrokenBones();
            combat(player,grid[(prevLoc + 10)].character,"unarmed");
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
          if(grid[(prevLoc -1)].character !== null && player.inv.length == 0){
            player.checkBrokenBones();
            combat(player,grid[(prevLoc -1)].character,"unarmed");
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
          if(grid[(prevLoc - 10)].character !== null && player.inv.length == 0){
            player.checkBrokenBones();
            combat(player,grid[(prevLoc - 10)].character,"unarmed");
            turn++;
          }
          return false;
        }
        else{
          player.checkBrokenBones();
          return true;
        }
      }
    }
    event = event || window.event;
    var keycode = event.charCode || event.keyCode;
    
    

    if(player.alive == true){
      if(keycode == 39){
        if(checkAvailability("right")){
          player.x ++;
          prevLoc = ((player.y*10) + player.x);
          grid[prevLoc].character = player;
          grid[prevLoc-1].character = null;
          turn++;
        }
        //grid[prevLoc+1].character = player;
      }
      else if(keycode == 40){
        if(checkAvailability("down")){
          player.y ++;
          prevLoc = ((player.y*10) + player.x);
          grid[prevLoc].character = player;
          grid[prevLoc-10].character = null;
          turn++;
        }  
      }
      else if(keycode == 37){
        if(checkAvailability("left")){
          player.x --;
          prevLoc = ((player.y*10) + player.x);
          grid[prevLoc].character = player;
          grid[prevLoc+1].character = null;
          turn++;
        }
      }
      else if(keycode == 38){
        if(checkAvailability("up")){
          player.y --;
          prevLoc = ((player.y*10) + player.x);
          grid[prevLoc].character = player;
          grid[prevLoc+10].character = null;
          turn++;
        }
      }
      if(keycode == 32){
        turn++;
      }
    }
    else{
      //turn++;
    }

}