"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummaryCSV = void 0;
// src/services/summaryCSVGenerator.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_writer_1 = require("csv-writer");
const SUMMARY_CSV_PATH = path_1.default.join(__dirname, '../../LP_meteora_positions.csv');
async function generateSummaryCSV(positions) {
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: SUMMARY_CSV_PATH,
        header: [
            { id: 'timestamp', title: 'Timestamp' },
            { id: 'id', title: 'Public Key' },
            { id: 'amountX', title: 'Token X Qty' },
            { id: 'amountY', title: 'Token Y Qty' },
            { id: 'lowerBinId', title: 'Lower Boundary' },
            { id: 'upperBinId', title: 'Upper Boundary' },
            { id: 'isInRange', title: 'Is In Range' },
            { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
            { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
        ],
        append: fs_1.default.existsSync(SUMMARY_CSV_PATH),
    });
    const summaryRows = positions
        .filter(pos => !(pos.amountX === '0' && pos.amountY === '0')) // Exclude zero liquidity
        .map(pos => ({
        timestamp: new Date().toISOString(),
        id: pos.id,
        amountX: pos.amountX,
        amountY: pos.amountY,
        lowerBinId: pos.lowerBinId,
        upperBinId: pos.upperBinId,
        isInRange: pos.isInRange,
        unclaimedFeeX: pos.unclaimedFeeX,
        unclaimedFeeY: pos.unclaimedFeeY,
    }));
    await csvWriter.writeRecords(summaryRows);
    console.log(`LP meteora positions CSV updated with ${summaryRows.length} rows.`);
}
exports.generateSummaryCSV = generateSummaryCSV;
