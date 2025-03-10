"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionService_1 = require("./services/positionService");
const summaryCSVGenerator_1 = require("./services/summaryCSVGenerator");
const scheduler_1 = require("./services/scheduler");
const config_1 = require("./config");
async function main() {
    try {
        if (!config_1.config.WALLET_ADDRESS) {
            throw new Error('WALLET_ADDRESS is not set in .env file.');
        }
        console.log('Fetching positions for wallet:', config_1.config.WALLET_ADDRESS);
        const positions = await (0, positionService_1.retrievePositions)(config_1.config.WALLET_ADDRESS);
        if (!positions || positions.length === 0) {
            console.log('No positions found.');
        }
        else {
            console.log('Generating LP meteora positions CSV...');
            await (0, summaryCSVGenerator_1.generateSummaryCSV)(positions);
            console.log('CSV generated successfully.');
        }
        (0, scheduler_1.startScheduler)(config_1.config.SCHEDULE_INTERVAL);
    }
    catch (error) {
        console.error('Error during execution:', error);
    }
}
main();
