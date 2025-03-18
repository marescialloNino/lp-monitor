// src/index.ts
import { config } from './config';
import { retrieveMeteoraPositions } from './services/meteoraPositionService';
import { retrieveKrystalPositions } from './services/krystalPositionService';
import { generateAndWriteMeteoraCSV, generateAndWriteLiquidityProfileCSV, generateAndWriteKrystalCSV } from './services/csvService';
import { startScheduler } from './services/scheduler';

async function processSolanaWallet(walletAddress: string) {
  console.log(`Processing Solana wallet: ${walletAddress}`);
  const meteoraPositions = await retrieveMeteoraPositions(walletAddress);
  if (meteoraPositions.length > 0) {
    await generateAndWriteMeteoraCSV(walletAddress, meteoraPositions);
    await generateAndWriteLiquidityProfileCSV(walletAddress, meteoraPositions);
  } else {
    console.log(`No Meteora positions found for ${walletAddress}`);
  }
}

async function processEvmWallet(walletAddress: string) {
  console.log(`Processing EVM wallet: ${walletAddress}`);
  const krystalPositions = await retrieveKrystalPositions(walletAddress);
  if (krystalPositions.length > 0) {
    await generateAndWriteKrystalCSV(walletAddress, krystalPositions);
  } else {
    console.log(`No Krystal positions found for ${walletAddress}`);
  }
}

async function main() {
  console.log('Starting lp-monitor...');

  // Process Solana wallets
  for (const solWallet of config.SOLANA_WALLET_ADDRESSES) {
    await processSolanaWallet(solWallet);
  }

  // Process EVM wallets
  for (const evmWallet of config.EVM_WALLET_ADDRESSES) {
    await processEvmWallet(evmWallet);
  }

  // Start the scheduler
  startScheduler();
}

main().catch((error) => {
  console.error('Error in main:', error);
  process.exit(1);
});