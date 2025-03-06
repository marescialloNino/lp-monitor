// src/services/csvWriter.ts
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import { PositionInfo } from './types';

export async function writePositionsToCSV(positions: PositionInfo[], filePath?: string): Promise<void> {
  const outputPath = filePath || path.join(__dirname, '../../positions.csv');

  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'id', title: 'Position ID' },
      { id: 'owner', title: 'Owner' },
      { id: 'pool', title: 'Pool' },
      { id: 'amountX', title: 'Token X Qty' },
      { id: 'amountY', title: 'Token Y Qty' },
      { id: 'lowerBinId', title: 'Lower Boundary' },
      { id: 'upperBinId', title: 'Upper Boundary' },
      { id: 'isInRange', title: 'Is In Range' },
      { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
      { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
    ],
    append: false,
  });

  await csvWriter.writeRecords(positions);
  console.log(`Raw CSV written to ${outputPath}`);
}