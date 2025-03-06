"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrievePositions = void 0;
// src/services/positionService.ts
const dlmmAdapter_1 = require("../dexes/dlmmAdapter");
async function retrievePositions(walletAddress) {
    return await (0, dlmmAdapter_1.fetchPositions)(walletAddress);
}
exports.retrievePositions = retrievePositions;
