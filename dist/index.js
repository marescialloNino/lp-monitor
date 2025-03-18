"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const config_1 = require("./config");
const meteoraPositionService_1 = require("./services/meteoraPositionService");
const krystalPositionService_1 = require("./services/krystalPositionService");
const csvService_1 = require("./services/csvService");
const scheduler_1 = require("./services/scheduler");
async function processSolanaWallet(walletAddress) {
    console.log(`Processing Solana wallet: ${walletAddress}`);
    const meteoraPositions = await (0, meteoraPositionService_1.retrieveMeteoraPositions)(walletAddress);
    if (meteoraPositions.length > 0) {
        await (0, csvService_1.generateAndWriteMeteoraCSV)(walletAddress, meteoraPositions);
        await (0, csvService_1.generateAndWriteLiquidityProfileCSV)(walletAddress, meteoraPositions);
    }
    else {
        console.log(`No Meteora positions found for ${walletAddress}`);
    }
}
async function processEvmWallet(walletAddress) {
    console.log(`Processing EVM wallet: ${walletAddress}`);
    const krystalPositions = await (0, krystalPositionService_1.retrieveKrystalPositions)(walletAddress);
    if (krystalPositions.length > 0) {
        await (0, csvService_1.generateAndWriteKrystalCSV)(walletAddress, krystalPositions);
    }
    else {
        console.log(`No Krystal positions found for ${walletAddress}`);
    }
}
async function main() {
    console.log('Starting lp-monitor...');
    // Process Solana wallets
    for (const solWallet of config_1.config.SOLANA_WALLET_ADDRESSES) {
        await processSolanaWallet(solWallet);
    }
    // Process EVM wallets
    for (const evmWallet of config_1.config.EVM_WALLET_ADDRESSES) {
        await processEvmWallet(evmWallet);
    }
    // Start the scheduler
    (0, scheduler_1.startScheduler)();
}
main().catch((error) => {
    console.error('Error in main:', error);
    process.exit(1);
});
