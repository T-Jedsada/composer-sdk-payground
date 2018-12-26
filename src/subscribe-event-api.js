/** 
 * สิ่งที่คุณต้องเตรียมตัวก่อนรัน code ชุดนี้ 
 * 1. Start the fabric 
 * 2. Deploy & start pupshipping application *  
 * 
 * Demonstrates event subscription on HL fabric. 
 * 1. Create the business network connection 
 * 2. Subscribe to event stream - as of Jan 2017, criteria based subscription is not available 
 * https://hyperledger.github.io/composer/applications/subscribing-to-events.html 
 * 3. Filter event  
 * 4. If Receieved event = TemperatureRead then process it otherwise ignore
 * 
 * To Test: 
 * 1. In REST server interface, initiate the TemperatureReading transaction
 **/

const bnUtil = require('./connection-util');

// #1 Connect to the pupshipping
bnUtil.cardName = 'admin@pupshipping';
bnUtil.connect(main);
var counter = 0;

function main(error) {
    console.log("Event subscription started for: TemperatureRead event!!");
    console.log("Received:")
    // #2 Subscribe to event    
    bnUtil.connection.on('event', (event) => {
        var namespace = event.$namespace;
        var eventtype = event.$type;
        var fqn = namespace + '.' + eventtype;
        // #3 Filter the events
        switch(fqn) {
            case 'org.pup.shipping.shipment.TemperatureRead':
            // #3 Process the event                    
            counter++;
            console.log('Event#', counter);
            processTemperatureReadEvent(fqn, event);
            break;
            default:
            console.log("Ignored event: ", fqn);
        }
    });
}

/** 
 * This is the event processing function that can be coded to carry out any action 
 * that the subscriber intends to take. E.g., when the temperature is sending 
 * @param {*} fqn  * @param {*} event  
 */
function processTemperatureReadEvent(fqn, event) {
    // For demo purpose the information is getting printed on the 
    consoleconsole.log(fqn, ' ', event.shipmentId, ' ', event.timestamp, ' ', event.eventId);
    console.log();
}