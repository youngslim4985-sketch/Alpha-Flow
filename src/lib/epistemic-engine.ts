import { z } from 'zod';
import { Annotation, DecisionEvent, DecisionSnapshot, DecisionType } from '../types/epistemic';
import { IntelligenceEvent } from '../types';
import { BoundedCache } from './cache';

const AnnotationSchema = z.object({
  text: z.string(),
  temporal_validity_ms: z.number().default(60000),
  confidence: z.number().min(0).max(1),
  source_agent: z.string(),
  metadata: z.record(z.string(), z.any()).optional()
});

export class EpistemicEngine {
  private cache: BoundedCache;
  private version: string = 'v2.1.0-alpha';

  constructor(cache: BoundedCache) {
    this.cache = cache;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Compiles raw AI output into a validated Annotation.
   */
  compileAnnotation(raw: any, eventId: string): Annotation | null {
    try {
      const parsed = AnnotationSchema.parse(raw);
      return {
        id: this.generateId(),
        event_id: eventId,
        source_agent: parsed.source_agent,
        text: parsed.text,
        temporal_validity_ms: parsed.temporal_validity_ms,
        confidence: parsed.confidence,
        contradiction_ids: [], // To be populated by cross-referencing logic
        metadata: parsed.metadata || {},
        timestamp: Date.now()
      };
    } catch (err) {
      console.warn('[ANNOTATION_COMPILER] Validation failure:', err);
      return null;
    }
  }

  /**
   * Main Hot Path decision logic.
   */
  async evaluate(asset: string, currentPrice: number): Promise<DecisionEvent> {
    const historicalEvents = this.cache.get(asset);
    const score = this.calculateHotPathScore(historicalEvents);
    
    const decision: DecisionType = score > 0.7 ? 'EXECUTE' : score < 0.3 ? 'AVOID' : 'HOLD';
    
    const snapshot: DecisionSnapshot = {
      id: this.generateId(),
      timestamp: Date.now(),
      asset,
      cache_state_hash: this.cache.getHash(asset),
      contributing_event_ids: historicalEvents.map(e => e.id),
      active_annotations: [], // Link compiled annotations here
      system_state: {
        buyingPower: 10000, // Placeholder for real system state
        positionSize: 0,
        lastSignal: decision
      }
    };

    return {
      id: this.generateId(),
      type: 'DECISION_FINALIZED',
      category: 'SIGNAL',
      clock: {
        source_time: Date.now(),
        ingest_time: Date.now(),
        kernel_time: Date.now(),
        logical_time: 0,
        sequence_id: `DEC-${Date.now()}`,
        stream_source: 'EPISTEMIC_ENGINE'
      },
      data: {
        decision,
        score,
        reasoning: `Score based on ${historicalEvents.length} events in hot path cache.`,
        snapshot,
        engine_version: this.version
      },
      causality_chain: historicalEvents.map(e => e.id)
    };
  }

  private calculateHotPathScore(events: IntelligenceEvent[]): number {
    if (events.length === 0) return 0.5;
    
    // Weighted scoring based on event frequency and recency
    const now = Date.now();
    let totalWeight = 0;
    let scoreSum = 0;

    events.forEach(event => {
      const age = now - event.clock.kernel_time;
      const weight = Math.max(0, 1 - (age / 300000)); // 5 min decay
      
      // Heuristic: Signal events carry more weight than market ticks
      const emphasis = event.category === 'SIGNAL' ? 2 : 1;
      
      totalWeight += weight * emphasis;
      
      if (event.type === 'ALPHA_SIGNAL') {
        const value = event.data.signal === 'BUY' ? 1 : event.data.signal === 'SELL' ? 0 : 0.5;
        scoreSum += value * weight * emphasis;
      } else {
        scoreSum += 0.5 * weight * emphasis;
      }
    });

    return totalWeight > 0 ? scoreSum / totalWeight : 0.5;
  }
}
