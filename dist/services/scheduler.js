"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = void 0;
// src/services/scheduler.ts
const node_cron_1 = __importDefault(require("node-cron"));
const positionService_1 = require("./positionService");
const summaryCSVGenerator_1 = require("./summaryCSVGenerator");
const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';
/**
 * Starts a scheduled job that runs every 10 minutes to retrieve LP positions
 * and append them to 'LP meteora positions.csv'.
 */
function startScheduler() {
    node_cron_1.default.schedule('*/10 * * * *', async () => {
        console.log('Running scheduled job to retrieve LP positions...');
        try {
            const positions = await (0, positionService_1.retrievePositions)(WALLET_ADDRESS);
            if (!positions || positions.length === 0) {
                console.log('No positions found during scheduled job.');
                return;
            }
            await (0, summaryCSVGenerator_1.generateSummaryCSV)(positions);
            console.log('Positions retrieved and LP meteora positions CSV updated.');
        }
        catch (error) {
            console.error('Error during scheduled job:', error);
        }
    });
    console.log('Scheduler started. The job will run every 30 minutes.');
}
exports.startScheduler = startScheduler;
