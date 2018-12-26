'use strict';

/**
 * แสดงวิธีดึงข้อมูล registry ผ่าน getter functions
 * 1. เชื่อมต่อกับ pupshipping application
 * 2. Get & Print the Asset Registries
 * 3. Get & Print the Participant Registries
 * 4. Get & Print the Transaction Registries
 * 5. Get & Print the Historian Registry
 * 6. Get & Print the Identity Registriy
 */

// 1. เชื่อมต่อกับ pupshipping application
const bnUtil = require('./connection-util');
bnUtil.connect(main);

function main(error) {
    // Check for the connection error
    if (error) {
        console.log(error);
        process.exit(1);
    }
    // * 2. Get & Print the Asset Registries
    bnUtil.connection.getAllAssetRegistries().then((registries) => {
        console.log("Registries");
        console.log("==========");
        printRegistry(registries);
        // 3. Get & Print the Participant Registries
        return bnUtil.connection.getAllParticipantRegistries();
    }).then((registries) => {
        printRegistry(registries);
        // 4. Get all the transaction Registries
        return bnUtil.connection.getAllTransactionRegistries();
    }).then((registries) => {
        printRegistry(registries);
        // 5. Get & Print the Transaction Registries
        return bnUtil.connection.getHistorian();
    }).then((registry) => {
        console.log("Historian Registry: ", registry.registryType, " ", registry.id);
        // 6. Get the Identity Registry
        return bnUtil.connection.getIdentityRegistry();
    }).then((registry) => {
        console.log("Identity Registry: ", registry.registryType, " ", registry.id);
        bnUtil.connection.disconnect();
    }).catch((error) => {
        console.log(error);
        bnUtil.connection.disconnect();
    });
}
// Utility function to print information about the registry
function printRegistry(registryArray) {
    registryArray.forEach((registry) => {
        console.log(registry.registryType, " ", registry.id);
    });
}