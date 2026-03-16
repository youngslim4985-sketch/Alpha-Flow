import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Target, 
  Eye, 
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Globe,
  Cpu,
  Layers,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  ComposedChart,
  Cell
} from 'recharts';

const CandlestickChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <XAxis 
          dataKey="time" 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false}
          minTickGap={30}
        />
        <YAxis 
          domain={['auto', 'auto']} 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          orientation="right"
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#111A23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
          labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}
        />
        
        {/* Wicks */}
        <Bar dataKey="high" fill="none" strokeWidth={1}>
          {data.map((entry, index) => (
            <Cell 
              key={`wick-${index}`} 
              stroke={entry.close >= entry.open ? '#2ECC71' : '#FF4D4D'} 
            />
          ))}
        </Bar>

        {/* Bodies */}
        <Bar dataKey={(d) => Math.abs(d.close - d.open)} stackId="a" fill="none">
          {data.map((entry, index) => (
            <Cell 
              key={`body-${index}`} 
              fill={entry.close >= entry.open ? '#2ECC71' : '#FF4D4D'} 
              stroke={entry.close >= entry.open ? '#2ECC71' : '#FF4D4D'}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const mockFlowData = [
  { time: '09:30', flow: 400 },
  { time: '10:00', flow: 600 },
  { time: '10:30', flow: 450 },
  { time: '11:00', flow: 800 },
  { time: '11:30', flow: 700 },
  { time: '12:00', flow: 900 },
];

interface AlphaStatus {
  symbol: string;
  regime: number;
  confidence: number;
  orderbook_imbalance: number;
  signal: string;
  timestamp: string;
}

export default function CommandCenter() {
  const [alphaStatus, setAlphaStatus] = useState<AlphaStatus | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusRes, historyRes] = await Promise.all([
        fetch('/api/alpha/status'),
        fetch('/api/market/history')
      ]);
      const statusData = await statusRes.json();
      const historyData = await historyRes.json();
      setAlphaStatus(statusData);
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const getRegimeLabel = (regime: number) => {
    switch(regime) {
      case 0: return { label: "BULLISH ACCUMULATION", color: "text-bullish" };
      case 1: return { label: "BEARISH DISTRIBUTION", color: "text-bearish" };
      case 2: return { label: "HIGH VOLATILITY", color: "text-warning" };
      case 3: return { label: "NEUTRAL CONSOLIDATION", color: "text-white/40" };
      default: return { label: "UNKNOWN", color: "text-white/20" };
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#05080A] text-white overflow-hidden font-sans">
      {/* TOP STRIP: Global Market Pulse */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center px-6 gap-8 shrink-0">
        <div className="flex items-center gap-3 pr-8 border-r border-white/5">
          <div className="w-8 h-8 rounded bg-electric-accent/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-electric-accent" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Market Pulse</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-bold">S&P 500 BIAS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-bullish/10 text-bullish">BULLISH</span>
            </div>
          </div>
        </div>

        <div className="flex gap-12 flex-1 overflow-x-auto no-scrollbar py-2">
          <PulseItem label="Volatility" value="14.2" change="-2.4%" trend="down" />
          <PulseItem label="Top Sector" value="Semiconductors" change="+1.8%" trend="up" />
          <PulseItem label="Largest Flow" value="NVDA Options" change="$4.2B" trend="up" />
          <PulseItem label="DXY" value="103.45" change="+0.12%" trend="up" />
          <PulseItem label="BTC/USD" value={alphaStatus?.symbol === 'BTC-USD' ? "68,420" : "68,420"} change="+4.2%" trend="up" />
        </div>

        <div className="flex items-center gap-4 pl-8 border-l border-white/5">
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">System Status</p>
            <p className="text-[10px] font-mono text-bullish">OPERATIONAL // LOW LATENCY</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-bullish animate-pulse" />
        </div>
      </header>

      {/* CENTER GRID: Trading Intelligence */}
      <main className="flex-1 p-6 grid grid-cols-12 grid-rows-6 gap-6 min-h-0 overflow-hidden">
        {/* Order Flow Radar */}
        <div className="col-span-12 lg:col-span-4 row-span-3 glass-panel p-5 flex flex-col min-h-0">
          <PanelHeader icon={<Activity className="w-4 h-4" />} title="Order Flow Radar" subtitle="Institutional Activity" />
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mt-4">
            <FlowItem symbol="NVDA" type="CALL SWEEP" size="$1.2M" time="14:02:11" sentiment="bullish" />
            <FlowItem symbol="TSLA" type="PUT BLOCK" size="$850K" time="14:01:45" sentiment="bearish" />
            <FlowItem symbol="AMD" type="CALL SWEEP" size="$420K" time="14:00:12" sentiment="bullish" />
            <FlowItem symbol="AAPL" type="DARK POOL" size="$2.4M" time="13:58:30" sentiment="neutral" />
            <FlowItem symbol="META" type="CALL SWEEP" size="$610K" time="13:55:10" sentiment="bullish" />
          </div>
        </div>

        {/* Alpha Intelligence Engine (Live Backend Integration) */}
        <div className="col-span-12 lg:col-span-5 row-span-3 glass-panel p-5 flex flex-col min-h-0 border-electric-accent/20 bg-electric-accent/5">
          <div className="flex items-center justify-between mb-4">
            <PanelHeader icon={<Cpu className="w-4 h-4" />} title="Alpha Intelligence Engine" subtitle="Live ML Regime Analysis" />
            <button 
              onClick={fetchData}
              className={cn("p-1 rounded hover:bg-white/5 text-white/20 hover:text-white transition-all", loading && "animate-spin")}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          
          {alphaStatus ? (
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Current Regime (HMM)</p>
                  <p className={cn("text-sm font-display font-bold", getRegimeLabel(alphaStatus.regime).color)}>
                    {getRegimeLabel(alphaStatus.regime).label}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Engine Confidence</p>
                  <p className="text-xl font-mono font-bold text-electric-accent">{(alphaStatus.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Alpha Signal</p>
                    <p className={cn(
                      "text-2xl font-display font-bold",
                      alphaStatus.signal === 'LONG' ? "text-bullish" : alphaStatus.signal === 'SHORT' ? "text-bearish" : "text-electric-accent"
                    )}>
                      {alphaStatus.signal}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Orderbook Imbalance</p>
                    <p className={cn(
                      "text-sm font-mono font-bold",
                      alphaStatus.orderbook_imbalance > 0 ? "text-bullish" : "text-bearish"
                    )}>
                      {alphaStatus.orderbook_imbalance > 0 ? '+' : ''}{alphaStatus.orderbook_imbalance.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 z-10"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.abs(alphaStatus.orderbook_imbalance * 50)}%`,
                      left: alphaStatus.orderbook_imbalance > 0 ? '50%' : `${50 - Math.abs(alphaStatus.orderbook_imbalance * 50)}%`
                    }}
                    className={cn(
                      "h-full shadow-[0_0_10px_rgba(0,229,255,0.5)]",
                      alphaStatus.orderbook_imbalance > 0 ? "bg-bullish" : "bg-bearish"
                    )}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[8px] font-bold text-white/20 uppercase">Asks Heavy</span>
                  <span className="text-[8px] font-bold text-white/20 uppercase">Bids Heavy</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-electric-accent/20 border-t-electric-accent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Watchlist Intelligence */}
        <div className="col-span-12 lg:col-span-3 row-span-6 glass-panel p-5 flex flex-col min-h-0">
          <PanelHeader icon={<Eye className="w-4 h-4" />} title="Watchlist Intelligence" subtitle="Micro-Signals" />
          <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-2">
            <WatchlistItem symbol="NVDA" price="894.52" change="+1.41%" signal="Accumulation" />
            <WatchlistItem symbol="AMD" price="192.10" change="+0.85%" signal="Consolidation" />
            <WatchlistItem symbol="SMCI" price="1042.30" change="+4.20%" signal="Breakout" />
            <WatchlistItem symbol="MSFT" price="415.20" change="-0.12%" signal="Distribution" />
            <WatchlistItem symbol="GOOGL" price="148.40" change="+0.45%" signal="Neutral" />
            <WatchlistItem symbol="META" price="495.10" change="+1.10%" signal="Accumulation" />
          </div>
          <button className="mt-4 w-full py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
            Manage Watchlist
          </button>
        </div>

        {/* Market Price Action (Candlestick Chart) */}
        <div className="col-span-12 lg:col-span-4 row-span-3 glass-panel p-5 flex flex-col min-h-0">
          <PanelHeader icon={<BarChart3 className="w-4 h-4" />} title="Market Price Action" subtitle="Live Candlestick Feed" />
          <div className="flex-1 mt-4 relative">
            {history.length > 0 ? (
              <CandlestickChart data={history} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-electric-accent/20 border-t-electric-accent rounded-full animate-spin" />
              </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-bullish animate-pulse" />
              <span className="text-[9px] font-bold text-white/60 uppercase">NVDA // 1M</span>
            </div>
          </div>
        </div>

        {/* AI Navigator (Avatar Integration) */}
        <div className="col-span-12 lg:col-span-5 row-span-3 glass-panel p-5 bg-gradient-to-br from-electric-accent/10 to-transparent border-electric-accent/20 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-electric-accent/20 flex items-center justify-center relative">
                <Cpu className="w-5 h-5 text-electric-accent" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-bullish border-2 border-[#05080A]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm">Alpha Navigator</h3>
                <p className="text-[10px] font-bold text-electric-accent uppercase tracking-widest">AI Market Intelligence</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-1 h-4 bg-electric-accent/20 rounded-full animate-pulse" />
              <div className="w-1 h-4 bg-electric-accent/40 rounded-full animate-pulse delay-75" />
              <div className="w-1 h-4 bg-electric-accent/60 rounded-full animate-pulse delay-150" />
            </div>
          </div>
          <div className="flex-1 bg-black/20 rounded-xl p-4 border border-white/5 overflow-y-auto">
            <p className="text-xs text-white/80 leading-relaxed italic">
              "Semiconductor sector leading the market today. NVDA and AMD showing strong accumulation on the 15m timeframe. Watch for a liquidity sweep at $900.00 before the next leg higher."
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask Alpha about market flow..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-electric-accent/50"
            />
            <button className="p-2 rounded-lg bg-electric-accent text-primary-dark hover:opacity-90 transition-all">
              <Zap className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </main>

      {/* BOTTOM STRIP: Live Execution & Alerts */}
      <footer className="h-12 border-t border-white/5 bg-black/60 backdrop-blur-xl flex items-center px-6 gap-6 shrink-0 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 text-warning" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-warning">Live Alerts</span>
        </div>
        
        <div className="flex-1 flex items-center gap-8 overflow-hidden">
          <div className="flex items-center gap-3 animate-marquee whitespace-nowrap">
            <AlertItem type="ALERT" text="Large NVDA sweep detected ($1.2M)" color="text-bullish" />
            <AlertItem type="SIGNAL" text="TSLA momentum breakout forming" color="text-electric-accent" />
            <AlertItem type="EVENT" text="Fed speech in 15 minutes" color="text-warning" />
            <AlertItem type="FLOW" text="Institutional accumulation in AMD" color="text-bullish" />
            <AlertItem type="VOL" text="VIX spiking on 1m timeframe" color="text-bearish" />
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 border-l border-white/5 pl-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-bullish" />
            <span className="text-[10px] font-mono text-white/40 uppercase">NYSE: OPEN</span>
          </div>
          <span className="text-[10px] font-mono text-white/60">14:05:32 EST</span>
        </div>
      </footer>
    </div>
  );
}

function PulseItem({ label, value, change, trend }: { label: string, value: string, change: string, trend: 'up' | 'down' }) {
  return (
    <div className="flex flex-col justify-center min-w-fit">
      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold">{value}</span>
        <span className={cn(
          "text-[10px] font-bold flex items-center",
          trend === 'up' ? "text-bullish" : "text-bearish"
        )}>
          {trend === 'up' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
    </div>
  );
}

function PanelHeader({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-electric-accent">{icon}</div>
        <div>
          <h3 className="font-display font-bold text-xs uppercase tracking-wider">{title}</h3>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <button className="p-1 rounded hover:bg-white/5 text-white/20 hover:text-white transition-all">
        <TrendingUp className="w-3 h-3" />
      </button>
    </div>
  );
}

function FlowItem({ symbol, type, size, time, sentiment }: { symbol: string, type: string, size: string, time: string, sentiment: 'bullish' | 'bearish' | 'neutral' }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-primary-dark border border-white/10 flex items-center justify-center font-display font-bold text-xs">
          {symbol}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest">{type}</p>
          <p className="text-[9px] font-mono text-white/40">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-mono font-bold">{size}</p>
        <p className={cn(
          "text-[9px] font-bold uppercase tracking-widest",
          sentiment === 'bullish' ? "text-bullish" : sentiment === 'bearish' ? "text-bearish" : "text-white/40"
        )}>
          {sentiment}
        </p>
      </div>
    </div>
  );
}

function SignalCard({ symbol, strategy, confidence, target, stop }: { symbol: string, strategy: string, confidence: number, target: string, stop: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between hover:border-electric-accent/30 transition-all group">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-lg font-display font-bold">{symbol}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-electric-accent/10 text-electric-accent">AI SIGNAL</span>
        </div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">{strategy}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-bold text-white/20 uppercase">Confidence</span>
            <span className="text-xs font-mono font-bold text-electric-accent">{confidence}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              className="h-full bg-electric-accent shadow-[0_0_10px_rgba(0,229,255,0.5)]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="p-2 rounded bg-bullish/5 border border-bullish/10">
          <p className="text-[8px] font-bold text-bullish/60 uppercase">Target</p>
          <p className="text-[10px] font-mono font-bold">{target}</p>
        </div>
        <div className="p-2 rounded bg-bearish/5 border border-bearish/10">
          <p className="text-[8px] font-bold text-bearish/60 uppercase">Stop</p>
          <p className="text-[10px] font-mono font-bold">{stop}</p>
        </div>
      </div>
    </div>
  );
}

function WatchlistItem({ symbol, price, change, signal }: { symbol: string, price: string, change: string, signal: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="text-xs font-display font-bold group-hover:text-electric-accent transition-colors">{symbol}</span>
        <span className={cn(
          "text-[9px] font-bold px-1 py-0.5 rounded",
          change.startsWith('+') ? "bg-bullish/10 text-bullish" : "bg-bearish/10 text-bearish"
        )}>
          {change}
        </span>
      </div>
      <div className="text-right">
        <p className="text-xs font-mono font-bold">${price}</p>
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{signal}</p>
      </div>
    </div>
  );
}

function AlertItem({ type, text, color }: { type: string, text: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5", color)}>{type}</span>
      <span className="text-[10px] font-medium text-white/80">{text}</span>
      <span className="text-white/10 mx-2">|</span>
    </div>
  );
}
