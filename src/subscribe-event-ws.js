/** 
 * สิ่งที่คุณต้องเตรียมตัวก่อนรัน code ชุดนี้ 
 * 1. Launch Fabric - Deploy pupshipping application 
 * 2. Launch REST Server
 * 
 * Uses the NPM library for websockets
 * https://www.npmjs.com/package/websocket
 * Demonstrates how applications can subscribe to the events
 * 
 * published by the REST server
 * 1. Setup the websocket library (npm install websocket --save) ... already done 
 * 2. Create a websocket client object
 */
var counter = 0;
// #1 Need to use the websocket library
var WebSocketClient = require('websocket').client;

// #2 Create a WS Clientvar 
client = new WebSocketClient();

// #3 Setup the WS connection failure listener
client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

// #4 Setup the on connection listener
client.on('connect', (connection) => {
    console.log("Connected to REST-Server over WS protocol!!!");
    // #5 Subscribe to messages received on WS 
    connection.on('message', (msg) => {
        var event = JSON.parse(msg.utf8Data);
        // #6 Filter the 
        events
        switch (event.$class) {
            case 'org.pup.shipping.shipment.TemperatureRead':
                counter++;
                console.log('Event#', counter);
                processFlightCreatedEvent(event);
                break;
            default:
                console.log("Ignored event: ", event.$class);
        }
    })
})

// #7 Call connect with URL to the REST Server
client.connect('ws://localhost:3000');

// #8 Gets called every time an event is receieved
function processFlightCreatedEvent(event) {
    console.log('Received event:')
    // Pretty printing the received JSON string
    console.log(JSON.stringify(event, null, 4));
}