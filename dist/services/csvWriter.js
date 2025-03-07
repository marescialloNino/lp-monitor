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
exports.writeLiquidityProfileToCSV = void 0;
// src/services/csvWriter.ts
const csv_writer_1 = require("csv-writer");
const path = __importStar(require("path"));
async function writeLiquidityProfileToCSV(positions) {
    const outputPath = path.join(__dirname, '../../liquidity_profile.csv');
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: outputPath,
        header: [
            { id: 'positionId', title: 'Position ID' },
            { id: 'binId', title: 'Bin ID' },
            { id: 'price', title: 'Price' },
            { id: 'positionLiquidity', title: 'Position Liquidity' },
            { id: 'positionXAmount', title: 'Position X Amount' },
            { id: 'positionYAmount', title: 'Position Y Amount' },
            { id: 'liquidityShare', title: 'Liquidity Share (%)' },
        ],
        append: false,
    });
    const records = positions.flatMap(pos => pos.liquidityProfile.map(entry => ({
        positionId: pos.id,
        binId: entry.binId,
        price: entry.price,
        positionLiquidity: entry.positionLiquidity,
        positionXAmount: entry.positionXAmount,
        positionYAmount: entry.positionYAmount,
        liquidityShare: entry.liquidityShare,
    })));
    await csvWriter.writeRecords(records);
    console.log(`Liquidity profile CSV written to ${outputPath}`);
}
exports.writeLiquidityProfileToCSV = writeLiquidityProfileToCSV;
