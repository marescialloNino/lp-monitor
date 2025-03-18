"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveKrystalPositions = void 0;
// src/services/krystalPositionService.ts
const krystalAdapter_1 = require("../dexes/krystalAdapter");
async function retrieveKrystalPositions(walletAddress) {
    const positions = await (0, krystalAdapter_1.fetchKrystalPositions)(walletAddress);
    console.log(`Retrieved ${positions.length} Krystal LP positions for wallet ${walletAddress}`);
    return positions;
}
exports.retrieveKrystalPositions = retrieveKrystalPositions;
