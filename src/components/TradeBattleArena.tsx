import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Trophy, 
  Users, 
  Timer, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Bot,
  ChevronRight,
  Medal,
  Target,
  Play
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { TradeBattle, BattleParticipant, LeaderboardEntry } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const mockBattles: TradeBattle[] = [
  {
    id: 'b1',
    title: 'NVDA Morning Scalp',
    ticker: 'NVDA',
    timeLimit: '10m',
    participantsCount: 24,
    startingBalance: 10000,
    status: 'ACTIVE',
    type: 'SPEED'
  },
  {
    id: 'b2',
    title: 'TSLA Strategy Showdown',
    ticker: 'TSLA',
    timeLimit: '30m',
    participantsCount: 12,
    startingBalance: 25000,
    status: 'UPCOMING',
    type: 'STRATEGY'
  },
  {
    id: 'b3',
    title: 'GME Squeeze Replay',
    ticker: 'GME',
    timeLimit: '15m',
    participantsCount: 50,
    startingBalance: 5000,
    status: 'UPCOMING',
    type: 'REPLAY'
  }
];

const mockParticipants: BattleParticipant[] = [
  { id: 'p1', name: 'TraderX', pnl: 420, pnlPercentage: 4.2, rank: 1 },
  { id: 'p2', name: 'AlphaWolf', pnl: 380, pnlPercentage: 3.8, rank: 2 },
  { id: 'p3', name: 'TerranceF', pnl: 310, pnlPercentage: 3.1, rank: 3, isCurrentUser: true },
  { id: 'p4', name: 'MarketSniper', pnl: 250, pnlPercentage: 2.5, rank: 4 },
  { id: 'p5', name: 'LiquidityHunter', pnl: -120, pnlPercentage: -1.2, rank: 5 },
];

const mockGlobalLeaderboard: LeaderboardEntry[] = [
  { id: 'l1', name: 'MarketSniper', winRate: 68, totalProfit: '$142k', badges: ['Momentum King', 'Order Flow Master'], rank: 1 },
  { id: 'l2', name: 'TerranceF', winRate: 62, totalProfit: '$98k', badges: ['Liquidity Hunter'], rank: 2 },
  { id: 'l3', name: 'AlphaWolf', winRate: 59, totalProfit: '$85k', badges: ['Scalp God'], rank: 3 },
];

