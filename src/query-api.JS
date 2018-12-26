'use strict';
/** 
 * สิ่งที่คุณต้องเตรียมตัวก่อนรัน code ชุดนี้
 * 1. Launch Fabric - Deploy pupshipping application 
 * 
 * แสดงการ query ด้วยการใช้ API ใน Client module : query & buildQuery 
 * 1. Create the Client Connection
 * 2. Execute a Named Query using Client Module : query()
 * 3. Create a Dynamic Query using Client Module : buildQuery() 
 * 4. Execute the Query 
 */

const bnUtil = require('./connection-util');

// #1 Connect to the pupshipping
bnUtil.cardName = 'admin@pupshipping';
bnUtil.connect(main);

function main(error) {
    // #2 Execute the named query : AllShipments
    return bnUtil.connection.query('AllShipments').then((results) => {
        console.log('มี Shipment ทั้งสิ้น:', results.length)
        var statement = 'SELECT  org.pup.shipping.shipment.Shipment WHERE (shipmentId == _$id)';
        // #3 Build the query object
        return bnUtil.connection.buildQuery(statement);
    }).then((qry) => {
        // #4 Execute the queryreturn 
        bnUtil.connection.query(qry, {
            id: 'SHIP_001'
        });
    }).then((result) => {
        console.log('มี Shipment ทั้งสิ้น:', result.length);
        if (result.length > 0) console.log(result[0].shipmentId);
        bnUtil.connection.disconnect();
    }).catch((error) => {
        console.log(error);
        bnUtil.connection.disconnect();
    });
}