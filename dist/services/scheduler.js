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
 * Starts a scheduled job to retrieve LP positions and append them to 'LP_meteora_positions.csv'.
 * @param intervalMinutes - How often to run the job in minutes.
 */
function startScheduler(intervalMinutes = 10) {
    if (!Number.isInteger(intervalMinutes) || intervalMinutes <= 0) {
        throw new Error('Interval must be a positive integer in minutes');
    }
    const cronExpression = `*/${intervalMinutes} * * * *`;
    node_cron_1.default.schedule(cronExpression, async () => {
        console.log(`Running scheduled job to retrieve LP positions every ${intervalMinutes} minutes...`);
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
    console.log(`Scheduler started. The job will run every ${intervalMinutes} minutes.`);
}
exports.startScheduler = startScheduler;
