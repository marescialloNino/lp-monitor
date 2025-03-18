"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveMeteoraPositions = void 0;
// src/services/meteoraPositionService.ts
const meteoraDlmmAdapter_1 = require("../dexes/meteoraDlmmAdapter");
async function retrieveMeteoraPositions(walletAddress) {
    return await (0, meteoraDlmmAdapter_1.fetchMeteoraPositions)(walletAddress);
}
exports.retrieveMeteoraPositions = retrieveMeteoraPositions;
