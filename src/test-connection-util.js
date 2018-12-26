'use strict';
/**
 * code ชุดนี้ใช้สําหรับทดสอบ connection-util.js
 * และแสดงถึงวิธีในการใช้งาน connection-util.js 
 */
const bnUtil = require('./connection-util');

// ฟังก์ชั่น connect() ใช้ในการสร้าง instance ของ BusinessNetworkConnection// โดยเราจะต้องเตรียม callback function ไว้ด้วย
// ใน code ตัวอย่างนี้ เราจะใช้ฟังก์ชั่น main ทําหน้าที่ callback function
bnUtil.connect(main);

// Callback function passed to the BN Connection utility
// Error has value if there was an error in connect()
function main(error) {
    // 1. Check for the connection error
    if (error) {
        console.log(error);
        process.exit(1);
    }

    console.log("1. เชื่อมต่อสําเร็จ !!!");

    // 2. Lets ping
    bnUtil.ping((response, error) => {
        if (error) {
            console.log(error);
        } else {
            console.log("2. ได้รับการตอบรับจาก ping:");
            console.log(response);
        }
        // 3. Disconnect
        bnUtil.disconnect();
        console.log("3. ตัดการเชื่อมต่อ");
    });
}