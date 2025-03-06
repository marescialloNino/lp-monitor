// src/services/positionService.ts
import { fetchPositions } from '../dexes/dlmmAdapter';
import { PositionInfo } from './types';

export async function retrievePositions(walletAddress: string): Promise<PositionInfo[]> {
  return await fetchPositions(walletAddress);
}