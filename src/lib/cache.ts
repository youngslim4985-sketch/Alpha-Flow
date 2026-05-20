import { IntelligenceEvent } from '../types';
import { CachePolicy } from '../types/epistemic';

export class BoundedCache {
  private store: Map<string, IntelligenceEvent[]> = new Map();
  private policy: CachePolicy;

  constructor(policy: CachePolicy) {
    this.policy = policy;
  }

  /**
   * Adds an event to the cache with strict boundary enforcement.
   */
  push(event: IntelligenceEvent, asset: string = 'GLOBAL'): void {
    if (!this.store.has(asset)) {
      this.store.set(asset, []);
    }

    const buffer = this.store.get(asset)!;
    buffer.push(event);

    // Enforce size limit
    if (buffer.length > this.policy.event_limit) {
      buffer.shift();
    }

    // Enforce temporal limit
    const now = Date.now();
    while (buffer.length > 0 && (now - buffer[0].clock.kernel_time > this.policy.time_window_ms)) {
      buffer.shift();
    }
  }

  get(asset: string = 'GLOBAL'): IntelligenceEvent[] {
    return this.store.get(asset) || [];
  }

  /**
   * Generates a structural hash for verification of the current hot path state.
   */
  getHash(asset: string = 'GLOBAL'): string {
    const buffer = this.get(asset);
    const signature = buffer.map(e => `${e.id}:${e.clock.kernel_time}`).join('|');
    
    // Simple fast string hash
    let hash = 0;
    for (let i = 0; i < signature.length; i++) {
        const char = signature.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  clear(): void {
    this.store.clear();
  }
}
