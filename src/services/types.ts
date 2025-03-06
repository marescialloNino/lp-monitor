// services/types.ts
export interface PositionData {
    publicKey: string;
    positionData: {
      totalXAmount: string;
      totalYAmount: string;
      positionBinData: {
        binId: number;
        price: string;
        positionLiquidity: string;
        [key: string]: any;
      }[];
      lowerBinId: number;
      upperBinId: number;
      feeX: string;
      feeY: string;
      [key: string]: any;
    };
    [key: string]: any;
  }