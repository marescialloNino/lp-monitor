"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndWriteKrystalCSV = exports.generateAndWriteLiquidityProfileCSV = exports.generateAndWriteMeteoraCSV = void 0;
// src/services/csvService.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_writer_1 = require("csv-writer");
function getMeteoraCsvPath(walletAddress) {
    return path_1.default.join(__dirname, `../../LP_meteora_positions_${walletAddress}.csv`);
}
function getLiquidityProfileCsvPath(walletAddress) {
    return path_1.default.join(__dirname, `../../liquidity_profile_${walletAddress}.csv`);
}
function getKrystalCsvPath(walletAddress) {
    return path_1.default.join(__dirname, `../../LP_krystal_positions_${walletAddress}.csv`);
}
async function writeCSV(filePath, records, headers) {
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: filePath,
        header: headers,
        append: fs_1.default.existsSync(filePath),
    });
    await csvWriter.writeRecords(records);
    console.log(`CSV written to ${filePath} with ${records.length} rows`);
}
// Helper function to calculate human-readable quantity
function calculateQuantity(rawAmount, decimals) {
    return parseFloat(rawAmount) / Math.pow(10, decimals);
}
async function generateAndWriteMeteoraCSV(walletAddress, positions) {
    const headers = [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'positionKey', title: 'Position Key' },
        { id: 'poolAddress', title: 'Pool Address' },
        { id: 'tokenXAddress', title: 'Token X Address' },
        { id: 'tokenYAddress', title: 'Token Y Address' },
        { id: 'amountX', title: 'Token X Qty' },
        { id: 'amountY', title: 'Token Y Qty' },
        { id: 'lowerBinId', title: 'Lower Boundary' },
        { id: 'upperBinId', title: 'Upper Boundary' },
        { id: 'isInRange', title: 'Is In Range' },
        { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
        { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
    ];
    const records = positions
        .filter(pos => !(pos.amountX === '0' && pos.amountY === '0'))
        .map(pos => ({
        timestamp: new Date().toISOString(),
        positionKey: pos.id,
        poolAddress: pos.pool,
        tokenXAddress: pos.tokenX,
        tokenYAddress: pos.tokenY,
        amountX: pos.amountX,
        amountY: pos.amountY,
        lowerBinId: pos.lowerBinId,
        upperBinId: pos.upperBinId,
        isInRange: pos.isInRange,
        unclaimedFeeX: pos.unclaimedFeeX,
        unclaimedFeeY: pos.unclaimedFeeY,
    }));
    await writeCSV(getMeteoraCsvPath(walletAddress), records, headers);
}
exports.generateAndWriteMeteoraCSV = generateAndWriteMeteoraCSV;
async function generateAndWriteLiquidityProfileCSV(walletAddress, positions) {
    const headers = [
        { id: 'positionId', title: 'Position ID' },
        { id: 'binId', title: 'Bin ID' },
        { id: 'price', title: 'Price' },
        { id: 'positionLiquidity', title: 'Position Liquidity' },
        { id: 'positionXAmount', title: 'Position X Amount' },
        { id: 'positionYAmount', title: 'Position Y Amount' },
        { id: 'liquidityShare', title: 'Liquidity Share' },
    ];
    const records = positions.flatMap(pos => pos.liquidityProfile.map(entry => ({
        positionId: pos.id,
        binId: entry.binId,
        price: entry.price,
        positionLiquidity: entry.positionLiquidity,
        positionXAmount: entry.positionXAmount,
        positionYAmount: entry.positionYAmount,
        liquidityShare: entry.liquidityShare,
    })));
    await writeCSV(getLiquidityProfileCsvPath(walletAddress), records, headers);
}
exports.generateAndWriteLiquidityProfileCSV = generateAndWriteLiquidityProfileCSV;
async function generateAndWriteKrystalCSV(walletAddress, positions) {
    const headers = [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'chain', title: 'Chain' },
        { id: 'protocol', title: 'Protocol' },
        { id: 'poolAddress', title: 'Pool Address' },
        { id: 'tokenXAddress', title: 'Token X Address' },
        { id: 'tokenXQty', title: 'Token X Qty' },
        { id: 'tokenYAddress', title: 'Token Y Address' },
        { id: 'tokenYQty', title: 'Token Y Qty' },
        { id: 'minPrice', title: 'Min Price' },
        { id: 'maxPrice', title: 'Max Price' },
        { id: 'currentPrice', title: 'Current Price' },
        { id: 'isInRange', title: 'Is In Range' },
        { id: 'initialValueUsd', title: 'Initial Value USD' },
        { id: 'actualValueUsd', title: 'Actual Value USD' },
        { id: 'impermanentLoss', title: 'Impermanent Loss' },
        { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
        { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
        { id: 'feeApr', title: 'Fee APR' },
    ];
    const records = positions.map(pos => ({
        timestamp: new Date().toISOString(),
        chain: pos.chain,
        protocol: pos.protocol,
        poolAddress: pos.poolAddress,
        tokenXAddress: pos.tokenXAddress,
        tokenXQty: calculateQuantity(pos.tokenXAmount, pos.tokenXDecimals),
        tokenYAddress: pos.tokenYAddress,
        tokenYQty: calculateQuantity(pos.tokenYAmount, pos.tokenYDecimals),
        minPrice: pos.minPrice,
        maxPrice: pos.maxPrice,
        currentPrice: pos.currentPrice,
        isInRange: pos.isInRange,
        initialValueUsd: pos.initialValueUsd,
        actualValueUsd: pos.actualValueUsd,
        impermanentLoss: pos.impermanentLoss,
        unclaimedFeeX: calculateQuantity(pos.unclaimedFeeX, pos.tokenXDecimals),
        unclaimedFeeY: calculateQuantity(pos.unclaimedFeeY, pos.tokenYDecimals),
        feeApr: pos.feeApr,
    }));
    await writeCSV(getKrystalCsvPath(walletAddress), records, headers);
}
exports.generateAndWriteKrystalCSV = generateAndWriteKrystalCSV;
