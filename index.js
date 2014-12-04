var DelLProjector = require("./dellproj"); // Require our helper library
var dell = new DelLProjector(); // Create a new instance of it

dell.setIPAddress("10.13.0.29"); // Replace this with the IP address of your projector
dell.connect(); // Connect

dell.on('connected', function(ipaddress, port) { // If we're connected, send a command!
	console.log("Connected to " + ipaddress + " on port " + port + ". Sending command ..");
	dell.sendCommand(dell.commands.power.on);
});

dell.on('connecting', function(ipaddress, port) { // If we're connecting still, let us know. 
	console.log("Connecting to " + ipaddress + " on port " + port);
});