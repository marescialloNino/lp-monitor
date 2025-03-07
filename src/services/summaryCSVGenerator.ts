// src/services/summaryCSVGenerator.ts
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { PositionInfo } from './types';

const SUMMARY_CSV_PATH = path.join(__dirname, '../../LP_meteora_positions.csv');

export async function generateSummaryCSV(positions: PositionInfo[]): Promise<void> {
  const csvWriter = createObjectCsvWriter({
    path: SUMMARY_CSV_PATH,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'id', title: 'Public Key' },
      { id: 'amountX', title: 'Token X Qty' },
      { id: 'amountY', title: 'Token Y Qty' },
      { id: 'lowerBinId', title: 'Lower Boundary' },
      { id: 'upperBinId', title: 'Upper Boundary' },
      { id: 'isInRange', title: 'Is In Range' },
      { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
      { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
    ],
    append: fs.existsSync(SUMMARY_CSV_PATH),
  });

  const summaryRows = positions
    .filter(pos => !(pos.amountX === '0' && pos.amountY === '0')) // Exclude zero liquidity
    .map(pos => ({
      timestamp: new Date().toISOString(),
      id: pos.id,
      amountX: pos.amountX,
      amountY: pos.amountY,
      lowerBinId: pos.lowerBinId,
      upperBinId: pos.upperBinId,
      isInRange: pos.isInRange,
      unclaimedFeeX: pos.unclaimedFeeX,
      unclaimedFeeY: pos.unclaimedFeeY,
    }));

  await csvWriter.writeRecords(summaryRows);
  console.log(`LP meteora positions CSV updated with ${summaryRows.length} rows.`);
}