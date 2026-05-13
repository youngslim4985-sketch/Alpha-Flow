import { AlphaFlowAdapter } from './adapters/alphaFlowAdapter';
import { LedgerAdapter } from './adapters/ledgerAdapter';
import { IntegrityValidator } from './validators/integrityValidator';
import { JetstreamPublisher } from './publishers/jetstreamPublisher';

const validator = new IntegrityValidator();
const publisher = new JetstreamPublisher();

export async function migrateAlphaFlow(events: any[]) {
  const adapter = new AlphaFlowAdapter();
  const results = [];

  for (const event of events) {
    try {
      const normalized = adapter.transform(event);
      validator.validate(normalized);
      const signed = validator.finalize(normalized);
      await publisher.publish(signed);
      results.push(signed);
    } catch (err) {
      console.error(`Migration failure on AlphaFlow event: ${event.id}`, err);
    }
  }
  return results;
}

export async function migrateLedger(entries: any[]) {
  const adapter = new LedgerAdapter();
  const results = [];

  for (const entry of entries) {
    try {
      const normalized = adapter.transform(entry);
      validator.validate(normalized);
      const signed = validator.finalize(normalized);
      await publisher.publish(signed);
      results.push(signed);
    } catch (err) {
      console.error(`Migration failure on Ledger entry: ${entry.id}`, err);
    }
  }
  return results;
}
