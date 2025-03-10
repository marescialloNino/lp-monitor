import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

export const config = {
  RPC_ENDPOINT: process.env.RPC_ENDPOINT || "https://rpc-proxy.segfaultx0.workers.dev",
  WALLET_ADDRESS: process.env.WALLET_ADDRESS || "",
  SCHEDULE_INTERVAL: parseInt(process.env.SCHEDULE_INTERVAL || "30", 10),
};