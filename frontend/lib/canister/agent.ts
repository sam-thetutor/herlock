import { HttpAgent, Identity } from '@dfinity/agent';
import { IC_HOST } from '../utils/constants';

/**
 * Create an HTTP agent for canister communication
 */
export async function createAgent(identity?: Identity): Promise<HttpAgent> {
  const agent = new HttpAgent({
    host: IC_HOST,
    identity,
  });

  // For local development, we need to fetch the root key
  if (IC_HOST.includes('127.0.0.1') || IC_HOST.includes('localhost')) {
    await agent.fetchRootKey();
  }

  return agent;
}

/**
 * Get the default agent (no identity)
 */
export async function getDefaultAgent(): Promise<HttpAgent> {
  return createAgent();
}

