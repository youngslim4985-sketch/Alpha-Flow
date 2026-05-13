import { ProductionEvent } from '../../types';

export class AlphaFlowAdapter {
  transform(event: any): ProductionEvent {
    const id = crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);
    const workflowId = event.workflowId || 'unknown-wf';
    
    return {
      id,
      type: `orchestration.${event.type}`,
      source: 'alpha-flow',
      timestamp: event.timestamp ?? new Date().toISOString(),
      correlationId: workflowId,
      causationId: event.parentEventId,
      sequence: event.sequence ?? 0,
      eventClock: Date.now(),
      schemaVersion: 1,
      partitionKey: workflowId,
      payload: {
        step: event.step,
        status: event.status,
        data: event.data
      },
      metadata: {
        migrated: true,
        legacySource: 'alpha-flow',
        originalId: event.id
      }
    };
  }
}
