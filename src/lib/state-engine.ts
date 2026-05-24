import { 
  EngineState, 
  EngineSignal, 
  EngineAction, 
  StateReducerResult,
  SignalPriority,
  EngineTransition
} from '../types/state-engine';

export class DeterministicStateEngine {
  private currentState: EngineState = 'DISCONNECTED';
  private transitionHistory: EngineTransition[] = [];
  private lastReplaySeq: number = 0;

  constructor(initialState: EngineState = 'DISCONNECTED') {
    this.currentState = initialState;
  }

  public getState(): EngineState {
    return this.currentState;
  }

  /**
   * Resolves a batch of signals based on priority precedence.
   * "Critical signals pre-empt state transitions within the same evaluation cycle."
   */
  public step(signals: EngineSignal[]): StateReducerResult {
    const sortedSignals = this.resolvePrecedence(signals);
    let workingState = this.currentState;
    const actions: EngineAction[] = [];
    const logs: string[] = [];

    for (const signal of sortedSignals) {
      const { next_state, actions: signalActions, logs: signalLogs, vetoed } = this.reduce(workingState, signal);
      
      logs.push(...signalLogs);
      
      if (!vetoed) {
        if (next_state !== workingState) {
          this.transitionHistory.push({
            from: workingState,
            to: next_state,
            trigger_signal_id: signal.id,
            timestamp: Date.now()
          });
          workingState = next_state;
        }
        actions.push(...signalActions);
      } else {
        logs.push(`[VETO] Transition from ${workingState} to ${next_state} blocked by safety constraint.`);
      }
    }

    this.currentState = workingState;
    return {
      next_state: workingState,
      actions,
      logs
    };
  }

  private resolvePrecedence(signals: EngineSignal[]): EngineSignal[] {
    const priorityMap: Record<SignalPriority, number> = {
      'CRITICAL': 0,
      'HIGH': 1,
      'MEDIUM': 2,
      'LOW': 3
    };

    return [...signals].sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
  }

  /**
   * Pure state reduction logic (State, Signal) -> NextState
   */
  private reduce(state: EngineState, signal: EngineSignal): { next_state: EngineState, actions: EngineAction[], logs: string[], vetoed: boolean } {
    let next_state = state;
    const actions: EngineAction[] = [];
    const logs: string[] = [`Processing ${signal.type} (${signal.priority}) at state ${state}`];
    let vetoed = false;

    // Transition Veto Hooks
    const checkVeto = (from: EngineState, to: EngineState): boolean => {
      // "prevents catastrophic disconnects mid-replay"
      if (from === 'REPLAY_SYNC' && to === 'DISCONNECTED' && signal.type !== 'FORCED_TERMINATION') {
        return true;
      }
      return false;
    };

    switch (state) {
      case 'DISCONNECTED':
        if (signal.type === 'CONNECT_REQUEST') {
          next_state = 'CONNECTING';
          actions.push({ type: 'INIT_HANDSHAKE', payload: {}, priority: 'HIGH' });
        }
        break;

      case 'CONNECTING':
        if (signal.type === 'SESSION_VALIDATED') {
          next_state = 'SESSION_VALIDATED';
          actions.push({ type: 'NOTIFY_SESSION_READY', payload: {}, priority: 'MEDIUM' });
        } else if (signal.type === 'HEARTBEAT_TIMEOUT') {
          next_state = 'DISCONNECTED';
          actions.push({ type: 'CLEANUP_SOCKET', payload: {}, priority: 'CRITICAL' });
        }
        break;

      case 'SESSION_VALIDATED':
        if (signal.type === 'START_REPLAY') {
          next_state = 'REPLAY_SYNC';
          actions.push({ type: 'FETCH_REPLAY_RANGE', payload: { start_seq: signal.payload.seq || 0 }, priority: 'HIGH' });
        }
        break;

      case 'REPLAY_SYNC':
        if (signal.type === 'REPLAY_COMPLETE') {
          next_state = 'LIVE';
          actions.push({ type: 'ENABLE_LIVE_FEED', payload: {}, priority: 'HIGH' });
        } else if (signal.type === 'SEQ_GAP_DETECTED') {
          logs.push(`Gap detected in replay at ${signal.payload.seq}. Triggering idempotent recovery.`);
          // Idempotent recovery rule: same seq produces same output
          actions.push({ type: 'RETRY_REPLAY_RANGE', payload: { start_seq: signal.payload.seq }, priority: 'HIGH' });
        } else if (signal.type === 'HEARTBEAT_TIMEOUT') {
          next_state = 'DISCONNECTED';
        }
        break;

      case 'LIVE':
        if (signal.type === 'PRESSURE' && signal.payload.level > 0.9) {
          next_state = 'DEGRADED';
          actions.push({ type: 'ACTIVATE_CIRCUIT_BREAKER', payload: {}, priority: 'CRITICAL' });
        } else if (signal.type === 'DISCONNECT') {
          next_state = 'DISCONNECTED';
        }
        break;
      
      case 'DEGRADED':
        if (signal.type === 'PRESSURE' && signal.payload.level < 0.5) {
          next_state = 'LIVE';
          actions.push({ type: 'DEACTIVATE_CIRCUIT_BREAKER', payload: {}, priority: 'MEDIUM' });
        }
        break;
    }

    if (next_state !== state && checkVeto(state, next_state)) {
      vetoed = true;
    }

    return { next_state, actions, logs, vetoed };
  }

  public getHistory(): EngineTransition[] {
    return [...this.transitionHistory];
  }
}
