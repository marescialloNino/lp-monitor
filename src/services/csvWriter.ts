import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';

/**
 * Custom replacer for JSON.stringify to convert BigInt values to strings.
 */
function bigintReplacer(key: string, value: any): any {
  return typeof value === 'bigint' ? value.toString() : value;
}

/**
 * Writes the positions data to a CSV file.
 * For demonstration, we write two columns: Public Key and a JSON dump of the details.
 */
export async function writePositionsToCSV(positions: any[], filePath?: string): Promise<void> {
  const outputPath = filePath || path.join(__dirname, '../../positions.csv');

  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'publicKey', title: 'Public Key' },
      { id: 'details', title: 'Details' }
    ],
    append: false // Change to true if you want to append to an existing file.
  });

  const records = positions.map(pos => ({
    publicKey: pos.publicKey ? pos.publicKey.toString() : 'N/A',
    details: JSON.stringify(pos, bigintReplacer)
  }));

  await csvWriter.writeRecords(records);
  console.log(`CSV file written to ${outputPath}`);
}
