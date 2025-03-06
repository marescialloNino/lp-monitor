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
exports.retrievePositions = void 0;
const dlmmAdapter_1 = require("../dexes/dlmmAdapter");
/**
 * Retrieves positions for a given wallet and converts the result into an array.
 * (DLMM.getAllLbPairPositionsByUser may return a Map or object.)
 */
function retrievePositions(walletAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const positionsData = yield (0, dlmmAdapter_1.fetchPositions)(walletAddress);
        // Convert the result to an array (adjust this based on the actual return type).
        if (positionsData instanceof Map) {
            return Array.from(positionsData.values());
        }
        return Object.values(positionsData);
    });
}
exports.retrievePositions = retrievePositions;
