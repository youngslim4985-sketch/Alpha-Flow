import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  Clock,
  ChevronRight,
  Radio
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { Signal, MarketData } from '@/src/types';

const mockChartData: MarketData[] = [
  { time: '09:30', price: 182.5, volume: 1200 },
  { time: '10:00', price: 183.2, volume: 1500 },
  { time: '10:30', price: 182.8, volume: 1100 },
  { time: '11:00', price: 184.5, volume: 2200 },
  { time: '11:30', price: 185.1, volume: 1800 },
  { time: '12:00', price: 184.2, volume: 1400 },
  { time: '12:30', price: 185.8, volume: 2500 },
  { time: '13:00', price: 187.2, volume: 3200 },
  { time: '13:30', price: 186.5, volume: 2100 },
  { time: '14:00', price: 188.1, volume: 2800 },
];

const mockSignals: Signal[] = [
  {
    id: '1',
    symbol: 'NVDA',
    type: 'LONG',
    confidence: 82,
    entryZone: '892–896',
    target: '912',
    timestamp: '10 mins ago',
    reason: 'Momentum breakout + Institutional accumulation'
  },
  {
    id: '2',
    symbol: 'TSLA',
    type: 'SHORT',
    confidence: 76,
    entryZone: '178–180',
    target: '165',
    timestamp: '25 mins ago',
    reason: 'Liquidity trap detected at resistance'
  },
  {
    id: '3',
    symbol: 'AMD',
    type: 'LONG',
    confidence: 68,
    entryZone: '162–164',
    target: '175',
    timestamp: '1 hour ago',
    reason: 'Gamma squeeze potential building'
  }
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Market Intelligence</h2>
          <p className="text-white/40 text-sm mt-1">Welcome back, Alpha Terminal active.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-bullish animate-pulse" />
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Live Feed</span>
          </div>
          <button className="btn-primary">Execute Trade</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Portfolio Value', value: '$124,592.00', change: '+12.5%', isUp: true, icon: DollarSign },
          { label: 'Daily P&L', value: '+$4,230.15', change: '+3.4%', isUp: true, icon: TrendingUp },
          { label: 'Buying Power', value: '$42,000.00', change: '0.0%', isUp: null, icon: Activity },
          { label: 'Active Signals', value: '12', change: '+2', isUp: true, icon: Radio },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 glow-hover group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-electric-accent/10 transition-colors">
                <stat.icon className="w-5 h-5 text-electric-accent" />
              </div>
              {stat.isUp !== null && (
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                  stat.isUp ? "bg-bullish/10 text-bullish" : "bg-bearish/10 text-bearish"
                )}>
                  {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              )}
            </div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h3 className="font-display font-bold text-lg">Market Performance</h3>
              <div className="flex gap-2">
                {['1H', '1D', '1W', '1M', 'ALL'].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                    t === '1D' ? "bg-electric-accent text-primary-dark" : "text-white/40 hover:text-white hover:bg-white/5"
                  )}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Clock className="w-3 h-3" />
              <span>Updated 2s ago</span>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111A23', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#00E5FF' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00E5FF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signals List */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg">Alpha Signals</h3>
            <button className="text-electric-accent text-xs font-bold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {mockSignals.map((signal) => (
              <div key={signal.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-sm">
                      {signal.symbol}
                    </div>
                    <div>
                      <div className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1",
                        signal.type === 'LONG' ? "bg-bullish/10 text-bullish" : "bg-bearish/10 text-bearish"
                      )}>
                        {signal.type} SIGNAL
                      </div>
                      <p className="text-xs text-white/40">{signal.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-electric-accent font-bold">{signal.confidence}%</div>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">Confidence</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Entry Zone</p>
                    <p className="text-xs font-mono font-bold text-white/80">{signal.entryZone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Target</p>
                    <p className="text-xs font-mono font-bold text-bullish">{signal.target}</p>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 mt-2 italic line-clamp-1 group-hover:text-white/60 transition-colors">
                  "{signal.reason}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
