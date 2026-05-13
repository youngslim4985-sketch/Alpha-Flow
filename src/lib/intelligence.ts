import { IntelligenceEvent, EventClock, EventCategory } from '../types';

let logicalCounter = 0;
let lastKernelTime = 0;

/**
 * Creates a new IntelligenceEvent with canonical ordering and immutability.
 */
export function createEvent(
  type: string,
  category: EventCategory,
  data: any,
  source_time: number,
  stream_source: string,
  causality_chain: string[] = []
): IntelligenceEvent {
  const now = Date.now();
  
  // Ensure monotonic kernel time and logical ordering
  if (now <= lastKernelTime) {
    logicalCounter++;
  } else {
    lastKernelTime = now;
    logicalCounter = 0;
  }

  const clock: EventClock = {
    source_time,
    ingest_time: now,
    kernel_time: lastKernelTime,
    logical_time: logicalCounter,
    sequence_id: `${lastKernelTime}-${logicalCounter}-${Math.random().toString(36).substr(2, 9)}`,
    stream_source,
  };

  const event: IntelligenceEvent = {
    id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
    type,
    category,
    data,
    clock,
    causality_chain,
  };

  // Deeply freeze to ensure immutability as requested
  return deepFreeze(event);
}

/**
 * Canonical ordering strategy for events.
 */
export function sortEvents(events: IntelligenceEvent[]): IntelligenceEvent[] {
  return [...events].sort((a, b) => {
    if (a.clock.kernel_time !== b.clock.kernel_time) {
      return a.clock.kernel_time - b.clock.kernel_time;
    }
    return a.clock.logical_time - b.clock.logical_time;
  });
}

function deepFreeze(obj: any): any {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj.hasOwnProperty(prop) &&
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}
