'use strict';
/**
 * https://hyperledger.github.io/composer/latest//api/common-businessnetworkdefinition * https://hyperledger.github.io/composer/latest//api/admin-adminconnection
 *
 * แสดงวิธีใช้คลาส AdminConnection ในการอัพเดต Application
 *
 * 1. สร้าง instance ของ AdminConnection
 * 2. เชื่อมต่อโดยใช้ card ของ Network Admin
 * 3. สร้าง instance ของ BusinessNetworkDefinition 
 * 4. อัพเดต model ของ pupshipping ในช่วง runtime
 * 5. ตัดการเชื่อมต่อ
 */
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const cardNameForPeerAdmin = "PeerAdmin@hlfv1";
const appName = "pupshipping";

// สถานที่เก็บเวอร์ชั่นใหม่ของ archive file ของ pupshipping
// เปลี่ยนข้อมูลตรงนี้ให้ตรงกับโปรเจ็กท์ที่คุณเก็บไฟล์ archive ไว้
const bnaDirectory = "/Users/pup/projects/pupshipping/";

// 1. สร้าง instance ของ AdminConnection
var walletType = {
    type: 'composer-wallet-filesystem'
}
const adminConnection = new AdminConnection(walletType);

// 2. เชื่อมต่อโดยใช้ card ของ Network Admin
return adminConnection.connect(cardNameForPeerAdmin).then(function () {
    console.log("Peer Admin เชื่อมต่อสําเร็จแล้ว!!!");
    // Upgrade เวอร์ชั่นให้กับ Business Network Application
    upgradeApp();
}).catch(function (error) {
    console.log(error);
});

/**
 * Deploys network app โดยใช้ AdminConnection */
function upgradeApp() {
    // 3. สร้าง instance ของ BusinessNetworkDefinition
    var bnaDef = {}
    BusinessNetworkDefinition.fromDirectory(bnaDirectory).then(function (definition) {
        bnaDef = definition;
        console.log("สร้าง BusinessNetworkDefinition สําเร็จ!!! ", bnaDef.getName())
        // Install the new version of the BNA return adminConnection.install(bnaDef); 
    }).then(() => {
        // 4. อัพเดต model ของ pupshipping ในช่วง runtime
        // หากเครื่องของคุณไม่ได้ install Application ไว้ ขั้นตอนนี้จะเกิด error console.log("ติดตั้งแอพสําเร็จ")
        return adminConnection.upgrade(appName, '0.0.5');
    }).then(() => {
        console.log('อัพเดตแอพสําเร็จ!! ', bnaDef.getName(), ' ', bnaDef.getVersion()); // 5. ตัดการเชื่อมต่อ
        adminConnection.disconnect();
    }).catch(function (error) {
        console.log(error);
    });
}