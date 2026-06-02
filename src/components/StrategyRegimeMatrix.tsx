import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  AlertCircle, 
  Star, 
  Grid, 
  Map, 
  Sparkles, 
  Brain, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { RegimePerformance, Strategy, Regime } from '../types/epistemic';

const STRATEGIES: Strategy[] = [
  { id: 's1', name: 'Alpha Breakout', description: 'Momentum-based trend following' },
  { id: 's2', name: 'Mean Revert C1', description: 'Counter-trend mean reversion' },
  { id: 's3', name: 'OrderFlow Scalp', description: 'High-frequency liquidity capture' }
];

const REGIMES: Regime[] = [
  { id: 'r1', name: 'Low Vol Range', prevalence: 0.68, mean_return: 0.0008, sharpe_approx: 0.45, effect_size: 0.22 },
  { id: 'r2', name: 'Momentum Noise', prevalence: 0.25, mean_return: 0.0012, sharpe_approx: 0.71, effect_size: 0.38 },
  { id: 'r3', name: 'Reversal Micro', prevalence: 0.07, mean_return: -0.0009, sharpe_approx: -0.31, effect_size: 0.19 },
  { id: 'r4', name: 'Macro Trend', prevalence: 0.15, mean_return: 0.0045, sharpe_approx: 1.2, effect_size: 0.55 }
];

const MOCK_MATRIX_DATA: RegimePerformance[] = [
  // Alpha Breakout
  { strategy_id: 's1', regime_id: 'r1', return_pct: -0.5, win_rate: 42, trade_count: 85, rating: 2 },
  { strategy_id: 's1', regime_id: 'r2', return_pct: 2.4, win_rate: 68, trade_count: 42, rating: 4 },
  { strategy_id: 's1', regime_id: 'r3', return_pct: -1.2, win_rate: 35, trade_count: 12, rating: 1 },
  { strategy_id: 's1', regime_id: 'r4', return_pct: 8.5, win_rate: 75, trade_count: 18, rating: 5 },
  // Mean Revert C1
  { strategy_id: 's2', regime_id: 'r1', return_pct: 4.2, win_rate: 72, trade_count: 120, rating: 5 },
  { strategy_id: 's2', regime_id: 'r2', return_pct: -2.1, win_rate: 38, trade_count: 55, rating: 2 },
  { strategy_id: 's2', regime_id: 'r3', return_pct: 3.1, win_rate: 65, trade_count: 28, rating: 4 },
  { strategy_id: 's2', regime_id: 'r4', return_pct: -5.4, win_rate: 22, trade_count: 15, rating: 1 },
  // OrderFlow Scalp
  { strategy_id: 's3', regime_id: 'r1', return_pct: 1.2, win_rate: 58, trade_count: 450, rating: 3 },
  { strategy_id: 's3', regime_id: 'r2', return_pct: 5.8, win_rate: 82, trade_count: 210, rating: 5 },
  { strategy_id: 's3', regime_id: 'r3', return_pct: 0.5, win_rate: 52, trade_count: 140, rating: 3 },
  { strategy_id: 's3', regime_id: 'r4', return_pct: 2.1, win_rate: 65, trade_count: 80, rating: 4 },
];

