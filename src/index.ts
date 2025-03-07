// src/index.ts
import { retrievePositions } from './services/positionService';
import { generateSummaryCSV } from './services/summaryCSVGenerator';
import { startScheduler } from './services/scheduler';

const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';
const SCHEDULE_INTERVAL_MINUTES = 30; // Configurable interval

async function main() {
  try {
    console.log('Testing LP position retrieval for wallet:', WALLET_ADDRESS);

    console.log('Fetching positions...');
    const positions = await retrievePositions(WALLET_ADDRESS);
    console.log('Retrieved positions:', positions);

    if (!positions || positions.length === 0) {
      console.log('No positions found for this wallet.');
    } else {
      console.log('Generating LP meteora positions.csv...');
      await generateSummaryCSV(positions);
      console.log('LP meteora positions CSV generated successfully.');
    }

    // Start the scheduler with configurable interval
    startScheduler(SCHEDULE_INTERVAL_MINUTES);
  } catch (error) {
    console.error('Error during execution:', error);
  }
}

main();