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
let xplayer = "open";
let oplayer = "open";
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
    firebase.database().ref('/game/'+spaceTaken).set('X');
    didIWin("X",xMoves);
  } else {
    oMoves.push(spaceTaken);
    oMoves.sort();
    firebase.database().ref('/game/'+spaceTaken).set('O');
    didIWin("O",oMoves);
  }
  console.log("xMoves: ",xMoves);
  console.log("oMoves: ",oMoves);
}
function moveMade(event){
  //console.log(event);
  event.target.innerHTML = currentMove;
  console.log(event.target.id);
  recordMove(event.target.id);
  toggleXO();
  event.target.classList.add("taken");
}
let spacesArray = document.querySelectorAll(".space");
for (i=0;i<spacesArray.length;i++){
  let boardSpace = spacesArray[i];
  boardSpace.addEventListener("click", moveMade);
}

function updateBoard(moves){
  console.log(moves);
  for (i=0;i<spacesArray.length;i++){
    spacesArray[i].innerHTML=moves[i];
  }
}
//Firebase stuff
// firebase.auth().signInAnonymously().catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
//   console.log("signInAnonymously")
// });



function getUserId(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    console.log("user is signed in ", uid);
    if (xplayer=="open"){
      xplayer = uid;
    }
    firebase.database().ref('game/').update({
      xplayer : uid
    })
    console.log("xplayer: ",xplayer);
    console.log("oplayer: ",oplayer);
    // ...

    //Presence system
    var myConnectionsRef = firebase.database().ref('game/players/'+uid);
    var lastOnlineRef = firebase.database().ref('users/'+uid+'/lastOnline');

    // Get a reference to the database service
    var database = firebase.database();
    var connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function(snap) {
      if (snap.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        console.log('connected!')
        // add this device to my connections list
        // this value could contain info about the device or a timestamp too
        var con = myConnectionsRef.push(true);

        // when I disconnect, remove this device
        con.onDisconnect().remove();

        // when I disconnect, update the last time I was seen online
        lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
      }
    });



  } else {
    // User is signed out.
    // ...
    firebase.database().ref('game/').update({
      xplayer : "open"
    })
  }
  // ...
});
}

//clear board
function clearBoard() {

  firebase.database().ref('game/').set({
    0 : '',
    1 : '',
    2 : '',
    3 : '',
    4 : '',
    5 : '',
    6 : '',
    7 : '',
    8 : ''
  });
  getUserId();
}

var board = firebase.database().ref('game/');
board.on('value', function(snapshot) {
  updateBoard(snapshot.val());
});


clearBoard();
