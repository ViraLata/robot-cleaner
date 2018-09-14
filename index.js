const jsonfile = require('jsonfile')
var fs = require('file-system');

var robotRumba = require('./func')


if (process.argv[2]) {
	try {
	    fs.accessSync(process.argv[2], fs.F_OK);
	    // the file exist
	    const file = process.argv[2]
	jsonfile.readFile(file, function (err, obj) {
	  if (err) console.error(err)

	  	//save the map
	  	mapa = obj.map;

		rumba = new robotRumba.myrobot();
		exportRumba = new robotRumba.exportMyrobot();

		rumba.loc_X = obj.start.X;
		rumba.loc_Y = obj.start.Y;
		rumba.facing = obj.start.facing;
		rumba.max_X = mapa.length;
		rumba.max_Y = mapa[1].length;
		rumba.battery = obj.battery;
		rumba.plano = obj.map;
		rumba.cleaned = [];
		rumba.visited = [];
		rumba.stateRobot = 'ON';

		//we enter the starting point
		rumba.pushNewVisited(rumba.loc_X, rumba.loc_Y);

		//loop for each command
		for (var i = 0; i < obj.commands.length; i++) {

			if (rumba.stateRobot === 'ON') {

				switch (obj.commands[i]) {
					case 'TL':
						//turn left
						rumba.turnRobot('TL');
						break;
					case 'TR':
						//turn rigth
						rumba.turnRobot('TR');
						break;
					case 'A':
						//Advance
						step1 = rumba.advanceRobot();
						if (step1 === false) {
							//Turn right, then advance. (TR, A)
							rumba.turnRobot('TR');
							step2 = rumba.advanceRobot();
							if (step2 === false) {
								//If that also hits an obstacle: Turn Left, Back, Turn Right, Advance (TL, B, TR, A)
								rumba.turnRobot('TL');
								rumba.backRobot();
								rumba.turnRobot('TR');
								step3 = rumba.advanceRobot();
								if (step3 === false) {
									//If that also hits an obstacle: Turn Left, Turn Left, Advance (TL, TL, A)
									rumba.turnRobot('TL');
									rumba.turnRobot('TL');
									step4 = rumba.advanceRobot();
									if (step4 === false) {
										//If that also hits and obstacle: Turn Right, Back, Turn Right, Advance (TR, B, TR, A)
										rumba.turnRobot('TR');
										rumba.backRobot();
										rumba.turnRobot('TR');
										step5 = rumba.advanceRobot();
										if (step5 === false) {
											//If that also hits and obstacle: Turn Left, Turn Left, Advance (TL, TL, A)
											rumba.turnRobot('TL');
											rumba.turnRobot('TL');
											step6 = rumba.advanceRobot();
											if (step6 === false) {
												//If an obstacle is hit again the robot will stop and return.
												rumba.turnOffRobot();
											}
										}
									}
								}
							}
						}
						break;
					case 'C':
						//Clean
						rumba.cleanRobot();
						break;
				}
			}
		};


	rumba.cleanDuplicated();

	exportRumba.visited= [];
	exportRumba.cleaned= [];
	exportRumba.Final= [];

	if (process.argv[3]) {
		exportRumba.pushExport(rumba.visited, rumba.cleaned, rumba.loc_X, loc_Y, rumba.facing, rumba.battery);
		try {
			fs.writeFileSync('./'+process.argv[3], JSON.stringify(exportRumba, null, 2) , 'utf-8'); 
			console.log('Process successfully completed, into the file: '+process.argv[3]);
		} catch (err) {
		    console.log('Error writing .json:' + err.message)
		}
	} else {
		exportRumba.pushExport(rumba.visited, rumba.cleaned, rumba.loc_X, loc_Y, rumba.facing, rumba.battery);
		try {
		fs.writeFileSync('./data.json', JSON.stringify(exportRumba, null, 2) , 'utf-8'); 
		console.log('Process successfully completed');
		} catch (err) {
		    console.log('Error writing .json:' + err.message)
		}
		
	}




	})




} catch (e) {
    // It isn't accessible
}	console.log('The file does not exist or is not accessible');
}


