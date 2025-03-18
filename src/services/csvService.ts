// src/services/csvService.ts
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { PositionInfo, LiquidityProfileEntry, KrystalPositionInfo } from './types';

// Fixed file paths for consolidated CSVs
const METEORA_CSV_PATH = path.join(__dirname, '../../LP_meteora_positions.csv');
const LIQUIDITY_PROFILE_CSV_PATH = path.join(__dirname, '../../liquidity_profile.csv');
const KRYSTAL_CSV_PATH = path.join(__dirname, '../../LP_krystal_positions.csv');

async function writeCSV<T extends Record<string, any>>(filePath: string, records: T[], headers: { id: string; title: string }[]): Promise<void> {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers,
    append: fs.existsSync(filePath), // Append to existing file
  });

  await csvWriter.writeRecords(records);
  console.log(`CSV written to ${filePath} with ${records.length} rows`);
}

// Helper function to calculate human-readable quantity for Krystal
function calculateQuantity(rawAmount: string, decimals: number): number {
  return parseFloat(rawAmount) / Math.pow(10, decimals);
}

export async function generateAndWriteMeteoraCSV(walletAddress: string, positions: PositionInfo[]): Promise<void> {
  const headers = [
    { id: 'timestamp', title: 'Timestamp' },
    { id: 'walletAddress', title: 'Wallet Address' }, // Added wallet address
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
    .map(pos => ({
      timestamp: new Date().toISOString(),
      walletAddress, // Include wallet address
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

  await writeCSV(METEORA_CSV_PATH, records, headers);
}

export async function generateAndWriteLiquidityProfileCSV(walletAddress: string, positions: PositionInfo[]): Promise<void> {
  const headers = [
    { id: 'walletAddress', title: 'Wallet Address' }, // Added wallet address
    { id: 'positionId', title: 'Position ID' },
    { id: 'binId', title: 'Bin ID' },
    { id: 'price', title: 'Price' },
    { id: 'positionLiquidity', title: 'Position Liquidity' },
    { id: 'positionXAmount', title: 'Position X Amount' },
    { id: 'positionYAmount', title: 'Position Y Amount' },
    { id: 'liquidityShare', title: 'Liquidity Share' },
  ];

  const records = positions.flatMap(pos =>
    pos.liquidityProfile.map(entry => ({
      walletAddress, // Include wallet address
      positionId: pos.id,
      binId: entry.binId,
      price: entry.price,
      positionLiquidity: entry.positionLiquidity,
      positionXAmount: entry.positionXAmount,
      positionYAmount: entry.positionYAmount,
      liquidityShare: entry.liquidityShare,
    }))
  );

  await writeCSV(LIQUIDITY_PROFILE_CSV_PATH, records, headers);
}

export async function generateAndWriteKrystalCSV(walletAddress: string, positions: KrystalPositionInfo[]): Promise<void> {
  const headers = [
    { id: 'timestamp', title: 'Timestamp' },
    { id: 'walletAddress', title: 'Wallet Address' }, // Added wallet address
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
    walletAddress, // Include wallet address
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

  await writeCSV(KRYSTAL_CSV_PATH, records, headers);
}