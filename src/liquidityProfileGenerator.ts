// node dist/liquidityProfileGenerator.js to run the scrpt
import { retrievePositions } from './services/positionService';
import { writeLiquidityProfileToCSV } from './services/csvWriter';

const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';

async function generateLiquidityProfile() {
  try {
    console.log('Fetching positions for liquidity profile...');
    const positions = await retrievePositions(WALLET_ADDRESS);
    if (!positions || positions.length === 0) {
      console.log('No positions found.');
      return;
    }
    await writeLiquidityProfileToCSV(positions);
    console.log('Liquidity profile generated.');
  } catch (error) {
    console.error('Error generating liquidity profile:', error);
  }
}

generateLiquidityProfile();