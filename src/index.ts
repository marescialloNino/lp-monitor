import { retrievePositions } from './services/positionService';
import { generateSummaryCSV } from './services/summaryCSVGenerator';
import { startScheduler } from './services/scheduler';
import { config } from './config';

async function main() {
  try {
    if (!config.WALLET_ADDRESS) {
      throw new Error('WALLET_ADDRESS is not set in .env file.');
    }

    console.log('Fetching positions for wallet:', config.WALLET_ADDRESS);
    const positions = await retrievePositions(config.WALLET_ADDRESS);

    if (!positions || positions.length === 0) {
      console.log('No positions found.');
    } else {
      console.log('Generating LP meteora positions CSV...');
      await generateSummaryCSV(positions);
      console.log('CSV generated successfully.');
    }

    startScheduler(config.SCHEDULE_INTERVAL);
  } catch (error) {
    console.error('Error during execution:', error);
  }
}

main();
