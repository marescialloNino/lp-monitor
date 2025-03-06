// src/index.ts
import { retrievePositions } from './services/positionService';
import { writePositionsToCSV } from './services/csvWriter';
import { generateSummaryCSV } from './services/summaryCSVGenerator';

const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';

async function main() {
  try {
    console.log('Testing LP position retrieval for wallet:', WALLET_ADDRESS);

    // Step 1: Retrieve positions
    console.log('Fetching positions...');
    const positions = await retrievePositions(WALLET_ADDRESS);
    console.log('Retrieved positions:', positions);

    if (!positions || positions.length === 0) {
      console.log('No positions found for this wallet.');
      return;
    }

    // Step 2: Write raw positions to CSV
    console.log('Writing raw positions to positions.csv...');
    await writePositionsToCSV(positions);
    console.log('Raw positions CSV written successfully.');

    // Step 3: Generate summary CSV
    console.log('Generating summary.csv...');
    await generateSummaryCSV(positions);
    console.log('Summary CSV generated successfully.');

  } catch (error) {
    console.error('Error during execution:', error);
  }
}

main();