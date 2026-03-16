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
