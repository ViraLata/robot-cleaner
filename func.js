const batteryForward = 2;
const batteryTurn = 1;
const batteryBack = 3;
const batteryClean = 5;

function coordinate(x, y) {
    this.x = x;
    this.y = y;
}

function exportMyrobot(visitedVar, cleanedVar, end_x, end_y, facing, battery) {
	visited = [];
	cleaned = [];
	Final = [];
	end_x = 0;
	end_y = 0;
	facing = '';
	battery = 0;


  	this.pushExport = function pushExport(visitedVar, cleanedVar, end_x, end_y, facing, battery) {
  		this.visited = visitedVar;
  		this.cleaned = cleanedVar;
  		this.Final.push({X: end_x, Y: end_y, facing: facing});
  		this.battery = battery;
  		this.Final = this.Final[0];
  	}

}



function myrobot () {
	//declare robot
  	loc_X = 0;
  	loc_Y = 0;
  	facing = '';
  	max_X = 0;
  	max_Y = 0;
  	battery = 0;
  	stateRobot = 'OFF';
  	visited = [];
  	cleaned = [];
  	plano = {};

  	this.cleanDuplicated = function cleanDuplicated() {
  		//clean the duplicate values
		var sl = this.visited;
		var out = [];
		
		//clean the duplicates
		for (var i = 0, l = sl.length; i < l; i++) {
		    var unique = true;
		    for (var j = 0, k = out.length; j < k; j++) {
		        if ((sl[i].x === out[j].x) && (sl[i].y === out[j].y)) {
		            unique = false;
		        }
		    }
		    if (unique) {
		        out.push(sl[i]);
		    }
		}

		this.visited = out;

		var sl2 = this.cleaned;
		var out2 = [];
		
		//clean the duplicates
		for (var i = 0, l = sl2.length; i < l; i++) {
		    var unique = true;
		    for (var j = 0, k = out2.length; j < k; j++) {
		        if ((sl2[i].x === out2[j].x) && (sl2[i].y === out2[j].y)) {
		            unique = false;
		        }
		    }
		    if (unique) {
		        out2.push(sl2[i]);
		    }
		}

		this.cleaned = out2;

  	}


  	this.pushNewCleaned = function pushNewCleaned(latx,laty) {
  		this.cleaned.push({x: latx, y: laty});
  	}

  	this.pushNewVisited = function pushNewVisited(latx,laty) {
  		this.visited.push({x: latx, y: laty});
  	}

  	this.setNewLocation = function setNewLocation (latx,laty) {
  		this.loc_X = latx;
  		this.loc_Y = laty;
  		this.pushNewVisited(latx, laty);
  	}

  	this.setNewDirection = function setNewLocation (direction) {
  		this.facing = direction;
  	}

  	this.drainBattery = function drainBattery (numRest) {
  		if (this.battery >= numRest) {
  			this.battery = this.battery - numRest;
  			return true;
  		} else {
  			return false;
  		}
  	}

  	this.turnOffRobot = function turnStateRobot () {
  		this.stateRobot = 'OFF';
  	}

  	this.turnOnRobot = function turnOnRobot () {
  		this.stateRobot = 'ON';
  	}

  	this.cleanRobot = function cleanRobot() {
  		if (this.drainBattery(batteryClean)) {
  			//clean the spot
  			this.pushNewCleaned(this.loc_X, this.loc_Y);
  		} else {
  			this.turnOffRobot();
  			return false;
  		}
  	}

  	this.backRobot = function backRobot () {
  		//go back
		var tempAddress;
		var tempX;
		var tempY;

		if (this.drainBattery(batteryBack)) {
			//we have battery
			//we look the future lat and long depending on where it looks at the robot
			switch (this.facing) {
				case 'N':
					tempX = this.loc_X;
					tempY = this.loc_Y+1;
					break;
				case 'S':
					tempX = this.loc_X;
					tempY = this.loc_Y-1;
					break;
				case 'E':
					tempX = this.loc_X+1;
					tempY = this.loc_Y;
					break;
				case 'W':
					tempX = this.loc_X-1;
					tempY = this.loc_Y;
					break;
			}
			//check if we hit a wall
			if (tempX >= 0 && tempX < this.max_X && tempY >= 0 && tempY < this.max_Y ) {
				tempAddress = this.plano[tempY][tempX];
				//check if the space is available
				if (tempAddress === 'S') {
					this.setNewLocation(tempX, tempY);
					return true;
				} else {
					//blocked
					return false;
				}
			} else {
				//we hit a wall
				return false;
			}
		} else {
			//no battery
			this.turnOffRobot();
			return false
		}
  	}

  	this.advanceRobot = function advanceRobot () {
  		//go forward
		var tempAddress;
		var tempX;
		var tempY;
		//the robot go forwad
		//we look the future lat and long depending on where it looks at the robot
		if(this.drainBattery(batteryForward)) {
			switch (this.facing) {
				case 'N':
					tempX = this.loc_X;
					tempY = this.loc_Y-1;
					break;
				case 'S':
					tempX = this.loc_X;
					tempY = this.loc_Y+1;
					break;
				case 'E':
					tempX = this.loc_X-1;
					tempY = this.loc_Y;
					break;
				case 'W':
					tempX = this.loc_X+1;
					tempY = this.loc_Y;
					break;
			}
			//check if we hit a wall
			if (tempX >= 0 && tempX < this.max_X && tempY >= 0 && tempY < this.max_Y ) {
				tempAddress = this.plano[tempY][tempX];
				//check if the space is available
				if (tempAddress === 'S') {
					//is ok to move
					this.setNewLocation(tempX, tempY);
					return true;
				} else {
					//blocked
					return false;
				}
			} else {
				//we hit a wall
				return false;
			}
		} else {
			this.turnOffRobot();
			return false;
		}
  	}

  	this.turnRobot = function turnRobot (newDirection) {
  		//turn the robot
  		if (this.drainBattery(batteryTurn)) {
  			//we have battery
			switch (this.facing) {
				case 'N':
					left = 'E';
					rigth = 'W';
					back = 'S';
				break;
				case 'S':
					left = 'W';
					rigth = 'E';
					back = 'N';
				break;
				case 'E':
					left = 'S';
					rigth = 'N';
					back = 'W';
				break;
				case 'W':
					left = 'N';
					rigth = 'S';
					back = 'E';
				break;
			}
			//Now according to the received command we return the address that has to take
			switch (newDirection) {
				case ('TL'):
					this.setNewDirection(left);
					//return left;
				break;
				case ('TR'):
					this.setNewDirection(rigth);
					//return rigth;
				break;
			}
  		} else {
  			//run out of battery
  			this.turnOffRobot();
  			return false
  		}


  	}
}



module.exports.myrobot = myrobot;
module.exports.exportMyrobot = exportMyrobot;