export const StrategyRegimeMatrix: React.FC = () => {
  const [view, setView] = useState<'matrix' | 'heatmap'>('matrix');
  const [selectedCell, setSelectedCell] = useState<{s: string, r: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coachResponse, setCoachResponse] = useState<string | null>(null);

  const getPerformance = (sId: string, rId: string) => 
    MOCK_MATRIX_DATA.find(d => d.strategy_id === sId && d.regime_id === rId);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-gold';
    if (rating >= 3) return 'text-electric-accent';
    return 'text-white/20';
  };

  const getHeatmapBg = (ret: number) => {
    if (ret > 5) return 'bg-gold/40 border-gold/50';
    if (ret > 2) return 'bg-gold/20 border-gold/30';
    if (ret > 0) return 'bg-electric-accent/20 border-electric-accent/30';
    if (ret > -2) return 'bg-red-500/10 border-red-500/20';
    return 'bg-red-500/30 border-red-500/50';
  };

  const askCoach = async (sId: string, rId: string) => {
    const perf = getPerformance(sId, rId);
    const strategy = STRATEGIES.find(s => s.id === sId);
    const regime = REGIMES.find(r => r.id === rId);
    
    if (!perf || !strategy || !regime) return;

    setSelectedCell({ s: sId, r: rId });
    setIsAnalyzing(true);
    setCoachResponse(null);

    try {
      const prompt = `As an elite Trading Mentor (AlphaFlow Empire style), analyze this performance cell:
      STRATEGY: ${strategy.name} (${strategy.description})
      REGIME: ${regime.name}
      METRICS: ${perf.return_pct}% return, ${perf.win_rate}% win rate over ${perf.trade_count} trades.
      RATING: ${perf.rating}/5.
      
      Explain WHY this strategy performs this way in this specific regime. Provide one "Obsidian Rule" for the student. Be concise, professional, and slightly intense.`;

      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCoachResponse(data.text);
    } catch (e) {
      setCoachResponse("Coach connection interrupted. Visual heuristics suggest edge decay in this quadrant. Proceed with caution.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full font-sans text-white">
      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {STRATEGIES.map(s => {
          const perfs = MOCK_MATRIX_DATA.filter(d => d.strategy_id === s.id);
          const best = perfs.reduce((prev, curr) => (curr.return_pct > prev.return_pct ? curr : prev), perfs[0]);
          const worst = perfs.reduce((prev, curr) => (curr.return_pct < prev.return_pct ? curr : prev), perfs[0]);
          
          return (
            <div key={s.id} className="glass-panel p-4 border-gold/10 bg-gold/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">{s.name}</h4>
                <Trophy className="w-3 h-3 text-gold/50" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white/40 uppercase">Optimal Regime</span>
                  <span className="text-gold font-bold">{REGIMES.find(r => r.id === best.regime_id)?.name}</span>
                </div>
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white/40 uppercase">Failure Mode</span>
                  <span className="text-red-400 font-bold">{REGIMES.find(r => r.id === worst.regime_id)?.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Matrix Container */}
      <div className="glass-panel flex-1 flex flex-col min-h-0 relative overflow-hidden border-white/5">
        <div className="absolute top-0 right-0 p-1 flex gap-1 bg-white/5 rounded-bl-xl border-b border-l border-white/5 z-20">
          <button 
            onClick={() => setView('matrix')}
            className={cn(
              "p-1.5 rounded transition-all",
              view === 'matrix' ? "bg-gold text-black" : "text-white/40 hover:text-white"
            )}
          >
            <Grid className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setView('heatmap')}
            className={cn(
              "p-1.5 rounded transition-all",
              view === 'heatmap' ? "bg-gold text-black" : "text-white/40 hover:text-white"
            )}
          >
            <Map className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-[180px_repeat(4,1fr)] gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Strategy Matrix</span>
              </div>
              {REGIMES.map(r => (
                <div key={r.id} className="text-center">
                  <div className="text-[10px] font-black uppercase text-gold tracking-tighter mb-1">{r.name}</div>
                  <div className="text-[8px] text-white/20 uppercase">PREV: {(r.prevalence * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>

            {/* Table Body */}
            <div className="space-y-4">
              {STRATEGIES.map(s => (
                <div key={s.id} className="grid grid-cols-[180px_repeat(4,1fr)] gap-4">
                  <div className="glass-panel p-4 flex flex-col justify-center bg-white/[0.02]">
                    <div className="text-xs font-bold text-white mb-1">{s.name}</div>
                    <div className="text-[8px] text-white/40 leading-tight">{s.description}</div>
                  </div>
                  
                  {REGIMES.map(r => {
                    const perf = getPerformance(s.id, r.id)!;
                    const isOptimal = MOCK_MATRIX_DATA.filter(d => d.regime_id === r.id).every(d => perf.return_pct >= d.return_pct);
                    
                    return (
                      <motion.button 
                        key={r.id}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
                        onClick={() => askCoach(s.id, r.id)}
                        className={cn(
                          "glass-panel p-4 text-left transition-all relative group",
                          view === 'heatmap' ? getHeatmapBg(perf.return_pct) : "bg-white/[0.02] border-white/5"
                        )}
                      >
                        {isOptimal && (
                          <div className="absolute top-2 right-2 px-1 py-0.5 bg-gold text-black text-[7px] font-black uppercase rounded sm">
                            Optimal
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 mb-2">
                          <span className={cn(
                            "text-lg font-display font-black",
                            perf.return_pct > 0 ? "text-gold" : "text-red-400"
                          )}>
                            {perf.return_pct > 0 ? '+' : ''}{perf.return_pct}%
                          </span>
                          {perf.return_pct > 0 ? <ArrowUpRight className="w-3 h-3 text-gold/50" /> : <ArrowDownRight className="w-3 h-3 text-red-400/50" />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] uppercase font-bold">
                            <span className="text-white/20">Win Rate</span>
                            <span className="text-white/60">{perf.win_rate}%</span>
                          </div>
                          <div className="flex justify-between text-[8px] uppercase font-bold">
                            <span className="text-white/20">Trades</span>
                            <span className="text-white/60">{perf.trade_count}</span>
                          </div>
                          <div className="flex gap-0.5 mt-2">
                            {[1,2,3,4,5].map(star => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "w-2 h-2 fill-current",
                                  star <= perf.rating ? "text-gold" : "text-white/10"
                                )} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Label Overlay */}
                        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Overlay */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="glass-panel p-6 bg-gradient-to-br from-gold/10 to-obsidian border-gold/30 shadow-2xl relative"
          >
            <button 
              onClick={() => setSelectedCell(null)}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full"
            >
              <AlertCircle className="w-4 h-4 text-white/40" />
            </button>
            
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gold/5 border border-gold/20 flex items-center justify-center flex-shrink-0">
                {isAnalyzing ? (
                  <RefreshCw className="w-8 h-8 text-gold animate-spin" />
                ) : (
                  <Brain className="w-8 h-8 text-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gold">Elite Performance Review</h3>
                  <div className="h-px flex-1 bg-gold/10" />
                  <span className="text-[10px] font-bold text-white/20">AGENT_ALPHA v2.4</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[9px] text-white/40 uppercase mb-3 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Context Analysis
                    </p>
                    <div className="text-xs text-white/80 leading-relaxed min-h-[60px]">
                      {isAnalyzing ? (
                        <div className="space-y-2 animate-pulse">
                          <div className="h-2 bg-white/10 rounded w-full" />
                          <div className="h-2 bg-white/10 rounded w-3/4" />
                          <div className="h-2 bg-white/10 rounded w-5/6" />
                        </div>
                      ) : (
                        coachResponse || "Select a performance quadrant to initiate heuristic analysis."
                      )}
                    </div>
                  </div>
                  
                  <div className="border-l border-gold/10 pl-8">
                    <p className="text-[9px] text-white/40 uppercase mb-3 font-bold flex items-center gap-1">
                      <Info className="w-3 h-3" /> Obsidan Recommendation
                    </p>
                    <div className="p-3 bg-gold/5 rounded-lg border border-gold/20 italic text-xs text-gold/90 font-medium">
                      {isAnalyzing ? "Calculating risk vectors..." : 
                       getPerformance(selectedCell.s, selectedCell.r)!.rating > 3 ? 
                       "Scale position sizing in this quadrant by 1.5x. Edge is structurally solid." : 
                       "Avoid this quadrant. Strategy mechanism fails to resolve environmental noise here."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal Components
const RefreshCw = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
