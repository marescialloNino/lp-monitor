// index.ts
import { retrievePositions } from './services/positionService';
import { writePositionsToCSV } from './services/csvWriter';
import { analyzePosition } from './services/positionAnalyzer';

const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';

async function main() {
  try {
    console.log('Retrieving LP positions for wallet:', WALLET_ADDRESS);
    const positions = await retrievePositions(WALLET_ADDRESS);
    console.log('Retrieved positions:', positions);
    
    await writePositionsToCSV(positions);
    console.log('CSV file has been written with the retrieved positions.');

    // Analyze each position
    positions.forEach((position, index) => {
      const analysisResults = analyzePosition(position);
      
      console.log(`\nAnalysis for Position ${index + 1} (${position.publicKey.toString()}):`);
      analysisResults.forEach((result, resultIndex) => {
        console.log(`Position Variant ${resultIndex + 1}:`);
        console.log('Token Quantities:', {
          tokenX: `${result.tokenXQty} (${position.tokenX.publicKey.toString()})`,
          tokenY: `${result.tokenYQty} (${position.tokenY.publicKey.toString()})`
        });
        console.log('Boundaries:', {
          lower: result.lowerBoundary,
          upper: result.upperBoundary
        });
        console.log('Liquidity Profile:', result.liquidityProfile);
        console.log('Is In Range:', result.isInRange);
        console.log('Unclaimed Fees:', result.unclaimedFees);
      });
    });

  } catch (error) {
    console.error('Error processing positions:', error);
  }
}

main();