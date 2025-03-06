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
Object.defineProperty(exports, "__esModule", { value: true });
const positionService_1 = require("./services/positionService");
const csvWriter_1 = require("./services/csvWriter");
const summaryCSVGenerator_1 = require("./services/summaryCSVGenerator");
const WALLET_ADDRESS = 'Yj7SzJwGkHuUKBfFytp8TPfj997ntSicCCuJLiB39kE';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Retrieving LP positions for wallet:', WALLET_ADDRESS);
            const positions = yield (0, positionService_1.retrievePositions)(WALLET_ADDRESS);
            console.log('Retrieved positions:', positions);
            yield (0, csvWriter_1.writePositionsToCSV)(positions);
            console.log('Raw CSV file has been written.');
            // Generate or update the summary CSV from the raw data
            yield (0, summaryCSVGenerator_1.generateSummaryCSV)();
            console.log('Summary CSV has been updated.');
        }
        catch (error) {
            console.error('Error processing positions:', error);
        }
    });
}
main();
