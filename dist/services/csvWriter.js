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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writePositionsToCSV = void 0;
const csv_writer_1 = require("csv-writer");
const path = __importStar(require("path"));
/**
 * Custom replacer for JSON.stringify to convert BigInt values to strings.
 */
function bigintReplacer(key, value) {
    return typeof value === 'bigint' ? value.toString() : value;
}
/**
 * Writes the positions data to a CSV file.
 * For demonstration, we write two columns: Public Key and a JSON dump of the details.
 */
function writePositionsToCSV(positions, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputPath = filePath || path.join(__dirname, '../../positions.csv');
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: outputPath,
            header: [
                { id: 'publicKey', title: 'Public Key' },
                { id: 'details', title: 'Details' }
            ],
            append: false // Change to true if you want to append to an existing file.
        });
        const records = positions.map(pos => ({
            publicKey: pos.publicKey ? pos.publicKey.toString() : 'N/A',
            details: JSON.stringify(pos, bigintReplacer)
        }));
        yield csvWriter.writeRecords(records);
        console.log(`CSV file written to ${outputPath}`);
    });
}
exports.writePositionsToCSV = writePositionsToCSV;
