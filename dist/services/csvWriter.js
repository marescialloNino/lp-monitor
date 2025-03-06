"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writePositionsToCSV = void 0;
// src/services/csvWriter.ts
const csv_writer_1 = require("csv-writer");
const path = __importStar(require("path"));
async function writePositionsToCSV(positions, filePath) {
    const outputPath = filePath || path.join(__dirname, '../../positions.csv');
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: outputPath,
        header: [
            { id: 'id', title: 'Position ID' },
            { id: 'owner', title: 'Owner' },
            { id: 'pool', title: 'Pool' },
            { id: 'amountX', title: 'Token X Qty' },
            { id: 'amountY', title: 'Token Y Qty' },
            { id: 'lowerBinId', title: 'Lower Boundary' },
            { id: 'upperBinId', title: 'Upper Boundary' },
            { id: 'isInRange', title: 'Is In Range' },
            { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
            { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
        ],
        append: false,
    });
    await csvWriter.writeRecords(positions);
    console.log(`Raw CSV written to ${outputPath}`);
}
exports.writePositionsToCSV = writePositionsToCSV;
