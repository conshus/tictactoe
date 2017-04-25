let possible = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]
let xMoves = [];
let oMoves =[];
currentMove = "X"
function toggleXO(){
  if (currentMove == "X"){
    currentMove = "O";
  }else {
    currentMove = "X";
  }
}
function didIWin(player,movesMade){
  console.log("Did I win?");
  for (i=0; i<possible.length; i++){
    if ((movesMade.indexOf(possible[i][0]) != -1) && (movesMade.indexOf(possible[i][1]) != -1) && (movesMade.indexOf(possible[i][2]) != -1)){
      console.log(player,"you win!");
      let winningSpace1 = possible[i][0];
      document.getElementById(possible[i][0]).style.color ="red";
      document.getElementById(possible[i][1]).style.color ="red";
      document.getElementById(possible[i][2]).style.color ="red";
    }
  }
}
function recordMove(spaceTaken){
  spaceTaken = parseInt(spaceTaken);
  if (currentMove=="X"){
    xMoves.push(spaceTaken);
    xMoves.sort();
    didIWin("X",xMoves);
  } else {
    oMoves.push(spaceTaken);
    oMoves.sort();
    didIWin("O",oMoves);
  }
  console.log("xMoves: ",xMoves);
  console.log("oMoves: ",oMoves);
}
function moveMade(event){
  //console.log(event);
  event.target.innerHTML = currentMove;
  recordMove(event.target.id);
  toggleXO();
  event.target.classList.add("taken");
}
let spacesArray = document.querySelectorAll(".space");
for (i=0;i<spacesArray.length;i++){
  let boardSpace = spacesArray[i];
  boardSpace.addEventListener("click", moveMade);
}
