export type MarketData = {
  time: string;
  price: number;
  volume: number;
};

export type Signal = {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  confidence: number;
  entryZone: string;
  target: string;
  timestamp: string;
  reason: string;
};

export type OrderFlowEvent = {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
  isLarge: boolean;
};

export type SmartMoneySignal = {
  id: string;
  type: 'SWEEP' | 'DARK_POOL' | 'OPTIONS' | 'WALL';
  symbol: string;
  value: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  timestamp: string;
  details: string;
};

export type ReplaySession = {
  id: string;
  title: string;
  date: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  tags: string[];
};

export type BattleParticipant = {
  id: string;
  name: string;
  pnl: number;
  pnlPercentage: number;
  rank: number;
  isCurrentUser?: boolean;
};

export type TradeBattle = {
  id: string;
  title: string;
  ticker: string;
  timeLimit: string;
  participantsCount: number;
  startingBalance: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  type: 'SPEED' | 'STRATEGY' | 'REPLAY';
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  winRate: number;
  totalProfit: string;
  badges: string[];
  rank: number;
};

export type CoachMode = 'Strategist' | 'Tactical' | 'Analyst';

export type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
};

export type PortfolioSummary = {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  buyingPower: number;
};

export interface EventClock {
  /** External system timestamp (e.g. exchange time) */
  source_time: number;
  /** When the adapter received it */
  ingest_time: number;
  /** Canonical kernel ordering timestamp (authoritative) */
  kernel_time: number;
  /** Lamport/logical ordering for sub-millisecond precision */
  logical_time: number;
  /** Unique sequence identifier for replay integrity */
  sequence_id: string;
  /** Identifier of the origin stream */
  stream_source: string;
}

export type EventCategory = 'MARKET' | 'ORDER_FLOW' | 'SENTIMENT' | 'SIGNAL' | 'SYSTEM' | 'ORCHESTRATION' | 'AUDIT';

export interface IntelligenceEvent {
  readonly id: string;
  readonly type: string;
  readonly category: EventCategory;
  readonly clock: Readonly<EventClock>;
  readonly data: Readonly<any>;
  readonly causality_chain: readonly string[];
  readonly metadata?: Readonly<Record<string, any>>;
}

export interface LegacyEvent {
  id?: string;
  type: string;
  timestamp?: string;
  payload: unknown;
  metadata?: Record<string, unknown>;
}

export interface ProductionEvent<T = any> {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  correlationId: string;
  causationId?: string;
  sequence: number;
  eventClock: number;
  schemaVersion: number;
  partitionKey?: string;
  payload: T;
  metadata: {
    migrated: boolean;
    legacySource: string;
    originalId?: string;
    [key: string]: any;
  };
  signature?: string;
}
