// src/services/scheduler.ts
import { schedule } from 'node-cron';
import { config } from '../config';
import { retrieveMeteoraPositions } from './meteoraPositionService';
import { retrieveKrystalPositions } from './krystalPositionService';
import { generateAndWriteMeteoraCSV, generateAndWriteLiquidityProfileCSV, generateAndWriteKrystalCSV } from './csvService';

export function startScheduler(): void {
  console.log(`Scheduling position retrieval every ${config.SCHEDULE_INTERVAL} minutes...`);
  schedule(`*/${config.SCHEDULE_INTERVAL} * * * *`, async () => {
    try {
      // Process Solana wallets
      for (const solWallet of config.SOLANA_WALLET_ADDRESSES) {
        console.log(`Scheduled run for Solana wallet: ${solWallet}`);
        const meteoraPositions = await retrieveMeteoraPositions(solWallet);
        if (meteoraPositions.length > 0) {
          await generateAndWriteMeteoraCSV(solWallet, meteoraPositions);
          await generateAndWriteLiquidityProfileCSV(solWallet, meteoraPositions);
        } else {
          console.log(`No Meteora positions found for ${solWallet} during scheduled run`);
        }
      }

      // Process EVM wallets
      for (const evmWallet of config.EVM_WALLET_ADDRESSES) {
        console.log(`Scheduled run for EVM wallet: ${evmWallet}`);
        const krystalPositions = await retrieveKrystalPositions(evmWallet);
        if (krystalPositions.length > 0) {
          await generateAndWriteKrystalCSV(evmWallet, krystalPositions);
        } else {
          console.log(`No Krystal positions found for ${evmWallet} during scheduled run`);
        }
      }
    } catch (error) {
      console.error('Error in scheduled task:', error);
    }
  });
}