"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const positionService_1 = require("./services/positionService");
const csvWriter_1 = require("./services/csvWriter");
const summaryCSVGenerator_1 = require("./services/summaryCSVGenerator");
const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';
async function main() {
    try {
        console.log('Testing LP position retrieval for wallet:', WALLET_ADDRESS);
        // Step 1: Retrieve positions
        console.log('Fetching positions...');
        const positions = await (0, positionService_1.retrievePositions)(WALLET_ADDRESS);
        console.log('Retrieved positions:', positions);
        if (!positions || positions.length === 0) {
            console.log('No positions found for this wallet.');
            return;
        }
        // Step 2: Write raw positions to CSV
        console.log('Writing raw positions to positions.csv...');
        await (0, csvWriter_1.writePositionsToCSV)(positions);
        console.log('Raw positions CSV written successfully.');
        // Step 3: Generate summary CSV
        console.log('Generating summary.csv...');
        await (0, summaryCSVGenerator_1.generateSummaryCSV)(positions);
        console.log('Summary CSV generated successfully.');
    }
    catch (error) {
        console.error('Error during execution:', error);
    }
}
main();
