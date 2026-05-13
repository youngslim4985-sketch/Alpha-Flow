/**
 * Cryptographic utility for securing event integrity.
 */
export function signEvent(event: any): string {
  // In production, this would use a real private key
  const signaturePayload = `${event.id}-${event.type}-${event.timestamp}-${JSON.stringify(event.payload)}`;
  return btoa(signaturePayload).slice(0, 32);
}

export function verifyEvent(event: any, signature: string): boolean {
  return signEvent(event) === signature;
}
