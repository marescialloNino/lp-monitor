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
        const records = await (0, csvService_1.generateMeteoraCSV)(walletAddress, meteoraPositions);
        return records;
    }
    else {
        console.log(`No Meteora positions found for ${walletAddress}`);
        return [];
    }
}
async function processEvmWallet(walletAddress) {
    console.log(`Processing EVM wallet: ${walletAddress}`);
    const krystalPositions = await (0, krystalPositionService_1.retrieveKrystalPositions)(walletAddress);
    if (krystalPositions.length > 0) {
        const records = await (0, csvService_1.generateKrystalCSV)(walletAddress, krystalPositions);
        return records;
    }
    else {
        console.log(`No Krystal positions found for ${walletAddress}`);
        return [];
    }
}
async function main() {
    console.log('Starting lp-monitor batch process...');
    // Accumulate records for latest CSVs
    let allMeteoraRecords = [];
    let allKrystalRecords = [];
    // Process Solana wallets
    for (const solWallet of config_1.config.SOLANA_WALLET_ADDRESSES) {
        const meteoraRecords = await processSolanaWallet(solWallet);
        allMeteoraRecords = allMeteoraRecords.concat(meteoraRecords);
    }
    // Write all Meteora latest positions
    if (allMeteoraRecords.length > 0) {
        await (0, csvService_1.writeMeteoraLatestCSV)(allMeteoraRecords);
        console.log(`Wrote ${allMeteoraRecords.length} Meteora positions to latest CSV`);
    }
    else {
        console.log('No Meteora positions found across all wallets');
    }
    // Process EVM wallets
    for (const evmWallet of config_1.config.EVM_WALLET_ADDRESSES) {
        const krystalRecords = await processEvmWallet(evmWallet);
        allKrystalRecords = allKrystalRecords.concat(krystalRecords);
    }
    // Write all Krystal latest positions
    if (allKrystalRecords.length > 0) {
        await (0, csvService_1.writeKrystalLatestCSV)(allKrystalRecords);
        console.log(`Wrote ${allKrystalRecords.length} Krystal positions to latest CSV`);
    }
    else {
        console.log('No Krystal positions found across all wallets');
    }
    // Write combined liquidity profile for all Meteora positions
    if (allMeteoraRecords.length > 0) {
        const allMeteoraPositions = await (0, meteoraPositionService_1.retrieveMeteoraPositions)(config_1.config.SOLANA_WALLET_ADDRESSES.join(',')); // Adjust if needed
        await (0, csvService_1.generateAndWriteLiquidityProfileCSV)('all_wallets', allMeteoraPositions);
    }
    else {
        console.log('No Meteora positions found across all wallets for liquidity profile');
    }
    console.log('Batch process completed.');
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('Error in batch process:', error);
    process.exit(1);
});
