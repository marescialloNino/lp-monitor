// src/dexes/dlmmAdapter.ts
import { PublicKey } from '@solana/web3.js';
import DLMM from '@meteora-ag/dlmm';
import { getSolanaConnection } from '../chains/solana';
import { PositionInfo } from '../services/types';
import BN from 'bn.js';
import fs from 'fs/promises';
import util from 'util';

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: Error | undefined = undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Retry ${i + 1}/${retries} failed: ${error}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  if (lastError) {
    throw lastError;
  }
  throw new Error('No result after retries and no error captured');
}

async function logToFile(filePath: string, message: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  try {
    await fs.appendFile(filePath, logEntry, 'utf8');
  } catch (error) {
    console.error(`Failed to write to log file ${filePath}:`, error);
  }
}

export async function fetchPositions(walletAddress: string): Promise<PositionInfo[]> {
  const connection = getSolanaConnection();
  const user = new PublicKey(walletAddress);
  const logFilePath = './positionData.log';

  try {
    const positionsData: Map<string, any> = await withRetry(async () => {
      return await DLMM.getAllLbPairPositionsByUser(connection, user);
    });

    await logToFile(logFilePath, 'Raw positions data:\n' + util.inspect(positionsData, { depth: null }));

    if (!positionsData || positionsData.size === 0) {
      await logToFile(logFilePath, 'No positions returned from DLMM.');
      console.log('No positions returned from DLMM.');
      return [];
    }

    const positionInfos: PositionInfo[] = [];

    positionsData.forEach((pos: any, positionKey: string) => {
      console.log(`Processing position ${positionKey}`);

      pos.lbPairPositionsData.forEach(async (positionDataEntry: any, subIndex: number) => {
        try {
          const positionData = positionDataEntry.positionData || {};
          const positionPubKey = Array.isArray(positionDataEntry.publicKey) 
            ? positionDataEntry.publicKey[0]?.toString() 
            : positionDataEntry.publicKey?.toString() || `${positionKey}-${subIndex}`;

          await logToFile(
            logFilePath,
            `Expanded positionData for ${positionPubKey}:\n` +
            util.inspect(positionData, { depth: null })
          );

          const lowerBin = positionData.positionBinData?.find((bin: any) => bin.binId === positionData.lowerBinId);
          const upperBin = positionData.positionBinData?.find((bin: any) => bin.binId === positionData.upperBinId);

          const tokenXDecimals = pos.tokenX?.decimal || 0;
          const tokenYDecimals = pos.tokenY?.decimal || 0;

          const rawFeeX = positionData.feeX;
          const rawFeeY = positionData.feeY;
          await logToFile(logFilePath, `Raw fees for ${positionPubKey}: feeX=${rawFeeX}, feeY=${rawFeeY}`);

          // Fee conversion
          const feeX = rawFeeX instanceof BN ? rawFeeX.toNumber() : 0;
          const feeY = rawFeeY instanceof BN ? rawFeeY.toNumber() : 0;
          const scaledFeeX = feeX / Math.pow(10, tokenXDecimals);
          const scaledFeeY = feeY / Math.pow(10, tokenYDecimals);
          await logToFile(logFilePath, `Scaled fees for ${positionPubKey}: feeX=${scaledFeeX}, feeY=${scaledFeeY}`);

          const position: PositionInfo = {
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
            liquidityProfile: positionData.positionBinData?.map((bin: any) => ({
              binId: parseFloat(bin.price),
              price: bin.price || '0',
              liquidity: bin.positionLiquidity || '0',
            })) || [],
          };

          positionInfos.push(position);
          await logToFile(logFilePath, `Mapped position ${positionPubKey}:\n` + util.inspect(position, { depth: null }));
        } catch (error) {
          await logToFile(
            logFilePath,
            `Error mapping position ${positionDataEntry.publicKey || subIndex} in ${positionKey}: ${error}`
          );
          console.error(`Error mapping position ${positionDataEntry.publicKey || subIndex} in ${positionKey}:`, error);
        }
      });
    });

    await logToFile(logFilePath, 'All processed positions:\n' + util.inspect(positionInfos, { depth: null }));
    console.log(`Processed positions logged to ${logFilePath}`);
    return positionInfos;
  } catch (error) {
    await logToFile(logFilePath, `Error fetching positions: ${error}`);
    console.error('Error fetching positions:', error);
    return [];
  }
}