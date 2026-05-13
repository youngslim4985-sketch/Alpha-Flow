import { ProductionEvent } from '../../types';

export class LedgerAdapter {
  transform(entry: any): ProductionEvent {
    const id = entry.id || (crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9));
    
    return {
      id,
      type: 'audit.ledger.recorded',
      source: 'ledger',
      timestamp: entry.createdAt || new Date().toISOString(),
      correlationId: entry.transactionId || 'unknown-tx',
      causationId: entry.parentTransactionId,
      sequence: entry.version ?? 1,
      eventClock: Date.now(),
      schemaVersion: 1,
      partitionKey: entry.accountId,
      payload: {
        debit: entry.debit,
        credit: entry.credit,
        balance: entry.balance
      },
      metadata: {
        immutable: true,
        migrated: true,
        legacySource: 'ledger',
        originalId: entry.id
      }
    };
  }
}
