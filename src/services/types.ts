// src/services/types.ts
export interface PositionInfo {
  id: string;               // Position public key
  owner: string;            // Wallet address
  pool: string;             // LB Pair public key
  tokenX: string;           // Mint address of token X
  tokenY: string;           // Mint address of token Y
  tokenXSymbol?: string;    // Optional symbol (e.g., SOL)
  tokenYSymbol?: string;    // Optional symbol (e.g., USDC)
  tokenXDecimals: number;   // Decimals for token X
  tokenYDecimals: number;   // Decimals for token Y
  amountX: string;          // Token X amount (adjusted for decimals)
  amountY: string;          // Token Y amount (adjusted for decimals)
  lowerBinId: number;       // Lower boundary (bin ID)
  upperBinId: number;       // Upper boundary (bin ID)
  activeBinId: number;      // Current active bin ID of the pool
  isInRange: boolean;       // Whether the position is in range
  unclaimedFeeX: string;    // Unclaimed fees for token X
  unclaimedFeeY: string;    // Unclaimed fees for token Y
  liquidityProfile: {       // Bin data for liquidity distribution
    binId: number;
    price: string;
    liquidity: string;
  }[];
}