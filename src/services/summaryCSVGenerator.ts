import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { analyzePosition } from './positionAnalyzer';

// The raw CSV row uses the header names "Public Key" and "Details"
interface RawCSVRow {
  "Public Key": string;
  Details: string; // JSON string with full position data
}

export interface SummaryRow {
  timestamp: string;
  publicKey: string;
  tokenXQty: string;
  tokenYQty: string;
  lowerBoundary: number;
  upperBoundary: number;
  isInRange: boolean;
  unclaimedFeeX: string;
  unclaimedFeeY: string;
}

const RAW_CSV_PATH = path.join(__dirname, '../../positions.csv');
const SUMMARY_CSV_PATH = path.join(__dirname, '../../summary.csv');

/**
 * Reads the raw CSV file (positions.csv), processes each row using analyzePosition,
 * and appends new summary rows to summary.csv.
 */
export async function generateSummaryCSV(): Promise<void> {
  return new Promise((resolve, reject) => {
    const summaryRows: SummaryRow[] = [];

    fs.createReadStream(RAW_CSV_PATH)
      .pipe(csv())
      .on('data', (data: RawCSVRow) => {
        try {
          // Use the correct header names.
          if (data.Details && data.Details.trim() !== '' && data.Details.trim() !== 'undefined') {
            const detailsObj = JSON.parse(data.Details);
            const analysisResults = analyzePosition(detailsObj);
            if (analysisResults.length > 0) {
              const analysis = analysisResults[0];
              const summaryRow: SummaryRow = {
                timestamp: new Date().toISOString(),
                publicKey: data["Public Key"],
                tokenXQty: analysis.tokenXQty,
                tokenYQty: analysis.tokenYQty,
                lowerBoundary: analysis.lowerBoundary,
                upperBoundary: analysis.upperBoundary,
                isInRange: analysis.isInRange,
                unclaimedFeeX: analysis.unclaimedFees.feeX,
                unclaimedFeeY: analysis.unclaimedFees.feeY,
              };
              summaryRows.push(summaryRow);
            }
          } else {
            console.warn('Skipping row due to missing or invalid Details:', data);
          }
        } catch (error) {
          console.error('Error processing row:', error);
        }
      })
      .on('end', async () => {
        try {
          const csvWriter = createObjectCsvWriter({
            path: SUMMARY_CSV_PATH,
            header: [
              { id: 'timestamp', title: 'Timestamp' },
              { id: 'publicKey', title: 'Public Key' },
              { id: 'tokenXQty', title: 'Token X Qty' },
              { id: 'tokenYQty', title: 'Token Y Qty' },
              { id: 'lowerBoundary', title: 'Lower Boundary' },
              { id: 'upperBoundary', title: 'Upper Boundary' },
              { id: 'isInRange', title: 'Is In Range' },
              { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
              { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
            ],
            append: fs.existsSync(SUMMARY_CSV_PATH)
          });
          await csvWriter.writeRecords(summaryRows);
          console.log(`Summary CSV updated with ${summaryRows.length} new row(s).`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
