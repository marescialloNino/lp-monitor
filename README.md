# LP Monitor

A TypeScript-based tool to monitor liquidity pool (LP) positions on the the Meteora DLMM protocol. It fetches positions for a specified wallet, generates a CSV summary (`LP_meteora_positions.csv`), and schedules periodic updates.

## Features
- Fetches LP positions from Meteora DLMM for a given Solana wallet.
- Generates a CSV with position details (token quantities, boundaries, fees, etc.).
- Runs on a configurable schedule (default: every 30 minutes).
- Logs raw position data to `positionData.log` for debugging.

## Prerequisites
- **Node.js**: Version 16.x or higher.
- **npm**: For package management.
- A Solana wallet address to monitor.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lp-monitor

2. Install dependencies and start project
    ```bash
    npm install
    npm run build
    npm start