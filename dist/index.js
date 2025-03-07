"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const positionService_1 = require("./services/positionService");
const summaryCSVGenerator_1 = require("./services/summaryCSVGenerator");
const scheduler_1 = require("./services/scheduler");
const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';
async function main() {
    try {
        console.log('Testing LP position retrieval for wallet:', WALLET_ADDRESS);
        console.log('Fetching positions...');
        const positions = await (0, positionService_1.retrievePositions)(WALLET_ADDRESS);
        console.log('Retrieved positions:', positions);
        if (!positions || positions.length === 0) {
            console.log('No positions found for this wallet.');
        }
        else {
            console.log('Generating LP meteora positions.csv...');
            await (0, summaryCSVGenerator_1.generateSummaryCSV)(positions);
            console.log('LP meteora positions CSV generated successfully.');
        }
        // Start the scheduler for every 30 minutes
        (0, scheduler_1.startScheduler)();
    }
    catch (error) {
        console.error('Error during execution:', error);
    }
}
main();
