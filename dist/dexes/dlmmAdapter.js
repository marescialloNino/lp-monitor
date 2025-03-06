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
exports.fetchPositions = void 0;
const web3_js_1 = require("@solana/web3.js");
const dlmm_1 = __importDefault(require("@meteora-ag/dlmm"));
const solana_1 = require("../chains/solana");
/**
 * Retrieves LP positions for the given wallet address using the DLMM library.
 */
function fetchPositions(walletAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = (0, solana_1.getSolanaConnection)();
        const user = new web3_js_1.PublicKey(walletAddress);
        // Call DLMM’s method to retrieve all LB pair positions for the user.
        // (In the original lp4fun code this was wrapped with a retry mechanism.)
        const positions = yield dlmm_1.default.getAllLbPairPositionsByUser(connection, user);
        return positions;
    });
}
exports.fetchPositions = fetchPositions;
