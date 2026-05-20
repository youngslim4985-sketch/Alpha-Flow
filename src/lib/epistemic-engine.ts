import { z } from 'zod';
import { Annotation, DecisionEvent, DecisionSnapshot, DecisionType, Regime } from '../types/epistemic';
import { IntelligenceEvent, IntelligenceIntent } from '../types';
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

  private regimes: Regime[] = [
    { id: 'r1', name: 'LOW_VOL_RANGE', prevalence: 0.68, mean_return: 0.0008, sharpe_approx: 0.45, effect_size: 0.22 },
    { id: 'r2', name: 'MOMENTUM_NOISE', prevalence: 0.25, mean_return: 0.0012, sharpe_approx: 0.71, effect_size: 0.38 },
    { id: 'r3', name: 'REVERSAL_MICRO', prevalence: 0.07, mean_return: -0.0009, sharpe_approx: -0.31, effect_size: 0.19 }
  ];

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
        contradiction_ids: [],
        metadata: parsed.metadata || {},
        timestamp: Date.now()
      };
    } catch (err) {
      console.warn('[ANNOTATION_COMPILER] Validation failure:', err);
      return null;
    }
  }

  /**
   * Main Hot Path decision logic upgraded for liquidity and regime detection.
   */
  async evaluate(asset: string, currentPrice: number): Promise<DecisionEvent> {
    const historicalEvents = this.cache.get(asset);
    const regime = this.detectRegime(historicalEvents);
    const { liquidity_depth, order_pressure } = this.analyzeLiquidity(historicalEvents);
    
    // Weighted scoring logic including regime-specific bias
    const rawScore = this.calculateHotPathScore(historicalEvents);
    const regimeBias = regime.name === 'MOMENTUM_NOISE' ? 1.2 : regime.name === 'REVERSAL_MICRO' ? 0.8 : 1.0;
    const score = Math.min(1, rawScore * regimeBias);
    
    const decision: DecisionType = score > 0.7 ? 'EXECUTE' : score < 0.3 ? 'AVOID' : 'HOLD';
    
    let intent_id: string | undefined;
    if (decision === 'EXECUTE') {
        const intent = this.generateIntent(asset, decision, score);
        intent_id = intent.id;
        // In a real system, this would be published to the INTENT_STREAM
        console.log(`[INTENT_GENERATOR] Created Intent: ${intent.id} -> ${intent.action}`);
    }

    const snapshot: DecisionSnapshot = {
      id: this.generateId(),
      timestamp: Date.now(),
      asset,
      cache_state_hash: this.cache.getHash(asset),
      contributing_event_ids: historicalEvents.map(e => e.id),
      active_annotations: [],
      regime,
      liquidity_depth,
      order_pressure,
      system_state: {
        buyingPower: 10000,
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
        reasoning: `Upgraded Option C Logic: Regime=${regime.name}, Pressure=${order_pressure.toFixed(2)}, Score=${score.toFixed(2)}`,
        snapshot,
        engine_version: this.version,
        intent_id
      },
      causality_chain: historicalEvents.map(e => e.id)
    };
  }

  private detectRegime(events: IntelligenceEvent[]): Regime {
    // Simplified regime detection based on event density and signal frequency
    const signalCount = events.filter(e => e.category === 'SIGNAL').length;
    if (signalCount > 3) return this.regimes[1]; // MOMENTUM_NOISE
    if (signalCount === 0) return this.regimes[0]; // LOW_VOL_RANGE
    return this.regimes[2]; // REVERSAL_MICRO
  }

  private analyzeLiquidity(events: IntelligenceEvent[]): { liquidity_depth: number, order_pressure: number } {
    // Simulating liquidity shift detection
    const marketEvents = events.filter(e => e.category === 'MARKET');
    const depthBase = 1500000; // $1.5M base depth
    const pressure = Math.random() * 2 - 1; // -1 (sell pressure) to 1 (buy pressure)
    
    return {
      liquidity_depth: depthBase + (marketEvents.length * 10000),
      order_pressure: pressure
    };
  }

  private generateIntent(asset: string, action: string, confidence: number): IntelligenceIntent {
    return {
      id: this.generateId(),
      trigger_event_id: 'auto-logic',
      action: `POSITION_${asset}_${action}`,
      confidence,
      requires_approval: confidence < 0.8,
      metadata: {
        engine: this.version,
        timestamp: Date.now()
      }
    };
  }

  private calculateHotPathScore(events: IntelligenceEvent[]): number {
    if (events.length === 0) return 0.5;
    
    const now = Date.now();
    let totalWeight = 0;
    let scoreSum = 0;

    events.forEach(event => {
      const age = now - event.clock.kernel_time;
      const weight = Math.max(0, 1 - (age / 300000));
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
