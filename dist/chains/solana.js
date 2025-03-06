"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolanaConnection = void 0;
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
function getSolanaConnection() {
    return new web3_js_1.Connection(config_1.config.RPC_ENDPOINT, 'confirmed');
}
exports.getSolanaConnection = getSolanaConnection;
