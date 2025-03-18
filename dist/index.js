"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const config_1 = require("./config");
const meteoraPositionService_1 = require("./services/meteoraPositionService");
const krystalPositionService_1 = require("./services/krystalPositionService");
const csvService_1 = require("./services/csvService");
async function processSolanaWallet(walletAddress) {
    console.log(`Processing Solana wallet: ${walletAddress}`);
    const meteoraPositions = await (0, meteoraPositionService_1.retrieveMeteoraPositions)(walletAddress);
    if (meteoraPositions.length > 0) {
        await (0, csvService_1.generateAndWriteMeteoraCSV)(walletAddress, meteoraPositions);
    }
    else {
        console.log(`No Meteora positions found for ${walletAddress}`);
    }
    return meteoraPositions;
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
    console.log('Starting lp-monitor batch process...');
    // Aggregate all Meteora positions for liquidity profile
    let allMeteoraPositions = [];
    for (const solWallet of config_1.config.SOLANA_WALLET_ADDRESSES) {
        const positions = await processSolanaWallet(solWallet);
        allMeteoraPositions = allMeteoraPositions.concat(positions);
    }
    // Write combined liquidity profile for all wallets
    if (allMeteoraPositions.length > 0) {
        await (0, csvService_1.generateAndWriteLiquidityProfileCSV)('all_wallets', allMeteoraPositions); // 'all_wallets' is a placeholder
    }
    else {
        console.log('No Meteora positions found across all wallets for liquidity profile');
    }
    // Process EVM wallets
    for (const evmWallet of config_1.config.EVM_WALLET_ADDRESSES) {
        await processEvmWallet(evmWallet);
    }
    console.log('Batch process completed.');
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('Error in batch process:', error);
    process.exit(1);
});
