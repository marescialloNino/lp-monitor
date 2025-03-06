import cron from 'node-cron';
import { retrievePositions } from './positionService';
import { writePositionsToCSV } from './csvWriter';

// Replace with your actual Solana wallet address.
const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';

/**
 * Starts a scheduled job that runs every hour (at minute 0) to retrieve LP positions
 * and write them to a CSV file.
 */
export function startScheduler() {
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled job to retrieve LP positions...');
    try {
      const positions = await retrievePositions(WALLET_ADDRESS);
      await writePositionsToCSV(positions);
      console.log('Positions retrieved and CSV updated.');
    } catch (error) {
      console.error('Error during scheduled job:', error);
    }
  });

  console.log('Scheduler started. The job will run every hour.');
}
