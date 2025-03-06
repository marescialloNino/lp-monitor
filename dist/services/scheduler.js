"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const positionService_1 = require("./positionService");
const csvWriter_1 = require("./csvWriter");
// Replace with your actual Solana wallet address.
const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';
/**
 * Starts a scheduled job that runs every hour (at minute 0) to retrieve LP positions
 * and write them to a CSV file.
 */
function startScheduler() {
    node_cron_1.default.schedule('0 * * * *', async () => {
        console.log('Running scheduled job to retrieve LP positions...');
        try {
            const positions = await (0, positionService_1.retrievePositions)(WALLET_ADDRESS);
            await (0, csvWriter_1.writePositionsToCSV)(positions);
            console.log('Positions retrieved and CSV updated.');
        }
        catch (error) {
            console.error('Error during scheduled job:', error);
        }
    });
    console.log('Scheduler started. The job will run every hour.');
}
exports.startScheduler = startScheduler;
