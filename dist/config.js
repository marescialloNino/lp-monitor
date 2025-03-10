"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load .env variables
exports.config = {
    RPC_ENDPOINT: process.env.RPC_ENDPOINT || "https://rpc-proxy.segfaultx0.workers.dev",
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || "",
    SCHEDULE_INTERVAL: parseInt(process.env.SCHEDULE_INTERVAL || "30", 10),
};
