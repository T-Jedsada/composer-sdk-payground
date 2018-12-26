'use strict';
/**
 * แสดงวิธีใช้งานฟังก์ชั่น factory จาก BusinessNetworkConnection * โดยใช้ฟังก์ชั่น getFactory( ) เพื่อเป็นตัวผ่านไปสู่การยิง transaction
 *
 * สิ่งที่คุณต้องเตรียมตัวก่อนรัน code ชุดนี้
 * 1. Start the fabric
 * 2. Deploy & start pupshipping application
 *
 * ขั้นตอนการทํางานจริง
 * 1. ใช้ connection-util เพื่อเชื่อมต่อกับ pupshipping application
 * 2. ดึง instance ของคลาส BusinesNetworkDefinition จาก fabric network
 * 3. เรียกใช้งาน factory จาก instance ของ BusinessNetworkdefinition ที่เพิ่งสร้างมา
 * 4. สร้าง instance ของ Transaction จาก factory
 * 5. เซคค่าในฟิลด์ต่าง ๆ ภายใน transaction object * 6. ยิง transaction
 */

// Constant values - แก้ไขได้ตามที่คุณต้องการ
const namespace = "org.pup.shipping.shipment";
const transactionType = "TemperatureReading";

// 1. เชื่อมต่อกับ pupshipping application
const bnUtil = require('./connection-util');
bnUtil.connect(main);

function main(error) {
    // Check for error if(error){
    console.log(error);
    process.exit(1);

    // 2. ดึง instance ของคลาส BusinesNetworkDefinition จาก fabric network
    let bnDef = bnUtil.connection.getBusinessNetwork();
    console.log("1. ได้รับ BNA Definition จาก Fabric Network แล้ว: ", bnDef.getName(), " ", bnDef.getVersion());

    // 3. เรียกใช้งาน factory
    let factory = bnDef.getFactory();

    // ข้อมูลตัวอย่างของ Transaction ที่จะใช้ทดสอบเป็นดังนี้
    // {
    //   "$class": "org.pup.shipping.shipment.TemperatureReading",
    //   "centigrade": 24.5,
    //   "shipment": "resource:org.pup.shipping.shipment.Shipment#SHIP_001"
    //}

    // 4. สร้าง instance ของ Transaction
    let transaction = factory.newTransaction(namespace, transactionType);

    // 5. Set up the properties of the transaction object
    const shipment001 = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
    transaction.setPropertyValue('centigrade', 24.5);
    transaction.setPropertyValue('shipment', shipment001);
    
    // 6. Submit the transaction
    return bnUtil.connection.submitTransaction(transaction).then(() => {
        console.log("2. Transaction Submitted/Processed Successfully!!")
        bnUtil.disconnect();
    }).catch((error) => {
        console.log(error);
        bnUtil.disconnect();
    });
}