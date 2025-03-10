// src/services/scheduler.ts
import cron from 'node-cron';
import { retrievePositions } from './positionService';
import { generateSummaryCSV } from './summaryCSVGenerator';

const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';

/**
 * Starts a scheduled job to retrieve LP positions and append them to 'LP_meteora_positions.csv'.
 * @param intervalMinutes - How often to run the job in minutes.
 */
export function startScheduler(intervalMinutes: number = 10): void {
  if (!Number.isInteger(intervalMinutes) || intervalMinutes <= 0) {
    throw new Error('Interval must be a positive integer in minutes');
  }

  const cronExpression = `*/${intervalMinutes} * * * *`;
  cron.schedule(cronExpression, async () => {
    console.log(`Running scheduled job to retrieve LP positions every ${intervalMinutes} minutes...`);
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

  console.log(`Scheduler started. The job will run every ${intervalMinutes} minutes.`);
}