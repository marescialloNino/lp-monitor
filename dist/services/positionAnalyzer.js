"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePosition = void 0;
function analyzePosition(position) {
    try {
        const results = [];
        // Convert bigint amounts to strings with proper decimals
        const tokenXQty = (Number(position.tokenX.amount) / Math.pow(10, position.tokenX.decimal)).toString();
        const tokenYQty = (Number(position.tokenY.amount) / Math.pow(10, position.tokenY.decimal)).toString();
        for (const posData of position.lbPairPositionsData) {
            const positionData = posData.positionData;
            // Get boundaries
            const lowerBoundary = positionData.lowerBinId;
            const upperBoundary = positionData.upperBinId;
            // Get liquidity profile
            const liquidityProfile = positionData.positionBinData.map(bin => ({
                binId: bin.binId,
                price: bin.price,
                positionLiquidity: bin.positionLiquidity
            }));
            // Check if liquidity is in range
            const activeId = position.lbPair.activeId;
            const isInRange = activeId >= lowerBoundary && activeId <= upperBoundary;
            // Get unclaimed fees
            const unclaimedFees = {
                feeX: positionData.feeX,
                feeY: positionData.feeY
            };
            results.push({
                tokenXQty,
                tokenYQty,
                lowerBoundary,
                upperBoundary,
                liquidityProfile,
                isInRange,
                unclaimedFees
            });
        }
        return results;
    }
    catch (error) {
        console.error('Error analyzing position:', error);
        throw error;
    }
}
exports.analyzePosition = analyzePosition;
