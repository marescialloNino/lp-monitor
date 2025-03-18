"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = void 0;
// src/services/scheduler.ts
const node_cron_1 = require("node-cron");
const config_1 = require("../config");
const meteoraPositionService_1 = require("./meteoraPositionService");
const krystalPositionService_1 = require("./krystalPositionService");
const csvService_1 = require("./csvService");
function startScheduler() {
    console.log(`Scheduling position retrieval every ${config_1.config.SCHEDULE_INTERVAL} minutes...`);
    (0, node_cron_1.schedule)(`*/${config_1.config.SCHEDULE_INTERVAL} * * * *`, async () => {
        try {
            // Process Solana wallets
            for (const solWallet of config_1.config.SOLANA_WALLET_ADDRESSES) {
                console.log(`Scheduled run for Solana wallet: ${solWallet}`);
                const meteoraPositions = await (0, meteoraPositionService_1.retrieveMeteoraPositions)(solWallet);
                if (meteoraPositions.length > 0) {
                    await (0, csvService_1.generateAndWriteMeteoraCSV)(solWallet, meteoraPositions);
                    await (0, csvService_1.generateAndWriteLiquidityProfileCSV)(solWallet, meteoraPositions);
                }
                else {
                    console.log(`No Meteora positions found for ${solWallet} during scheduled run`);
                }
            }
            // Process EVM wallets
            for (const evmWallet of config_1.config.EVM_WALLET_ADDRESSES) {
                console.log(`Scheduled run for EVM wallet: ${evmWallet}`);
                const krystalPositions = await (0, krystalPositionService_1.retrieveKrystalPositions)(evmWallet);
                if (krystalPositions.length > 0) {
                    await (0, csvService_1.generateAndWriteKrystalCSV)(evmWallet, krystalPositions);
                }
                else {
                    console.log(`No Krystal positions found for ${evmWallet} during scheduled run`);
                }
            }
        }
        catch (error) {
            console.error('Error in scheduled task:', error);
        }
    });
}
exports.startScheduler = startScheduler;
