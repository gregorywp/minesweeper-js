const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Minesweeper () {
    this.gameBoard = []
}

Minesweeper.prototype.initBoard = function(){
	var newRow = [];
	for(var i=0;i<8;i++){
		this.gameBoard[i] = [];
		for(var j=0;j<8;j++){
			this.gameBoard[i][j] = {
				bomb: false,
				known: false,
				selected: false
			};
		}
	}

	this.gameBoard[1][2].bomb = true;
	this.gameBoard[5][7].bomb = true;
	this.gameBoard[6][3].bomb = true;
}

Minesweeper.prototype.gameBoardDisplay = function(){
	var returnString = '';
	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			if(this.gameBoard[i][j].known){
				if(this.gameBoard[i][j].bomb){
					if(this.gameBoard[i][j].selected){
						returnString += 'X';
					} else {
						returnstring += 'B';
					}
				} else {
					var bombNeighbors = this.bombNeighbors(i,j);
					returnString += bombNeighbors==0?' ':bombNeighbors;
				}
			} else {
				returnString += '?';
			}
		}
		returnString += '\n';
	}

	return returnString;
}

Minesweeper.prototype.turn = function(){
	rl.question(this.gameBoardDisplay(), (answer) => {
	  this.processTurn(answer,true);

	  var isFinished = this.isFinished();
	  if(isFinished=='no'){
	  	this.turn();
	  } else {
	  	if(isFinished=='lost'){
	  		console.log('LOST');
	  	} else {
	  		console.log('WON');
	  	}
	  	rl.close();
	  }
	});
}

Minesweeper.prototype.isFinished = function(){
	if(this.hasLost()){
		return 'lost';
	} else if (this.hasWon()){
		return 'won';
	} else {
		return 'no';
	}
}

Minesweeper.prototype.hasLost = function(){
	var bombsSelected = 0;
	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			if(this.gameBoard[i][j].bomb&&this.gameBoard[i][j].selected){
				bombsSelected++;
			}
		}
	}
	return bombsSelected>0;
}

Minesweeper.prototype.hasWon = function(){
	var unknownNonBombs = 0;
	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			if(!this.gameBoard[i][j].bomb&&!this.gameBoard[i][j].known){
				unknownNonBombs++;
			}
		}
	}
	return unknownNonBombs==0;
}

Minesweeper.prototype.processTurn = function(move){
	var move = move.split(',');
	var i = parseInt(move[0]);
	var j = parseInt(move[1]);

	this.gameBoard[i][j].selected = true;
	this.gameBoard[i][j].known = true;

	this.scanBoard();
}

Minesweeper.prototype.nearbySpaces = function(i,j){
	returnSpaces = [];

	//i-1,j-1
	if(i>0&&j>0){
		returnSpaces.push((i-1)+','+(j-1));
	}
	//i-1,j
	if(i>0){
		returnSpaces.push((i-1)+','+(j));
	}
	//i-1,j+1
	if(i>0&&j<7){
		returnSpaces.push((i-1)+','+(j+1));
	}
	//i,j-1
	if(j>0){
		returnSpaces.push((i)+','+(j-1));
	}
	//i,j+1
	if(j<7){
		returnSpaces.push((i)+','+(j+1));
	}
	//i+1,j-1
	if(i<7&&j>0){
		returnSpaces.push((i+1)+','+(j-1));
	}
	//i+1,j
	if(i<7){
		returnSpaces.push((i+1)+','+(j));
	}
	//i+1,j+1
	if(i<7&&j<7){
		returnSpaces.push((i+1)+','+(j+1));
	}

	return returnSpaces;
}

Minesweeper.prototype.bombNeighbors = function(i,j){
	var count = 0;
	var neighbors = this.nearbySpaces(i,j);

	for(var i=0;i<neighbors.length;i++){
		if(this.gameBoard[neighbors[i].split(',')[0]][neighbors[i].split(',')[1]].bomb){
			count++;
		}
	}

	return count;
}

Minesweeper.prototype.scanBoard = function(){
	do{
		var cellsChanged = 0;
		for(var i=0;i<8;i++){
			for(var j=0;j<8;j++){
				//if a cell is known and it is a zero then flip its neighbors to known and run again
				if(this.gameBoard[i][j].known&&this.bombNeighbors(i,j)==0){
					var nearbySpaces = this.nearbySpaces(i,j);
					for(var k=0;k<nearbySpaces.length;k++){
						if(!this.gameBoard[nearbySpaces[k].split(',')[0]][nearbySpaces[k].split(',')[1]].known){
							this.gameBoard[nearbySpaces[k].split(',')[0]][nearbySpaces[k].split(',')[1]].known = true;
							cellsChanged++;
						}
					}
				}
			}
		}
	}while(cellsChanged>0)
}

var minesweeper = new Minesweeper();

minesweeper.initBoard();

minesweeper.turn();