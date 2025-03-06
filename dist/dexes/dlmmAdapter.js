"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPositions = void 0;
// src/dexes/dlmmAdapter.ts
const web3_js_1 = require("@solana/web3.js");
const dlmm_1 = __importDefault(require("@meteora-ag/dlmm"));
const solana_1 = require("../chains/solana");
const bn_js_1 = __importDefault(require("bn.js"));
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = __importDefault(require("util"));
async function withRetry(fn, retries = 3) {
    let lastError = undefined;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            console.warn(`Retry ${i + 1}/${retries} failed: ${error}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
    if (lastError) {
        throw lastError;
    }
    throw new Error('No result after retries and no error captured');
}
async function logToFile(filePath, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    try {
        await promises_1.default.appendFile(filePath, logEntry, 'utf8');
    }
    catch (error) {
        console.error(`Failed to write to log file ${filePath}:`, error);
    }
}
async function fetchPositions(walletAddress) {
    const connection = (0, solana_1.getSolanaConnection)();
    const user = new web3_js_1.PublicKey(walletAddress);
    const logFilePath = './positionData.log';
    try {
        const positionsData = await withRetry(async () => {
            return await dlmm_1.default.getAllLbPairPositionsByUser(connection, user);
        });
        await logToFile(logFilePath, 'Raw positions data:\n' + util_1.default.inspect(positionsData, { depth: null }));
        if (!positionsData || positionsData.size === 0) {
            await logToFile(logFilePath, 'No positions returned from DLMM.');
            console.log('No positions returned from DLMM.');
            return [];
        }
        const positionInfos = [];
        for (const [positionKey, pos] of positionsData) {
            console.log(`Processing position ${positionKey}`);
            for (const [subIndex, positionDataEntry] of pos.lbPairPositionsData.entries()) {
                try {
                    const positionData = positionDataEntry.positionData || {};
                    const positionPubKey = Array.isArray(positionDataEntry.publicKey)
                        ? positionDataEntry.publicKey[0]?.toString()
                        : positionDataEntry.publicKey?.toString() || `${positionKey}-${subIndex}`;
                    await logToFile(logFilePath, `Expanded positionData for ${positionPubKey}:\n` +
                        util_1.default.inspect(positionData, { depth: null }));
                    const lowerBin = positionData.positionBinData?.find((bin) => bin.binId === positionData.lowerBinId);
                    const upperBin = positionData.positionBinData?.find((bin) => bin.binId === positionData.upperBinId);
                    const tokenXDecimals = pos.tokenX?.decimal || 0;
                    const tokenYDecimals = pos.tokenY?.decimal || 0;
                    const rawFeeX = positionData.feeX;
                    const rawFeeY = positionData.feeY;
                    await logToFile(logFilePath, `Raw fees for ${positionPubKey}: feeX=${rawFeeX}, feeY=${rawFeeY}`);
                    const feeX = rawFeeX instanceof bn_js_1.default ? rawFeeX.toNumber() : 0;
                    const feeY = rawFeeY instanceof bn_js_1.default ? rawFeeY.toNumber() : 0;
                    const scaledFeeX = feeX / Math.pow(10, tokenXDecimals);
                    const scaledFeeY = feeY / Math.pow(10, tokenYDecimals);
                    await logToFile(logFilePath, `Scaled fees for ${positionPubKey}: feeX=${scaledFeeX}, feeY=${scaledFeeY}`);
                    const position = {
                        id: positionPubKey,
                        owner: walletAddress,
                        pool: pos.lbPair?.publicKey?.toString() || 'unknown',
                        tokenX: pos.tokenX?.publicKey?.toString() || pos.tokenX?.mint?.toString() || 'unknown',
                        tokenY: pos.tokenY?.publicKey?.toString() || pos.tokenY?.mint?.toString() || 'unknown',
                        tokenXSymbol: pos.tokenX?.symbol || 'Unknown',
                        tokenYSymbol: pos.tokenY?.symbol || 'Unknown',
                        tokenXDecimals,
                        tokenYDecimals,
                        amountX: positionData.totalXAmount
                            ? (parseFloat(positionData.totalXAmount) / Math.pow(10, tokenXDecimals)).toString()
                            : '0',
                        amountY: positionData.totalYAmount
                            ? (parseFloat(positionData.totalYAmount) / Math.pow(10, tokenYDecimals)).toString()
                            : '0',
                        lowerBinId: lowerBin?.price ? parseFloat(lowerBin.price) : 0,
                        upperBinId: upperBin?.price ? parseFloat(upperBin.price) : 0,
                        activeBinId: pos.lbPair?.activeId ?? 0,
                        isInRange: pos.lbPair?.activeId && positionData.lowerBinId && positionData.upperBinId
                            ? pos.lbPair.activeId >= positionData.lowerBinId && pos.lbPair.activeId <= positionData.upperBinId
                            : false,
                        unclaimedFeeX: scaledFeeX.toString(),
                        unclaimedFeeY: scaledFeeY.toString(),
                        liquidityProfile: positionData.positionBinData?.map((bin) => ({
                            binId: parseFloat(bin.price),
                            price: bin.price || '0',
                            liquidity: bin.positionLiquidity || '0',
                        })) || [],
                    };
                    positionInfos.push(position);
                    await logToFile(logFilePath, `Mapped position ${positionPubKey}:\n` + util_1.default.inspect(position, { depth: null }));
                }
                catch (error) {
                    await logToFile(logFilePath, `Error mapping position ${positionDataEntry.publicKey || subIndex} in ${positionKey}: ${error}`);
                    console.error(`Error mapping position ${positionDataEntry.publicKey || subIndex} in ${positionKey}:`, error);
                }
            }
        }
        await logToFile(logFilePath, 'All processed positions:\n' + util_1.default.inspect(positionInfos, { depth: null }));
        console.log(`Processed positions logged to ${logFilePath}`);
        return positionInfos;
    }
    catch (error) {
        await logToFile(logFilePath, `Error fetching positions: ${error}`);
        console.error('Error fetching positions:', error);
        return [];
    }
}
exports.fetchPositions = fetchPositions;
