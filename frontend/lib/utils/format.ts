// Formatting utilities

/**
 * Format satoshis to BTC
 */
export function formatSatoshiToBTC(satoshi: bigint | number): string {
  const sat = typeof satoshi === 'bigint' ? Number(satoshi) : satoshi;
  return (sat / 100_000_000).toFixed(8);
}

/**
 * Format satoshis to BTC with units
 */
export function formatBalance(satoshi: bigint | number): string {
  const btc = formatSatoshiToBTC(satoshi);
  return `${btc} BTC`;
}

/**
 * Format satoshis with commas
 */
export function formatSatoshi(satoshi: bigint | number): string {
  const sat = typeof satoshi === 'bigint' ? Number(satoshi) : satoshi;
  return sat.toLocaleString('en-US');
}

/**
 * Format Bitcoin amount (alias for formatBalance for clarity)
 */
export function formatBitcoin(satoshi: bigint | number): string {
  return formatBalance(satoshi);
}

/**
 * Format date to readable string
 * Backend stores timestamps in milliseconds, so no conversion needed
 */
export function formatDate(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  const date = new Date(ts); // Timestamp is already in milliseconds
  return date.toLocaleString();
}

/**
 * Format seconds to days
 */
export function formatDays(seconds: number): string {
  const days = seconds / (24 * 60 * 60);
  return days.toFixed(1);
}

/**
 * Format seconds to human readable countdown timer
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    // Less than 1 minute: show seconds
    return `${Math.floor(seconds)}s`;
  } else if (seconds < 3600) {
    // Less than 1 hour: show minutes and seconds
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  } else if (seconds < 86400) {
    // Less than 1 day: show hours and minutes
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  } else {
    // 1 day or more: show days and hours
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }
}

/**
 * Format Bitcoin address for display (truncated)
 */
export function formatBitcoinAddress(address: string | null | undefined): string {
  if (!address) return 'Not set';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

/**
 * Format principal for display
 */
export function formatPrincipal(principal: string | null | undefined): string {
  if (!principal) return '';
  if (principal.length <= 10) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-5)}`;
}

