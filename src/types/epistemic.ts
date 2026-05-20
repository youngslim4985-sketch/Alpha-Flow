import { IntelligenceEvent } from '../types';

export interface CachePolicy {
  time_window_ms: number;     // e.g. 300_000 (5 min)
  event_limit: number;        // e.g. 200
  asset_partitioning: boolean;
}

export interface Annotation {
  id: string;
  event_id: string;
  source_agent: string;
  text: string;
  temporal_validity_ms: number;
  confidence: number;
  contradiction_ids: string[];
  metadata: Record<string, any>;
  timestamp: number;
}

export interface DecisionSnapshot {
  id: string;
  timestamp: number;
  asset: string;
  cache_state_hash: string;
  contributing_event_ids: string[];
  active_annotations: string[];
  system_state: {
    buyingPower: number;
    positionSize: number;
    lastSignal: string;
  };
}

export type DecisionType = 'EXECUTE' | 'HOLD' | 'AVOID' | 'LIQUIDATE';

export interface DecisionEvent extends IntelligenceEvent {
  category: 'SIGNAL';
  type: 'DECISION_FINALIZED';
  data: {
    decision: DecisionType;
    score: number;
    reasoning: string;
    snapshot: DecisionSnapshot;
    engine_version: string;
  };
}

export interface StateTransition {
  id: string;
  from_belief_state: string;
  to_belief_state: string;
  trigger_event_id: string;
  confidence_delta: number;
  timestamp: number;
  annotations: string[];
  snapshot_ref: string;
}