export default function TradeBattleArena() {
  const [activeBattle, setActiveBattle] = useState<TradeBattle | null>(null);
  const [participants, setParticipants] = useState<BattleParticipant[]>(mockParticipants);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeBattle && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Randomly update participants for simulation
        setParticipants(prev => 
          prev.map(p => ({
            ...p,
            pnl: p.pnl + (Math.random() * 20 - 10),
            pnlPercentage: Number((p.pnlPercentage + (Math.random() * 0.2 - 0.1)).toFixed(2))
          })).sort((a, b) => b.pnl - a.pnl).map((p, i) => ({ ...p, rank: i + 1 }))
        );
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeBattle, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 h-screen flex flex-col gap-8 overflow-hidden">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-bearish mb-2">
            <Swords className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Competitive Arena</span>
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Trade Battles</h2>
          <p className="text-white/40 text-sm mt-1">Compete with the best traders in real-time market conditions.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <Medal className="w-4 h-4 text-warning" />
            <span className="text-xs font-mono font-bold">RANK: #42 (GLOBAL)</span>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!activeBattle ? (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0"
          >
            {/* Active/Upcoming Battles */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-electric-accent" />
                Live & Upcoming Battles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockBattles.map((battle) => (
                  <div 
                    key={battle.id} 
                    className="glass-panel p-6 glow-hover group cursor-pointer relative overflow-hidden"
                    onClick={() => battle.status === 'ACTIVE' && setActiveBattle(battle)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full",
                        battle.status === 'ACTIVE' ? "bg-bullish/10 text-bullish animate-pulse" : "bg-white/10 text-white/40"
                      )}>
                        {battle.status}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                        <Users className="w-3 h-3" />
                        {battle.participantsCount} Traders
                      </div>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-1">{battle.title}</h4>
                    <p className="text-xs text-white/40 mb-4 font-mono">{battle.ticker} • {battle.timeLimit} Limit</p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        Start: ${battle.startingBalance.toLocaleString()}
                      </div>
                      <button className={cn(
                        "btn-primary px-4 py-2 text-xs flex items-center gap-2",
                        battle.status !== 'ACTIVE' && "opacity-50 cursor-not-allowed"
                      )}>
                        {battle.status === 'ACTIVE' ? 'Enter Arena' : 'Join Waitlist'}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Leaderboard Preview */}
              <div className="glass-panel p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-warning" />
                    Global Rankings
                  </h3>
                  <button className="text-xs text-electric-accent font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {mockGlobalLeaderboard.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-institutional">
                        #{entry.rank}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{entry.name}</span>
                          <div className="flex gap-1">
                            {entry.badges.map(b => (
                              <span key={b} className="text-[8px] px-1.5 py-0.5 rounded bg-electric-accent/10 text-electric-accent border border-electric-accent/20">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] text-white/40">Win Rate: <span className="text-bullish">{entry.winRate}%</span></span>
                          <span className="text-[10px] text-white/40">Total Profit: <span className="text-white">{entry.totalProfit}</span></span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Battle Stats / Profile */}
            <div className="space-y-6">
              <div className="glass-panel p-6 bg-gradient-to-br from-bearish/10 to-transparent border-bearish/20">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Your Battle Profile</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Battles Won</span>
                    <span className="text-lg font-display font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Win Streak</span>
                    <span className="text-lg font-display font-bold text-bullish">3 🔥</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Avg. ROI</span>
                    <span className="text-lg font-display font-bold text-electric-accent">+4.2%</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Recent Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2" title="Momentum King">
                      <Zap className="w-4 h-4 text-institutional" />
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2" title="Liquidity Hunter">
                      <Target className="w-4 h-4 text-electric-accent" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Arena Rules</h3>
                <ul className="space-y-3 text-xs text-white/60">
                  <li className="flex gap-2 italic">"1. All participants start with the same balance."</li>
                  <li className="flex gap-2 italic">"2. Real-time market data is used for all trades."</li>
                  <li className="flex gap-2 italic">"3. Highest P&L at the end of the time limit wins."</li>
                  <li className="flex gap-2 italic">"4. AI Wingman is active for all participants."</li>
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="arena"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col gap-6 min-h-0"
          >
            {/* Active Battle Header */}
            <div className="glass-panel p-4 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Active Battle</span>
                  <span className="text-lg font-display font-bold">{activeBattle.title}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Ticker</span>
                  <span className="text-lg font-mono font-bold text-electric-accent">{activeBattle.ticker}</span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Time Remaining</span>
                  <div className="flex items-center gap-2 text-2xl font-mono font-bold text-institutional">
                    <Timer className="w-5 h-5" />
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveBattle(null)}
                  className="px-4 py-2 rounded-xl bg-bearish/10 text-bearish text-xs font-bold hover:bg-bearish/20 transition-all"
                >
                  Exit Arena
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
              {/* Leaderboard */}
              <div className="glass-panel p-6 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Medal className="w-4 h-4 text-warning" />
                    Leaderboard
                  </h3>
                  <span className="text-[10px] text-white/40 font-mono">{activeBattle.participantsCount} Active</span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  {participants.map((p) => (
                    <div 
                      key={p.id} 
                      className={cn(
                        "p-3 rounded-xl border transition-all duration-300 flex items-center gap-3",
                        p.isCurrentUser 
                          ? "bg-electric-accent/10 border-electric-accent/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]" 
                          : "bg-white/5 border-white/5"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
                        p.rank === 1 ? "bg-warning text-primary-dark" : "bg-white/10 text-white/60"
                      )}>
                        {p.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{p.name} {p.isCurrentUser && "(You)"}</div>
                        <div className={cn(
                          "text-[10px] font-mono",
                          p.pnl >= 0 ? "text-bullish" : "text-bearish"
                        )}>
                          {p.pnl >= 0 ? '+' : ''}{p.pnlPercentage}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-white/60">${p.pnl.toFixed(0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trading View (Mock) */}
              <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                <div className="glass-panel p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <TrendingUp className="w-full h-full" />
                  </div>
                  <div className="text-center z-10">
                    <h4 className="text-4xl font-mono font-bold mb-2">894.52</h4>
                    <div className="flex items-center justify-center gap-2 text-bullish">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-bold">+1.24%</span>
                    </div>
                  </div>
                  
                  {/* AI Wingman Overlay */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-institutional/10 border border-institutional/20 backdrop-blur-md flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-institutional/20">
                      <Bot className="w-6 h-6 text-institutional" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-institutional mb-1">
                        <Zap className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Tactical Wingman</span>
                      </div>
                      <p className="text-xs text-white/90 leading-tight italic">
                        "Sweep detected at 892. You have momentum advantage. Watch for resistance at 896."
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-bullish text-primary-dark font-display font-bold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    MARKET BUY
                  </button>
                  <button className="bg-bearish text-primary-dark font-display font-bold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    MARKET SELL
                  </button>
                </div>
              </div>

              {/* Battle Feed / Activity */}
              <div className="glass-panel p-6 flex flex-col min-h-0">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Battle Feed</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {[
                    { user: 'TraderX', action: 'entered LONG', ticker: 'NVDA', time: '12s ago' },
                    { user: 'AlphaWolf', action: 'closed SHORT', ticker: 'NVDA', time: '45s ago', pnl: '+1.2%' },
                    { user: 'MarketSniper', action: 'entered SHORT', ticker: 'NVDA', time: '1m ago' },
                  ].map((item, i) => (
                    <div key={i} className="text-[10px] leading-relaxed border-l-2 border-white/5 pl-3 py-1">
                      <span className="text-white/40 font-mono">{item.time}</span>
                      <p className="mt-1">
                        <span className="font-bold text-white">{item.user}</span> {item.action} <span className="text-electric-accent">{item.ticker}</span>
                        {item.pnl && <span className="text-bullish ml-1">({item.pnl})</span>}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-warning mb-2">
                    <Medal className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Your Position</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-lg font-mono font-bold text-bullish">+3.1%</div>
                      <div className="text-[10px] text-white/40">Rank #3</div>
                    </div>
                    <button className="text-[10px] font-bold text-electric-accent hover:underline">Manage Trade</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
