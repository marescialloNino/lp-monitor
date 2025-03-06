// src/services/summaryCSVGenerator.ts
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { PositionInfo } from './types';

const SUMMARY_CSV_PATH = path.join(__dirname, '../../summary.csv');

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

  const summaryRows = positions.map(pos => ({
    timestamp: new Date().toISOString(),
    ...pos,
  }));

  await csvWriter.writeRecords(summaryRows);
  console.log(`Summary CSV updated with ${summaryRows.length} rows.`);
}