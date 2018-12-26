'use strict';
/**
 * ตัวอย่างแสดงวิธีในการใช้ Asset Registry ในการเพิ่ม instance ใหม่ 
 * code นี้จะเพิ่ม contrace จํานวน 2 instance โดยใช้ฟังก์ชั่น addAll() ของคลาส AssetRegistry
 *
 * ข้อพึงระวัง หากในระบบมี contrace หมายเลข = CONT02 | CONT03 อยู่แล้ว * code ต่อไปนี้จะ error เพราะมันจะซ้ํากัน
 *
 * สิ่งที่คุณต้องเตรียมตัวก่อนรัน code ชุดนี้
 * =============================
 * 1. Start the fabric
 * 2. Deploy & start pupshipping application
 *
 * ้นตอนการทํางานจริง
 * ==========
 * 1. ใช้ connection-util เพื่อเชื่อมต่อกับ pupshipping application
 * 2. เรียกใช้ AssetRegistry จาก connection
 * 3. สร้าง contrace จํานวน 2 instances โดยใช้ factory & initialize 
 * 4. เรียกใช้ฟังก์ชั่น registry.addAll([Array of contract instances]) 
 */

const contractNamespace = 'org.pup.shipping.contract';
const contractType = 'Contract';
const participantNamepace = 'org.pup.shipping.participant';
// 1. Connect
const bnUtil = require('./connection-util');
bnUtil.connect(main);

function main(error) {
    // Check for the connection error 
    if (error) {
        console.log(error);
        process.exit(1);
    }

    // 2. เรียกใช้ AssetRegistry จาก connection 
    return bnUtil.connection.getAssetRegistry(contractNamespace + '.' + contractType).then((registry) => {
        console.log('1. ได้รับ Registry: ', registry.id);
        // Utility method for adding the aircrafts 
        addAircrafts(registry);
    }).catch((error) => {
        console.log(error);
        // bnUtil.disconnect();
    });
}

/**
 * 3. สร้าง contrace จํานวน 2 instances CONT02 & CONT03 
 * * @param {*} registry This is of type AssetRegistry 
 */
function addAircrafts(registry) {
    // This Array will hold the instances of aircraft resource 
    let contracts = [];
    const bnDef = bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();

    const shipper = factory.newRelationship(participantNamepace, 'Shipper', 'shipper@example.com');
    const grower = factory.newRelationship(participantNamepace, 'Grower', 'grower@example.com');
    const importer = factory.newRelationship(participantNamepace, 'Importer', 'toms@example.com');

    // Instance#1
    let contractResource = factory.newResource(contractNamespace, contractType, 'CONT02');
    contractResource.setPropertyValue('grower', grower);
    contractResource.setPropertyValue('shipper', shipper);
    contractResource.setPropertyValue('importer', importer);
    contractResource.setPropertyValue('arrivalDateTime', new Date('2019-11-26T21:44Z'));
    contractResource.setPropertyValue('unitPrice', 20);
    contractResource.setPropertyValue('minTemperature', 15);
    contractResource.setPropertyValue('maxTemperature', 37);
    contractResource.setPropertyValue('minPenaltyFactor', 1.0);
    contractResource.setPropertyValue('maxPenaltyFactor', 2.5);
    // Push instance to the aircrafts array
    contracts.push(contractResource);

    // Instance#2 
    contractResource = factory.newResource(contractNamespace, contractType, 'CONT03');
    // You may use direct assignment instead of using the setPropertyValue() 
    contractResource.grower = grower;
    contractResource.shipper = shipper;
    contractResource.importer = importer;
    contractResource.arrivalDateTime = new Date('2019-09-26T21:44Z');
    contractResource.unitPrice = 15;
    contractResource.minTemperature = 15.5;
    contractResource.maxTemperature = 27.8;
    contractResource.minPenaltyFactor = 1.0;
    contractResource.maxPenaltyFactor = 3.23;
    // Push instance to the contracts array 
    contracts.push(contractResource);

    // 4. Add the contracts resource to the registry 
    return registry.addAll(contracts).then(() => {
        console.log('เพิ่ม contrace ทั้ง 2 ตัวสําเร็จแล้ว!!!');
        bnUtil.disconnect();
    }).catch((error) => {
        console.log(error);
        bnUtil.disconnect();
    });
}