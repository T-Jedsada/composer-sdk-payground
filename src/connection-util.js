'use strict';

/**
 * Utilitiy Module ตัวนี้มี function ให้ใช้งานดังต่อไปนี้:
 * 1. connect - ใช้ callback function เป็น argument 
 *    if Success : execute callback()
 *    else : execute callback(error)
 * 2. disconnect
 * 3. ping - ใช้ callback(response, error) เป็น argument execute callback.
 * เป้าหมายของ utility ชุดนี้: 
 * เป็น common code ที่จะถูกเรียกใช้บ่อย ดังนั้น จึงรวบรวมมาวางไว้ที่เดียวเพื่อให้ code ส่วนอื่นดู clean
 * คุณสามารถเปลี่ยนค่า cardName เป็นชื่อของ network admin card ที่คุณต้องการใช้เพื่อเชื่อมต่อ 
 * กับ app. ของคุณเอง
 */
module.exports = {
    // เตรียม instance ทั้งหลายที่จําเป็นสําหรับ BusinessNetworkConnection 
    cardStore: require('composer-common').FileSystemCardStore,
    BusinessNetworkConnection: require('composer-client').BusinessNetworkConnection,
    // ใช้ในฟังก์ชั่น connect()
    // โปรดแก้ข้อมูลในตัวแปรนี้ให้ตรงกับ app. ของคุณ 
    cardName: "admin@pupshipping",
    // ตัวแปร Business Network Connection ระดับ module level 
    connection: {},
    // 1. ฟังก์ชั่น connect เป็นฟังก์ชั่นหลักที่จะถูกระบบภายนอกเรียกใช้ 
    connect: function (callback) {
        // สร้าง instance ของ cardStore แบบ file system
        this.connection = new this.BusinessNetworkConnection({
            cardStore: this.cardStore
        });
        // connect
        return this.connection.connect(this.cardName).then(function () {
            callback();
        }).catch((error) => {
            callback(error);
        });
    },
    // 2. Disconnects 
    disconnect: function (callback) {
        this.connection.disconnect();
    },
    // 3. Pings the network 
    ping: function (callback) {
        return this.connection.ping().then((response) => {
            callback(response);
        }).catch((error) => {
            callback({}, error);
        });
    }
}