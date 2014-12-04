var util = require("util"); // As part of our EventEmitter code
var EventEmitter = require("events").EventEmitter; // For emitting events so other node.js libraries and code can react to what we're doing here
var net = require('net'); // Our network library
var client = new net.Socket(); // And a client version of our network socket

util.inherits(DellProjector, EventEmitter); // Let DellProjector inherit everything EventEmitter can do, so we can call this.emit('blah');

var base = [0x05, 0x00, 0x06, 0x00, 0x00, 0x03, 0x00]; // This prefixes all commands sent to the projector, so we write it here for brevity of code later
var payload = []; // What we're about to send
var ipAddress; // The IP address we're connected to
var port = 41794; // And the port

// A list of commands we can send to the projector. There might be tons of other options on newer / older projectors, so if you have
// a projector that has a feature you can't control, please visit http://github.com/Grayda and let me know so I can add it in for you!
var commands = { 
	input: { // Input sources
		vgaa: [0xcd, 0x13], // VGA Port A
		vgab: [0xce, 0x13], // VGA Port B
		composite: [0xcf, 0x13], // Composite (Red, Yellow, White)
		svideo: [0xd0, 0x13], // S-video
		hdmi: [0xd1, 0x13], // There is no 0xd2, so perhaps it's DVI / DisplayPort or another type of input that appears on other projectors
		wireless: [0xd3, 0x13], // Wi-Fi video source
		usbdisplay: [0xd4, 0x13], // For devices that output display via USB (?)
		usbviewer: [0xd5, 0x13], // For projectors that allow you to plug in a USB and show content from it (?)
	},
	volume: { // AFAIK there is no option to set the volume to a value, you have to keep +/- until you get somewhere
		up: [0xfa, 0x13],
		down: [0xfb, 0x13],
		mute: [0xfc, 0x13],
		unmute: [0xfd, 0x13],
	},
	power: {
		on: [0x04, 0x00],
		off: [0x05, 0x00],
	},
	menu: {
		menu: [0x1d, 0x14],
		up: [0x1e, 0x14],
		down: [0x1f, 0x14],
		left: [0x20, 0x14],
		right: [0x21, 0x14],
		ok: [0x23, 0x14],
	},
	picture: {
		mute: [0xee, 0x13], // Blanks the screen
		unmute: [0xef, 0x13], // Unblanks the screen
		freeze: [0xf0, 0x13], // Stops updating the screen, freezing the last frame that was shown
		unfreeze: [0xf1, 0x13], // Resumes updating the screen
		contrast: {
			up: [0xf6, 0x13],
			down: [0xf7, 0x13],
		},
		brightness: {
			up: [0xf5, 0x13],
			down: [0xf4, 0x13],
		}
	}
}

function DellProjector() { // The various events our library emits
	client.on('data', function(data) {
		this.emit('data', data);
	}.bind(this));
	
	client.on('connect', function() {
		this.emit('connected', ipAddress, port);
	}.bind(this));
 
	client.on('close', function() {
		this.emit('closed');
	}.bind(this));	
}

/* Setting up options */

DellProjector.prototype.setIPAddress = function(ip) {
	this.emit('ipaddresschanged', ipAddress, ip);
	ipAddress = ip;
}

DellProjector.prototype.setPort = function(sPort) {
	this.emit('portchanged', port, sPort);
	port = sPort;
}

DellProjector.prototype.connect = function() {
	client.connect(port, ipAddress, function() {
		this.emit('connecting', ipAddress, port);
	}.bind(this));
}

/* -------------------- */

DellProjector.prototype.disconnect = function() {
	client.destroy();	
}

DellProjector.prototype.commands = commands;
DellProjector.prototype.ipAddress = ipAddress;
DellProjector.prototype.port = port;

DellProjector.prototype.sendCommand = function sendCommand(command) {
	payload = []; // Clear our payload
	payload = payload.concat(base, command); // combine our command with our base data
	client.write(new Buffer(payload)); // And send it off as a new buffer
	this.emit('commandsent', command, ipAddress, port); // Let the world know we've done that.
}

module.exports = DellProjector;