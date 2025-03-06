"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummaryCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const csv_writer_1 = require("csv-writer");
const positionAnalyzer_1 = require("./positionAnalyzer");
const RAW_CSV_PATH = path_1.default.join(__dirname, '../../positions.csv');
const SUMMARY_CSV_PATH = path_1.default.join(__dirname, '../../summary.csv');
/**
 * Reads the raw CSV file (positions.csv), processes each row using analyzePosition,
 * and appends new summary rows to summary.csv.
 */
function generateSummaryCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const summaryRows = [];
            fs_1.default.createReadStream(RAW_CSV_PATH)
                .pipe((0, csv_parser_1.default)())
                .on('data', (data) => {
                try {
                    // Use the correct header names.
                    if (data.Details && data.Details.trim() !== '' && data.Details.trim() !== 'undefined') {
                        const detailsObj = JSON.parse(data.Details);
                        const analysisResults = (0, positionAnalyzer_1.analyzePosition)(detailsObj);
                        if (analysisResults.length > 0) {
                            const analysis = analysisResults[0];
                            const summaryRow = {
                                timestamp: new Date().toISOString(),
                                publicKey: data["Public Key"],
                                tokenXQty: analysis.tokenXQty,
                                tokenYQty: analysis.tokenYQty,
                                lowerBoundary: analysis.lowerBoundary,
                                upperBoundary: analysis.upperBoundary,
                                isInRange: analysis.isInRange,
                                unclaimedFeeX: analysis.unclaimedFees.feeX,
                                unclaimedFeeY: analysis.unclaimedFees.feeY,
                            };
                            summaryRows.push(summaryRow);
                        }
                    }
                    else {
                        console.warn('Skipping row due to missing or invalid Details:', data);
                    }
                }
                catch (error) {
                    console.error('Error processing row:', error);
                }
            })
                .on('end', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                        path: SUMMARY_CSV_PATH,
                        header: [
                            { id: 'timestamp', title: 'Timestamp' },
                            { id: 'publicKey', title: 'Public Key' },
                            { id: 'tokenXQty', title: 'Token X Qty' },
                            { id: 'tokenYQty', title: 'Token Y Qty' },
                            { id: 'lowerBoundary', title: 'Lower Boundary' },
                            { id: 'upperBoundary', title: 'Upper Boundary' },
                            { id: 'isInRange', title: 'Is In Range' },
                            { id: 'unclaimedFeeX', title: 'Unclaimed Fee X' },
                            { id: 'unclaimedFeeY', title: 'Unclaimed Fee Y' },
                        ],
                        append: fs_1.default.existsSync(SUMMARY_CSV_PATH)
                    });
                    yield csvWriter.writeRecords(summaryRows);
                    console.log(`Summary CSV updated with ${summaryRows.length} new row(s).`);
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }))
                .on('error', (error) => {
                reject(error);
            });
        });
    });
}
exports.generateSummaryCSV = generateSummaryCSV;
