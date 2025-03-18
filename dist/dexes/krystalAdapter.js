"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchKrystalPositions = void 0;
// src/dexes/krystalAdapter.ts
const axios_1 = __importDefault(require("axios"));
async function fetchKrystalPositions(walletAddress) {
    const baseUrl = 'https://api.krystal.app/all/v1/lp/userPositions';
    const params = {
        addresses: walletAddress,
        chainIds: '137',
        limit: 100,
        orderBy: 'liquidity',
    };
    try {
        const response = await axios_1.default.get(baseUrl, { params, headers: { 'accept': 'application/json' } });
        const data = response.data;
        if (!data.positions || data.positions.length === 0) {
            console.log('No LP positions returned from Krystal API.');
            return [];
        }
        const totalFeeEarnedUsd = data.statsByChain['137']?.totalFeeEarned || 0;
        const krystalPositions = data.positions.map((pos) => {
            const tokenX = pos.currentAmounts[0] || { token: { address: '', symbol: 'Unknown', decimals: 0 }, balance: '0' };
            const tokenY = pos.currentAmounts[1] || { token: { address: '', symbol: 'Unknown', decimals: 0 }, balance: '0' };
            const providedX = pos.providedAmounts[0] || { token: { address: '', symbol: 'Unknown', decimals: 0 }, balance: '0' };
            const providedY = pos.providedAmounts[1] || { token: { address: '', symbol: 'Unknown', decimals: 0 }, balance: '0' };
            const feeX = pos.feePending.find((f) => f.token.address === tokenX.token.address) || { balance: '0' };
            const feeY = pos.feePending.find((f) => f.token.address === tokenY.token.address) || { balance: '0' };
            return {
                id: pos.id,
                owner: pos.userAddress,
                chain: pos.chainName,
                protocol: pos.pool.project,
                poolAddress: pos.pool.poolAddress,
                tokenXSymbol: tokenX.token.symbol,
                tokenYSymbol: tokenY.token.symbol,
                tokenXAddress: tokenX.token.address,
                tokenYAddress: tokenY.token.address,
                tokenXAmount: tokenX.balance,
                tokenYAmount: tokenY.balance,
                tokenXProvidedAmount: providedX.balance,
                tokenYProvidedAmount: providedY.balance,
                tokenXDecimals: tokenX.token.decimals,
                tokenYDecimals: tokenY.token.decimals,
                minPrice: pos.minPrice,
                maxPrice: pos.maxPrice,
                currentPrice: pos.pool.price,
                isInRange: pos.status === 'IN_RANGE',
                initialValueUsd: pos.initialUnderlyingValue,
                actualValueUsd: pos.currentPositionValue,
                impermanentLoss: pos.impermanentLoss,
                unclaimedFeeX: feeX.balance,
                unclaimedFeeY: feeY.balance,
                feeApr: pos.feeApr,
                totalFeeEarnedUsd,
            };
        });
        console.log(`Fetched ${krystalPositions.length} LP positions from Krystal API for wallet ${walletAddress}`);
        return krystalPositions;
    }
    catch (error) {
        console.error('Error fetching positions from Krystal API:', error);
        return [];
    }
}
exports.fetchKrystalPositions = fetchKrystalPositions;
