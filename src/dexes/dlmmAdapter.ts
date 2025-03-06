// src/dexes/dlmmAdapter.ts
import { PublicKey } from '@solana/web3.js';
import DLMM from '@meteora-ag/dlmm';
import { getSolanaConnection } from '../chains/solana';
import { PositionInfo } from '../services/types';

// Retry utility inspired by lp4fun
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Retry ${i + 1}/${retries} failed: ${error}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

export async function fetchPositions(walletAddress: string): Promise<PositionInfo[]> {
  const connection = getSolanaConnection();
  const user = new PublicKey(walletAddress);

  const positionsData = await withRetry(async () => {
    return await DLMM.getAllLbPairPositionsByUser(connection, user);
  });

  // Convert Meteora’s response (assumed Map or object) to PositionInfo array
  const positionsArray = positionsData instanceof Map 
    ? Array.from(positionsData.values()) 
    : Object.values(positionsData);

  return positionsArray.map((pos: any) => {
    const positionData = pos.lbPairPositionsData[0]?.positionData || {};
    return {
      id: pos.publicKey.toString(),
      owner: walletAddress,
      pool: pos.lbPair.publicKey.toString(),
      tokenX: pos.tokenX.mint.toString(),
      tokenY: pos.tokenY.mint.toString(),
      tokenXSymbol: pos.tokenX.symbol || 'Unknown',
      tokenYSymbol: pos.tokenY.symbol || 'Unknown',
      tokenXDecimals: pos.tokenX.decimal,
      tokenYDecimals: pos.tokenY.decimal,
      amountX: (Number(pos.tokenX.amount) / Math.pow(10, pos.tokenX.decimal)).toString(),
      amountY: (Number(pos.tokenY.amount) / Math.pow(10, pos.tokenY.decimal)).toString(),
      lowerBinId: positionData.lowerBinId,
      upperBinId: positionData.upperBinId,
      activeBinId: pos.lbPair.activeId,
      isInRange: pos.lbPair.activeId >= positionData.lowerBinId && pos.lbPair.activeId <= positionData.upperBinId,
      unclaimedFeeX: positionData.feeX || '0',
      unclaimedFeeY: positionData.feeY || '0',
      liquidityProfile: positionData.positionBinData?.map((bin: any) => ({
        binId: bin.binId,
        price: bin.price,
        liquidity: bin.positionLiquidity,
      })) || [],
    };
  });
}