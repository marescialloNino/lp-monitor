// services/positionAnalyzer.ts
interface AnalysisResult {
    tokenXQty: string;
    tokenYQty: string;
    lowerBoundary: number;
    upperBoundary: number;
    liquidityProfile: {
      binId: number;
      price: string;
      positionLiquidity: string;
    }[];
    isInRange: boolean;
    unclaimedFees: {
      feeX: string;
      feeY: string;
    };
  }
  
  interface Position {
    publicKey: any; // PublicKey type from @solana/web3.js
    lbPair: {
      activeId: number;
      [key: string]: any;
    };
    tokenX: {
      amount: bigint;
      decimal: number;
      [key: string]: any;
    };
    tokenY: {
      amount: bigint;
      decimal: number;
      [key: string]: any;
    };
    lbPairPositionsData: Array<{
      positionData: {
        lowerBinId: number;
        upperBinId: number;
        feeX: string;
        feeY: string;
        positionBinData: Array<{
          binId: number;
          price: string;
          positionLiquidity: string;
          [key: string]: any;
        }>;
        [key: string]: any;
      };
      [key: string]: any;
    }>;
  }
  
  export function analyzePosition(position: Position): AnalysisResult[] {
    try {
      const results: AnalysisResult[] = [];
  
      // Convert bigint amounts to strings with proper decimals
      const tokenXQty = (Number(position.tokenX.amount) / Math.pow(10, position.tokenX.decimal)).toString();
      const tokenYQty = (Number(position.tokenY.amount) / Math.pow(10, position.tokenY.decimal)).toString();
  
      for (const posData of position.lbPairPositionsData) {
        const positionData = posData.positionData;
  
        // Get boundaries
        const lowerBoundary = positionData.lowerBinId;
        const upperBoundary = positionData.upperBinId;
  
        // Get liquidity profile
        const liquidityProfile = positionData.positionBinData.map(bin => ({
          binId: bin.binId,
          price: bin.price,
          positionLiquidity: bin.positionLiquidity
        }));
  
        // Check if liquidity is in range
        const activeId = position.lbPair.activeId;
        const isInRange = activeId >= lowerBoundary && activeId <= upperBoundary;
  
        // Get unclaimed fees
        const unclaimedFees = {
          feeX: positionData.feeX,
          feeY: positionData.feeY
        };
  
        results.push({
          tokenXQty,
          tokenYQty,
          lowerBoundary,
          upperBoundary,
          liquidityProfile,
          isInRange,
          unclaimedFees
        });
      }
  
      return results;
    } catch (error) {
      console.error('Error analyzing position:', error);
      throw error;
    }
  }