import React from 'react';
import { 
  Radar, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Eye,
  Activity,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { SmartMoneySignal } from '@/src/types';

const mockRadarSignals: SmartMoneySignal[] = [
  {
    id: 'r1',
    type: 'SWEEP',
    symbol: 'NVDA',
    value: '$3.2M',
    sentiment: 'BULLISH',
    confidence: 81,
    timestamp: '2m ago',
    details: 'Large buy order across 5 price levels detected.'
  },
  {
    id: 'r2',
    type: 'DARK_POOL',
    symbol: 'AAPL',
    value: '$12.5M',
    sentiment: 'NEUTRAL',
    confidence: 94,
    timestamp: '5m ago',
    details: 'Significant off-exchange block trade at 182.45.'
  },
  {
    id: 'r3',
    type: 'OPTIONS',
    symbol: 'TSLA',
    value: '5,000 Calls',
    sentiment: 'BULLISH',
    confidence: 72,
    timestamp: '12m ago',
    details: 'Unusual OTM call buying for next week expiry.'
  },
  {
    id: 'r4',
    type: 'WALL',
    symbol: 'AMD',
    value: '250k Shares',
    sentiment: 'BEARISH',
    confidence: 88,
    timestamp: '15m ago',
    details: 'Massive sell wall identified at 165.00 resistance.'
  }
];

export default function SmartMoneyRadar() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-electric-accent mb-2">
            <Radar className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Institutional Scanner</span>
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Smart Money Radar</h2>
          <p className="text-white/40 text-sm mt-1">Detecting institutional footprints in real-time.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-bullish" />
            <span className="text-xs font-mono font-bold">SCANNING: 4,200 TICKERS</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg">Active Institutional Signals</h3>
            <div className="flex gap-2">
              {['All', 'Sweeps', 'Dark Pool', 'Options'].map(f => (
                <button key={f} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 hover:text-white transition-all">
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {mockRadarSignals.map((signal) => (
              <div key={signal.id} className="glass-panel p-6 glow-hover group relative overflow-hidden">
                {/* Background Accent */}
                <div className={cn(
                  "absolute top-0 left-0 w-1 h-full",
                  signal.sentiment === 'BULLISH' ? "bg-bullish" : 
                  signal.sentiment === 'BEARISH' ? "bg-bearish" : "bg-white/20"
                )} />

                <div className="flex justify-between items-start relative z-10">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-display font-bold text-lg border border-white/5">
                      {signal.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          signal.type === 'SWEEP' ? "bg-electric-accent/10 text-electric-accent" :
                          signal.type === 'DARK_POOL' ? "bg-white/10 text-white/60" :
                          signal.type === 'OPTIONS' ? "bg-institutional/10 text-institutional" :
                          "bg-warning/10 text-warning"
                        )}>
                          {signal.type}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">{signal.timestamp}</span>
                      </div>
                      <h4 className="font-display font-bold text-white/90">{signal.details}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-mono font-bold text-white">{signal.value}</div>
                    <div className={cn(
                      "text-[10px] font-bold flex items-center justify-end gap-1 mt-1",
                      signal.sentiment === 'BULLISH' ? "text-bullish" : 
                      signal.sentiment === 'BEARISH' ? "text-bearish" : "text-white/40"
                    )}>
                      {signal.sentiment === 'BULLISH' ? <TrendingUp className="w-3 h-3" /> : 
                       signal.sentiment === 'BEARISH' ? <TrendingDown className="w-3 h-3" /> : null}
                      {signal.sentiment}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-electric-accent shadow-[0_0_8px_#00E5FF]" 
                          style={{ width: `${signal.confidence}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/40">{signal.confidence}% Confidence</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                      <Eye className="w-3 h-3" />
                      <span>42 traders watching</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-electric-accent hover:underline">
                    Analyze Flow <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-institutional" />
              Gamma Pressure
            </h3>
            <div className="space-y-6">
              {[
                { symbol: 'NVDA', pressure: 84, trend: 'UP' },
                { symbol: 'TSLA', pressure: 62, trend: 'DOWN' },
                { symbol: 'SPY', pressure: 45, trend: 'UP' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.symbol}</span>
                    <span className={item.trend === 'UP' ? "text-bullish" : "text-bearish"}>
                      {item.pressure}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        item.trend === 'UP' ? "bg-bullish" : "bg-bearish"
                      )} 
                      style={{ width: `${item.pressure}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-electric-accent" />
              Liquidity Walls
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-bearish">SELL WALL</span>
                  <span className="text-[10px] font-mono text-white/40">892.50</span>
                </div>
                <div className="text-lg font-mono font-bold">12,400 Shares</div>
                <p className="text-[10px] text-white/40 mt-2">Institutional resistance building. Watch for rejection.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-bullish">BUY WALL</span>
                  <span className="text-[10px] font-mono text-white/40">885.00</span>
                </div>
                <div className="text-lg font-mono font-bold">18,200 Shares</div>
                <p className="text-[10px] text-white/40 mt-2">Strong support floor identified. High absorption potential.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 bg-gradient-to-br from-electric-accent/10 to-transparent border-electric-accent/20">
            <div className="flex items-center gap-2 text-electric-accent mb-4">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Risk Intelligence</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Dark pool activity in the semiconductor sector has increased by 42% in the last hour. This typically precedes high volatility events.
            </p>
            <button className="w-full mt-4 btn-primary py-2 text-xs">Generate Risk Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
