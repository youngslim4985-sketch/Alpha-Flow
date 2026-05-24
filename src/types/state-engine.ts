import { IntelligenceEvent } from '../types';

export type EngineState = 
  | 'DISCONNECTED' 
  | 'CONNECTING' 
  | 'SESSION_VALIDATED' 
  | 'REPLAY_SYNC' 
  | 'LIVE' 
  | 'DEGRADED';

export type SignalPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EngineSignal {
  id: string;
  type: string;
  priority: SignalPriority;
  payload: any;
  timestamp: number;
}

export interface EngineTransition {
  from: EngineState;
  to: EngineState;
  trigger_signal_id: string;
  timestamp: number;
}

export interface EngineAction {
  type: string;
  payload: any;
  priority: SignalPriority;
}

export interface StateReducerResult {
  next_state: EngineState;
  actions: EngineAction[];
  logs: string[];
}
