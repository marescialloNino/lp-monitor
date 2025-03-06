import { retrievePositions } from './services/positionService';
import { writePositionsToCSV } from './services/csvWriter';
import { analyzePosition } from './services/positionAnalyzer';
import { generateSummaryCSV } from './services/summaryCSVGenerator';

const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';

async function main() {
  try {
    console.log('Retrieving LP positions for wallet:', WALLET_ADDRESS);
    const positions = await retrievePositions(WALLET_ADDRESS);
    console.log('Retrieved positions:', positions);
    
    await writePositionsToCSV(positions);
    console.log('Raw CSV file has been written.');
    
    // Generate or update the summary CSV from the raw data
    await generateSummaryCSV();
    console.log('Summary CSV has been updated.');
  } catch (error) {
    console.error('Error processing positions:', error);
  }
}

main();
