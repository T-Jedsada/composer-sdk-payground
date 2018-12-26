'use strict';

/** 
 * ขั้นตอนการเขียน code 
 * ขั้นที่ 1 สร้าง instace ของ NetworkCardStoreManager 
 * ขั้นที่ 2 สร้าง instance ของ BusinessNetworkCardStore ที่ใช้ wallet แบบ filesystem 
 * ขั้นที่ 3 ใช้ BusinessNetworkCardStore ดึงข้อมูล card จาก file ทั้งหมดแล้วพิมพ์ชื่อของมันออกทาง console 
 * ขั้นที่ 4 ใช้ BusinessNetworkCardStore ดึง card ใบแรก 
 */

// ขั้นที่ 1 สร้าง instace ของ NetworkCardStoreManager
const NetworkCardStoreManager = require('composer-common').NetworkCardStoreManager;

// ขั้นที่ 2 สร้าง instance ของ BusinessNetworkCardStore ที่ใช้ wallet แบบ filesystem
var walletType = {
    type: 'composer-wallet-filesystem'
}
const cardStore = NetworkCardStoreManager.getCardStore(walletType);

console.log('card store: ', cardStore)

// ขั้นที่ 3 ใช้ BusinessNetworkCardStore ดึงข้อมูล card จาก file ทั้งหมดแล้วพิมพ์ชื่อของมันออกทาง console
return cardStore.getAll().then(function (cardMap) {
    // พิมพ์ชื่อ card ออกมาทั้งหมด
    console.log(cardMap.keys());
    // ขั้นที่ 4 ใช้ BusinessNetworkCardStore ดึง card ใบแรก
    let firstCard = cardMap.keys().next().value
    // ดึง card ใบแรกซึ่งผลของฟังก์ชั่นนี้จะ return promise ดังนั้นดูต่อที่then()
    return cardStore.get(firstCard);
}).then(function (idCard) {
    // พิมพ์ชืือ user และชื่อของ business network application
    console.log("ข้อมูลของ card ใบแรก: ", idCard.getUserName(), ' @ ', idCard.getBusinessNetworkName());
    // พิมพ์ชื่อของ connection profile
    console.log("ชื่อของ Connection Profile: ", idCard.getConnectionProfile().name);
})