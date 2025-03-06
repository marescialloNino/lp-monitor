import { fetchPositions } from '../dexes/dlmmAdapter';

/**
 * Retrieves positions for a given wallet and converts the result into an array.
 * (DLMM.getAllLbPairPositionsByUser may return a Map or object.)
 */
export async function retrievePositions(walletAddress: string): Promise<any[]> {
  const positionsData = await fetchPositions(walletAddress);
  
  // Convert the result to an array (adjust this based on the actual return type).
  if (positionsData instanceof Map) {
    return Array.from(positionsData.values());
  }
  return Object.values(positionsData);
}
