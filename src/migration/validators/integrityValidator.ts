import { ProductionEvent } from '../../types';
import { signEvent } from '../../lib/security';

export class IntegrityValidator {
  validate(event: ProductionEvent): boolean {
    if (!event.type) throw new Error('Missing event type');
    if (!event.correlationId) {
      throw new Error('Missing correlationId');
    }
    if (!event.timestamp) {
      throw new Error('Missing timestamp');
    }
    return true;
  }

  finalize(event: ProductionEvent): ProductionEvent {
    return {
      ...event,
      signature: signEvent(event)
    };
  }
}
