import { PublicKey } from '@solana/web3.js';
import DLMM from '@meteora-ag/dlmm';
import { getSolanaConnection } from '../chains/solana';

/**
 * Retrieves LP positions for the given wallet address using the DLMM library.
 */
export async function fetchPositions(walletAddress: string): Promise<any> {
  const connection = getSolanaConnection();
  const user = new PublicKey(walletAddress);

  // Call DLMM’s method to retrieve all LB pair positions for the user.
  // (In the original lp4fun code this was wrapped with a retry mechanism.)
  const positions = await DLMM.getAllLbPairPositionsByUser(connection, user);
  return positions;
}
