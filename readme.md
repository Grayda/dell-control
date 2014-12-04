dell-control
============

A small utility that lets you control a Dell projector via Ethernet. Only tested with a Dell s500wi and a Dell s300wi projector, but should work with any Dell projector that has a Crestron UI.

Usage
=====

    var DelLProjector = require("./dellproj"); // Require our helper library
    var dell = new DelLProjector(); // Create a new instance of it
    
    dell.setIPAddress("192.168.1.2"); // Replace this with the IP address of your projector
    dell.connect(); // Connect
    
    dell.on('connected', function(ipaddress, port) { // When we've connected
	    dell.sendCommand(dell.commands.power.on); // Turn the projector on!
    });
    
Available commands
==================

* Input types
  * VGA A / VGA B
  * Composite
  * S-Video
  * HDMI
  * Wireless
  * USB Display
  * USB Viewer
* Volume commands
  * Up / Down
  * Mute / Unmute
* Power
  * On / Off
* Menu controls
  * Menu / Back button
  * Up
  * Down
  * Left
  * Right
  * OK
* Picture related options
  * Blank / unblank screen (mute / unmute)
  * Freeze / Unfreeze
  * Contrast Up / Down
  * Brightness Up / Down
    

To-Do
=====

- [ ] Test this with other projectors. If you have a Dell projector, please plug it in via Ethernet and try this code. Packet dumps (e.g. Wireshark) are more than welcome 
- [ ] Test this code via Wi-Fi.
- [ ] Add support for projectors other than Dell
- [ ] Add serial support for Dell projectors to allow complete customization, instead of just basic controls
- [x] Add function to close the connection