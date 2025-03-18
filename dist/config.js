"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    SOLANA_WALLET_ADDRESSES: process.env.SOLANA_WALLET_ADDRESSES
        ? process.env.SOLANA_WALLET_ADDRESSES.split(',').map(addr => addr.trim())
        : [],
    EVM_WALLET_ADDRESSES: process.env.EVM_WALLET_ADDRESSES
        ? process.env.EVM_WALLET_ADDRESSES.split(',').map(addr => addr.trim())
        : [],
    SCHEDULE_INTERVAL: parseInt(process.env.SCHEDULE_INTERVAL || '30', 10),
    RPC_ENDPOINT: process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com', // Default Solana mainnet
};
