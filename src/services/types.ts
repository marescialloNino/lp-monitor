// src/services/types.ts

export interface LiquidityProfileEntry {
  binId: number;             // Bin identifier
  price: string;             // Price at this bin
  positionLiquidity: string; //  liquidity contribution to this bin
  positionXAmount: string;   //  X token amount in this bin (adjusted for decimals)
  positionYAmount: string;   //  Y token amount in this bin (adjusted for decimals)
  liquidityShare: string;    //  percentage share of the bin’s total liquidity
}

export interface PositionInfo {
  id: string;
  owner: string;
  pool: string;
  tokenX: string;
  tokenY: string;
  tokenXSymbol?: string;
  tokenYSymbol?: string;
  tokenXDecimals: number;
  tokenYDecimals: number;
  amountX: string;
  amountY: string;
  lowerBinId: number;
  upperBinId: number;
  activeBinId: number;
  isInRange: boolean;
  unclaimedFeeX: string;
  unclaimedFeeY: string;
  liquidityProfile: LiquidityProfileEntry[];
}
