// src/index.ts
import { config } from './config';
import { retrieveMeteoraPositions } from './services/meteoraPositionService';
import { retrieveKrystalPositions } from './services/krystalPositionService';
import { generateAndWriteMeteoraCSV, generateAndWriteLiquidityProfileCSV, generateAndWriteKrystalCSV } from './services/csvService';
import { PositionInfo } from './services/types';

async function processSolanaWallet(walletAddress: string): Promise<PositionInfo[]> {
  console.log(`Processing Solana wallet: ${walletAddress}`);
  const meteoraPositions = await retrieveMeteoraPositions(walletAddress);
  if (meteoraPositions.length > 0) {
    await generateAndWriteMeteoraCSV(walletAddress, meteoraPositions);
  } else {
    console.log(`No Meteora positions found for ${walletAddress}`);
  }
  return meteoraPositions;
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
  console.log('Starting lp-monitor batch process...');

  // Aggregate all Meteora positions for liquidity profile
  let allMeteoraPositions: PositionInfo[] = [];
  for (const solWallet of config.SOLANA_WALLET_ADDRESSES) {
    const positions = await processSolanaWallet(solWallet);
    allMeteoraPositions = allMeteoraPositions.concat(positions);
  }

  // Write combined liquidity profile for all wallets
  if (allMeteoraPositions.length > 0) {
    await generateAndWriteLiquidityProfileCSV('all_wallets', allMeteoraPositions); // 'all_wallets' is a placeholder
  } else {
    console.log('No Meteora positions found across all wallets for liquidity profile');
  }

  // Process EVM wallets
  for (const evmWallet of config.EVM_WALLET_ADDRESSES) {
    await processEvmWallet(evmWallet);
  }

  console.log('Batch process completed.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error in batch process:', error);
    process.exit(1);
  });