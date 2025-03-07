"use strict";
// node dist/liquidityProfileGenerator.js to run the scrpt
Object.defineProperty(exports, "__esModule", { value: true });
const positionService_1 = require("./services/positionService");
const csvWriter_1 = require("./services/csvWriter");
const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';
async function generateLiquidityProfile() {
    try {
        console.log('Fetching positions for liquidity profile...');
        const positions = await (0, positionService_1.retrievePositions)(WALLET_ADDRESS);
        if (!positions || positions.length === 0) {
            console.log('No positions found.');
            return;
        }
        await (0, csvWriter_1.writeLiquidityProfileToCSV)(positions);
        console.log('Liquidity profile generated.');
    }
    catch (error) {
        console.error('Error generating liquidity profile:', error);
    }
}
generateLiquidityProfile();
