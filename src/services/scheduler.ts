// src/services/scheduler.ts
import cron from 'node-cron';
import { retrievePositions } from './positionService';
import { generateSummaryCSV } from './summaryCSVGenerator';

const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';

/**
 * Starts a scheduled job that runs every 10 minutes to retrieve LP positions
 * and append them to 'LP meteora positions.csv'.
 */
export function startScheduler() {
  cron.schedule('*/10 * * * *', async () => {
    console.log('Running scheduled job to retrieve LP positions...');
    try {
      const positions = await retrievePositions(WALLET_ADDRESS);
      if (!positions || positions.length === 0) {
        console.log('No positions found during scheduled job.');
        return;
      }
      await generateSummaryCSV(positions);
      console.log('Positions retrieved and LP meteora positions CSV updated.');
    } catch (error) {
      console.error('Error during scheduled job:', error);
    }
  });

  console.log('Scheduler started. The job will run every 10 minutes.');
}