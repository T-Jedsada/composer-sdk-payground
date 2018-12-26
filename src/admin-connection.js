'use strict';

/** 
 * แสดงวิธีในการใช้คลาส AdminConnection 
 * 1. สร้าง instance ของคลาส AdminConnection 
 * 2. เชื่อมต่อโดยใช้ PeerAdmin 
 * 3. แสดงรายการของ Business Network Application ในระบบทั้งหมด 
 * 4. ตัดการเชื่อมต่อ 
 * 5. เชื่อมต่อกับ pupshipping application ในฐานะของ network admin 
 * 6. Ping pupshipping * 7. ตัดการเชื่อมต่อ 
 */

// เตรียม AdminConnection instance
const AdminConnection = require('composer-admin').AdminConnection;


// เตรียมตัวแปรที่จําเป็นทั้ง card และขื่อ application
const cardNameForPeerAdmin = "PeerAdmin@hlfv1";
const cardNameForNetworkAdmin = "admin@pupshipping";
const appToBePinged = "pupshipping";

// สร้าง instance ของคลาส AdminConnection
var walletType = {
    type: 'composer-wallet-filesystem'
}
var adminConnection = new AdminConnection(walletType);

// 2. เชื่อมต่อโดยใช้ PeerAdmin
return adminConnection.connect(cardNameForPeerAdmin).then(() => {
    console.log("Peer Admin เชื่อมต่อสําเร็จแล้ว!!!");
    // แสดงชื่อ และเวอร์ชั่นของ network application
    listBusinessNetwork();
}).catch((error) => {
    console.log(error);
});

// ดึงข้อมูลของ network application
function listBusinessNetwork() {
    // 3. แสดงรายการของ Business Network Application ในระบบทั้งหมด
    adminConnection.list().then((network) => {
        console.log("1. รายการ Network Application ทั้งหมด: ", networks);
        networks.forEach((businessNetwork) => {
            console.log('Business Network Application ชื่อ ', businessNetwork);
        });

    })
    // 4. ตัดการเชื่อมต่อ
    return adminConnection.disconnect().then(function () {
        reconnectAsNetworkAdmin();
    });
}

function reconnectAsNetworkAdmin() {
    // 5. เชื่อมต่อกับ pupshipping application ในฐานะของ network admin
    return adminConnection.connect(cardNameForNetworkAdmin).then(function (error) {
        console.log("2. เชื่อมต่อด้วย Network Admin สําเร็จ!!!");
        // 6. Ping pupshipping
        adminConnection.ping(appToBePinged).then(function (response) {
            console.log("ผลการ Ping จาก" + appToBePinged + " :", response);
            // 7. ตัดการเชื่อมต่อ
            adminConnection.disconnect();
        }).catch((error) => {
            console.log("Error=", error);
        });
    });
}