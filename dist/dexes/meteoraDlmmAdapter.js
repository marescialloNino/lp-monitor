"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMeteoraPositions = void 0;
// src/dexes/meteoraDlmmAdapter.ts
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
    if (lastError)
        throw lastError;
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
async function fetchMeteoraPositions(walletAddress) {
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
        for (const [positionKey, pos] of positionsData) { // positionKey is the pool address
            console.log(`Processing pool ${positionKey}`);
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
                    const feeX = rawFeeX instanceof bn_js_1.default ? rawFeeX.toNumber() : 0;
                    const feeY = rawFeeY instanceof bn_js_1.default ? rawFeeY.toNumber() : 0;
                    const scaledFeeX = feeX / Math.pow(10, tokenXDecimals);
                    const scaledFeeY = feeY / Math.pow(10, tokenYDecimals);
                    const liquidityProfile = positionData.positionBinData?.map((bin) => {
                        const binLiq = parseFloat(bin.binLiquidity) || 0;
                        const posLiq = parseFloat(bin.positionLiquidity) || 0;
                        const share = binLiq > 0 ? (posLiq / binLiq * 100).toFixed(2) + '%' : '0%';
                        return {
                            binId: bin.binId,
                            price: bin.price || '0',
                            positionLiquidity: bin.positionLiquidity || '0',
                            positionXAmount: bin.positionXAmount
                                ? (parseFloat(bin.positionXAmount) / Math.pow(10, tokenXDecimals)).toString()
                                : '0',
                            positionYAmount: bin.positionYAmount
                                ? (parseFloat(bin.positionYAmount) / Math.pow(10, tokenYDecimals)).toString()
                                : '0',
                            liquidityShare: share,
                        };
                    }) || [];
                    const position = {
                        id: positionPubKey,
                        owner: walletAddress,
                        pool: positionKey,
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
                        liquidityProfile,
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
        console.log(`Processed ${positionInfos.length} Meteora positions logged to ${logFilePath}`);
        return positionInfos;
    }
    catch (error) {
        await logToFile(logFilePath, `Error fetching Meteora positions: ${error}`);
        console.error('Error fetching Meteora positions:', error);
        return [];
    }
}
exports.fetchMeteoraPositions = fetchMeteoraPositions;
