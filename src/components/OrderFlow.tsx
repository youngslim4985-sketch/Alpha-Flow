import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  Activity, 
  Layers, 
  History,
  BarChart2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { OrderFlowEvent } from '@/src/types';

const generateMockEvent = (): OrderFlowEvent => {
  const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
  const size = Math.floor(Math.random() * 500) + 1;
  return {
    id: Math.random().toString(36).slice(2, 11),
    time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    price: 894.50 + (Math.random() * 4 - 2),
    size,
    side,
    isLarge: size > 400
  };
};

// Stabilize order book sizes to prevent flickering on every re-render
const mockOrderBookSizes = {
  asks: [...Array(15)].map(() => Math.random() * 100),
  bids: [...Array(15)].map(() => Math.random() * 100),
  askSizes: [...Array(15)].map(() => Math.floor(Math.random() * 1000)),
  bidSizes: [...Array(15)].map(() => Math.floor(Math.random() * 1000)),
};

export default function OrderFlow() {
  const [events, setEvents] = useState<OrderFlowEvent[]>([]);
  const [imbalance, setImbalance] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => [generateMockEvent(), ...prev].slice(0, 50));
      setImbalance(prev => {
        const delta = (Math.random() * 10 - 5);
        return Math.min(Math.max(prev + delta, 10), 90);
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 h-screen flex flex-col gap-6 overflow-hidden">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-electric-accent/10">
            <Zap className="w-6 h-6 text-electric-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Alpha Engine</h2>
            <p className="text-white/40 text-xs">Real-time Order Flow Intelligence</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">VWAP</span>
              <span className="text-xs font-mono font-bold text-bullish">895.42</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Delta</span>
              <span className="text-xs font-mono font-bold text-bearish">-1,240</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Order Book Ladder */}
        <div className="glass-panel p-6 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-electric-accent" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Order Book</h3>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col font-mono text-[10px]">
            <div className="grid grid-cols-3 py-2 border-b border-white/5 text-white/40 font-bold uppercase">
              <span>Size</span>
              <span className="text-center">Price</span>
              <span className="text-right">Size</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-0.5 mt-2">
              {/* Asks */}
              {[...Array(15)].map((_, i) => (
                <div key={`ask-${i}`} className="grid grid-cols-3 py-1 hover:bg-white/5 transition-colors group">
                  <span className="text-bearish/40"></span>
                  <span className="text-center text-bearish font-bold">{ (896.50 + i * 0.1).toFixed(2) }</span>
                  <div className="relative flex justify-end items-center">
                    <div className="absolute right-0 h-full bg-bearish/10 transition-all duration-500" style={{ width: `${mockOrderBookSizes.asks[i]}%` }} />
                    <span className="relative z-10 pr-1">{ mockOrderBookSizes.askSizes[i] }</span>
                  </div>
                </div>
              )).reverse()}
              
              {/* Spread */}
              <div className="py-2 my-1 bg-white/5 text-center text-white/40 font-bold border-y border-white/10">
                SPREAD: 0.10
              </div>

              {/* Bids */}
              {[...Array(15)].map((_, i) => (
                <div key={`bid-${i}`} className="grid grid-cols-3 py-1 hover:bg-white/5 transition-colors group">
                  <div className="relative flex items-center">
                    <div className="absolute left-0 h-full bg-bullish/10 transition-all duration-500" style={{ width: `${mockOrderBookSizes.bids[i]}%` }} />
                    <span className="relative z-10 pl-1">{ mockOrderBookSizes.bidSizes[i] }</span>
                  </div>
                  <span className="text-center text-bullish font-bold">{ (896.40 - i * 0.1).toFixed(2) }</span>
                  <span className="text-right text-bullish/40"></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tape (Time & Sales) */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-electric-accent" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Time & Sales</h3>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-[10px] text-white/40">
                <div className="w-2 h-2 rounded-full bg-bullish/40" /> Buy
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/40">
                <div className="w-2 h-2 rounded-full bg-bearish/40" /> Sell
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col font-mono text-[11px]">
            <div className="grid grid-cols-4 py-2 border-b border-white/5 text-white/40 font-bold uppercase">
              <span>Time</span>
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Condition</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 mt-2 space-y-1">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className={cn(
                    "grid grid-cols-4 py-1.5 px-2 rounded-md transition-all animate-in slide-in-from-top-2 duration-300",
                    event.side === 'BUY' ? "bg-bullish/5 text-bullish" : "bg-bearish/5 text-bearish",
                    event.isLarge && "border border-institutional/30 shadow-[0_0_10px_rgba(241,196,15,0.1)]"
                  )}
                >
                  <span className="opacity-60">{event.time}</span>
                  <span className="font-bold">{event.price.toFixed(2)}</span>
                  <span className="text-right font-bold">{event.size}</span>
                  <span className="text-right opacity-60">
                    {event.isLarge ? (
                      <span className="text-institutional font-bold flex items-center justify-end gap-1">
                        <Activity className="w-3 h-3" /> SWEEP
                      </span>
                    ) : (
                      "REGULAR"
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meters & Analytics */}
        <div className="space-y-6 flex flex-col">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-4 h-4 text-electric-accent" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Imbalance Meter</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                  <span className="text-bullish">Bids {imbalance}%</span>
                  <span className="text-bearish">Asks {100 - imbalance}%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-bullish transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(46,204,113,0.3)]" 
                    style={{ width: `${imbalance}%` }} 
                  />
                  <div 
                    className="h-full bg-bearish transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(231,76,60,0.3)]" 
                    style={{ width: `${100 - imbalance}%` }} 
                  />
                </div>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed italic">
                {imbalance > 60 ? "Significant buy pressure detected. Bullish imbalance likely to push price higher." : 
                 imbalance < 40 ? "Strong sell pressure. Bearish imbalance suggests further downside." : 
                 "Market currently balanced. Watch for breakout."}
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex-1">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Liquidity Walls</h3>
            <div className="space-y-4">
              {[
                { price: '902.50', size: '12.4k', type: 'ASK', strength: 85 },
                { price: '898.00', size: '8.2k', type: 'ASK', strength: 60 },
                { price: '892.00', size: '15.1k', type: 'BID', strength: 95 },
                { price: '888.50', size: '9.8k', type: 'BID', strength: 70 },
              ].map((wall, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "w-1 h-10 rounded-full",
                    wall.type === 'ASK' ? "bg-bearish" : "bg-bullish"
                  )} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="font-bold">{wall.price}</span>
                      <span className="text-white/40">{wall.size}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          wall.type === 'ASK' ? "bg-bearish/40" : "bg-bullish/40"
                        )} 
                        style={{ width: `${wall.strength}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
