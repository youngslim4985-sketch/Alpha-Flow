import { ProductionEvent } from '../../types';

/**
 * Publisher for the normalized event stream.
 * 
 * Note: In this environment, we use a bridge or EventEmitter 
 * if a real NATS cluster is not provisioned.
 */
export class JetstreamPublisher {
  async publish(event: ProductionEvent) {
    if (process.env.NATS_URL) {
      try {
        const { connect } = await import('nats');
        const nc = await connect({ servers: process.env.NATS_URL });
        const js = nc.jetstream();
        await js.publish(event.type, Buffer.from(JSON.stringify(event)));
        await nc.close();
      } catch (err) {
        console.warn('NATS Publish Failed - Falling back to local kernel pipe', err);
        this.localPublish(event);
      }
    } else {
      this.localPublish(event);
    }
  }

  private localPublish(event: ProductionEvent) {
    // Local memory-mapped event relay for the dev environment
    const relayEvent = new CustomEvent('production_event', { detail: event });
    window.dispatchEvent(relayEvent);
    console.log(`[JETSTREAM_SIMULATOR] Published: ${event.type}`);
  }
}
