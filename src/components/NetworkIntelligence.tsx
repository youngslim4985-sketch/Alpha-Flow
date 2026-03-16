import React from 'react';
import { motion } from 'motion/react';
import { 
  Network, 
  Brain, 
  Database, 
  Share2, 
  TrendingUp, 
  Users, 
  Zap, 
  ShieldCheck,
  Activity,
  Cpu,
  Globe,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

const networkStats = [
  { time: '00:00', signals: 120, accuracy: 68 },
  { time: '04:00', signals: 450, accuracy: 72 },
  { time: '08:00', signals: 890, accuracy: 75 },
  { time: '12:00', signals: 1200, accuracy: 79 },
  { time: '16:00', signals: 950, accuracy: 77 },
  { time: '20:00', signals: 600, accuracy: 74 },
];

export default function NetworkIntelligence() {
  return (
    <div className="h-screen flex flex-col bg-[#05080A] text-white overflow-hidden font-sans">
      {/* Header: Network Status */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-electric-accent/10 flex items-center justify-center border border-electric-accent/20">
            <Network className="w-5 h-5 text-electric-accent" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight">Alpha OS</h1>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Network Intelligence Layer</p>
          </div>
        </div>

        <div className="flex gap-8">
          <StatMini label="Active Nodes" value="12,402" />
          <StatMini label="Signals/Sec" value="84.2" />
          <StatMini label="Network Accuracy" value="78.4%" />
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-bullish/10 border border-bullish/20">
          <div className="w-2 h-2 rounded-full bg-bullish animate-pulse" />
          <span className="text-[10px] font-bold text-bullish uppercase tracking-widest">Neural Sync Active</span>
        </div>
      </header>

      {/* Main Content: The Three Engines */}
      <main className="flex-1 p-6 grid grid-cols-12 grid-rows-6 gap-6 min-h-0 overflow-hidden">
        
        {/* Market Intelligence Engine */}
        <div className="col-span-12 lg:col-span-4 row-span-3 glass-panel p-6 flex flex-col min-h-0 relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-electric-accent/5 blur-3xl rounded-full group-hover:bg-electric-accent/10 transition-colors" />
          <EngineHeader icon={<Globe className="w-5 h-5" />} title="Market Intelligence" subtitle="Flow & Liquidity Engine" />
          
          <div className="mt-6 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[9px] font-bold text-white/20 uppercase mb-1">Flow Detection</p>
                <p className="text-xl font-display font-bold text-electric-accent">98.2%</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[9px] font-bold text-white/20 uppercase mb-1">Liquidity Walls</p>
                <p className="text-xl font-display font-bold text-electric-accent">42 Active</p>
              </div>
            </div>
            
            <div className="flex-1 bg-black/20 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-3 tracking-widest">Live Flow Sync</p>
              <div className="space-y-2">
                <FlowSyncItem symbol="NVDA" type="Institutional Buy" confidence={94} />
                <FlowSyncItem symbol="TSLA" type="Gamma Squeeze" confidence={82} />
                <FlowSyncItem symbol="AMD" type="Dark Pool Print" confidence={88} />
              </div>
            </div>
          </div>
        </div>

        {/* Trader Intelligence Engine */}
        <div className="col-span-12 lg:col-span-4 row-span-3 glass-panel p-6 flex flex-col min-h-0 relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-bullish/5 blur-3xl rounded-full group-hover:bg-bullish/10 transition-colors" />
          <EngineHeader icon={<Brain className="w-5 h-5" />} title="Trader Intelligence" subtitle="Behavioral & Psychology Engine" />
          
          <div className="mt-6 flex-1 flex flex-col">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-2 tracking-widest">Aggregated Behavioral Insights</p>
              <p className="text-xs text-white/80 leading-relaxed italic">
                "Network-wide data shows 64% of traders are exiting winning positions too early in the current volatility regime. AI Coach is adjusting exit logic for all nodes."
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <BehavioralStat label="FOMO Index" value="Low" color="text-bullish" />
              <BehavioralStat label="Revenge Trading Risk" value="Moderate" color="text-warning" />
              <BehavioralStat label="Strategy Discipline" value="84%" color="text-electric-accent" />
            </div>
          </div>
        </div>

        {/* Strategy Intelligence Engine */}
        <div className="col-span-12 lg:col-span-4 row-span-3 glass-panel p-6 flex flex-col min-h-0 relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#7C4DFF]/5 blur-3xl rounded-full group-hover:bg-[#7C4DFF]/10 transition-colors" />
          <EngineHeader icon={<Database className="w-5 h-5" />} title="Strategy Intelligence" subtitle="Optimization & Ranking Engine" />
          
          <div className="mt-6 flex-1 flex flex-col">
            <div className="flex-1 space-y-4">
              <StrategyRankItem rank={1} name="Momentum Breakout" users={3200} winRate={63} />
              <StrategyRankItem rank={2} name="Mean Reversion" users={1850} winRate={58} />
              <StrategyRankItem rank={3} name="Liquidity Sweep" users={1240} winRate={61} />
            </div>
            
            <button className="mt-6 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-3 h-3" />
              Deploy New Strategy to Network
            </button>
          </div>
        </div>

        {/* Network Performance Visualization */}
        <div className="col-span-12 lg:col-span-8 row-span-3 glass-panel p-6 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-electric-accent" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Network Learning Curve</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-accent" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Signals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-bullish" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Accuracy</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkStats}>
                <defs>
                  <linearGradient id="colorSignals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2ECC71" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111A23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="signals" stroke="#00E5FF" fillOpacity={1} fill="url(#colorSignals)" strokeWidth={2} />
                <Area type="monotone" dataKey="accuracy" stroke="#2ECC71" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Data Loop Visualization */}
        <div className="col-span-12 lg:col-span-4 row-span-3 glass-panel p-6 flex flex-col min-h-0 bg-gradient-to-br from-electric-accent/5 to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <ArrowRightLeft className="w-5 h-5 text-electric-accent" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">The Intelligence Loop</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-between py-2">
            <LoopStep step="1" title="User Actions" desc="Trades, strategies, and behavior logged." />
            <div className="w-px h-4 bg-white/10 ml-4" />
            <LoopStep step="2" title="Data Ingestion" desc="Network-wide patterns identified." />
            <div className="w-px h-4 bg-white/10 ml-4" />
            <LoopStep step="3" title="AI Learning" desc="Engines optimize based on outcomes." />
            <div className="w-px h-4 bg-white/10 ml-4" />
            <LoopStep step="4" title="Improved Insights" desc="Better signals delivered to all nodes." />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatMini({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col justify-center">
      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-mono font-bold text-white/80">{value}</p>
    </div>
  );
}

function EngineHeader({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
        <div className="text-electric-accent">{icon}</div>
      </div>
      <div>
        <h3 className="font-display font-bold text-sm tracking-tight">{title}</h3>
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

function FlowSyncItem({ symbol, type, confidence }: { symbol: string, type: string, confidence: number }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-display font-bold">{symbol}</span>
        <span className="text-[9px] text-white/40 uppercase">{type}</span>
      </div>
      <span className="text-[9px] font-mono font-bold text-electric-accent">{confidence}%</span>
    </div>
  );
}

function BehavioralStat({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
      <span className={cn("text-xs font-bold", color)}>{value}</span>
    </div>
  );
}

function StrategyRankItem({ rank, name, users, winRate }: { rank: number, name: string, users: number, winRate: number }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-white/20">0{rank}</span>
        <div>
          <p className="text-xs font-display font-bold group-hover:text-electric-accent transition-colors">{name}</p>
          <p className="text-[9px] text-white/40 uppercase">{users} Nodes Active</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-mono font-bold text-bullish">{winRate}%</p>
        <p className="text-[9px] text-white/20 uppercase">Win Rate</p>
      </div>
    </div>
  );
}

function LoopStep({ step, title, desc }: { step: string, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-electric-accent/10 border border-electric-accent/20 flex items-center justify-center text-xs font-display font-bold text-electric-accent shrink-0">
        {step}
      </div>
      <div>
        <h4 className="text-xs font-display font-bold">{title}</h4>
        <p className="text-[10px] text-white/40 leading-tight">{desc}</p>
      </div>
    </div>
  );
}
