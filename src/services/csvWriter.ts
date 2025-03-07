// src/services/csvWriter.ts
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import { PositionInfo } from './types';

export async function writeLiquidityProfileToCSV(positions: PositionInfo[]): Promise<void> {
  const outputPath = path.join(__dirname, '../../liquidity_profile.csv');

  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'positionId', title: 'Position ID' },
      { id: 'binId', title: 'Bin ID' },
      { id: 'price', title: 'Price' },
      { id: 'positionLiquidity', title: 'Position Liquidity' },
      { id: 'positionXAmount', title: 'Position X Amount' },
      { id: 'positionYAmount', title: 'Position Y Amount' },
      { id: 'liquidityShare', title: 'Liquidity Share (%)' },
    ],
    append: false,
  });

  const records = positions.flatMap(pos =>
    pos.liquidityProfile.map(entry => ({
      positionId: pos.id,
      binId: entry.binId,
      price: entry.price,
      positionLiquidity: entry.positionLiquidity,
      positionXAmount: entry.positionXAmount,
      positionYAmount: entry.positionYAmount,
      liquidityShare: entry.liquidityShare,
    }))
  );

  await csvWriter.writeRecords(records);
  console.log(`Liquidity profile CSV written to ${outputPath}`);
}