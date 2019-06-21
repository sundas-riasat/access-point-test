
/*********
 *  
Name: Access Point Testing
Slug: access-point-testing
Description: Tests the functioning of node-wifi and node-createap libraries of npm
Author: Sundas Riasat
 *
*********/

var wifi = require('node-wifi');
var CAP = require('node-createap');

//wifi initialization

wifi.init({
    iface: 'wlan0'
});

var count = 1;

//function to test the functionality of resetting AP

function createAP() {
    let createap = new CAP({
        path: 'create_ap',
        options: '--daemon -n --isolate-clients -m nat --no-virt --hostapd-debug 2 --no-haveged -g 192.168.11.1 -c 1 --country US', // --hidden
        //silent: true,
        wirelessInterface: 'wlan0',
        wiredInterface: 'eth0',
        wifiApName: 'MyAPNet',
        wifiWPA: '123456789'
    });
    //checking if already conected to wifi
    wifi.getCurrentConnections(function (err, currentConnections) {
        if (err) {
            console.log(err);
        }
        else {
            if (currentConnections.length > 0) {
                //disconnect if already connected
                wifi.disconnect(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Disconnected');
                        //start AP
                        createap.start(function (msg) {
                            console.log(msg);
                            //when done, list running instances of AP
                            createap.listRunning(function (msg) {
                                console.log(msg);
                            });
                            //Kill running instance of AP
                            createap.stop(function (msg2) {
                                console.log(msg2);
                                //When done, delete the local createap instance and list running instances after 4s
                                setTimeout(() => {
                                    delete createap;
                                    createap.listRunning(function (msg) {
                                        console.log(msg);
                                    });
                                    //makes recursive call only 5 times and exits
                                    if (count < 5) {
                                        createAP();
                                        count++;
                                    }
                                    else {
                                        process.exit;
                                    }
                                }, 4000);
                            })
                        });
                    }
                });
            }
            else {
                //start AP
                createap.start(function (msg) {
                    console.log(msg);
                    //when done, list running instances of AP
                    createap.listRunning(function (msg) {
                        console.log(msg);
                    });
                    //Kill running instance of AP
                    createap.stop(function (msg2) {
                        console.log(msg2);
                        //When done, delete the local createap instance and list running instances after 4s
                        setTimeout(() => {
                            delete createap;
                            createap.listRunning(function (msg) {
                                console.log(msg);
                            });
                            //makes recursive call only 5 times and exits
                            if (count < 5) {
                                createAP();
                                count++;
                            }
                            else {
                                process.exit;
                            }
                        }, 4000);
                    })
                });
            }
        }
    });
}

//finally make a function call
createAP();