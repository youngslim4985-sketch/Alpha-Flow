import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  Save, 
  BarChart2, 
  Settings2, 
  Plus, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  BookOpen,
  Calendar,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface Condition {
  id: string;
  indicator: string;
  operator: string;
  value: string;
  logic: 'AND' | 'OR';
}

interface JournalEntry {
  id: string;
  date: string;
  entryPrice: string;
  exitPrice: string;
  pnl: string;
  notes: string;
}

const mockBacktestDataDaily = [
  { time: 'Mon', equity: 10000 },
  { time: 'Tue', equity: 10500 },
  { time: 'Wed', equity: 10300 },
  { time: 'Thu', equity: 11200 },
  { time: 'Fri', equity: 10800 },
  { time: 'Mon', equity: 11500 },
  { time: 'Tue', equity: 12100 },
];

const mockBacktestDataWeekly = [
  { time: 'W1', equity: 10000 },
  { time: 'W2', equity: 11200 },
  { time: 'W3', equity: 10800 },
  { time: 'W4', equity: 12500 },
  { time: 'W5', equity: 13100 },
  { time: 'W6', equity: 12800 },
  { time: 'W7', equity: 14200 },
];

const mockBacktestDataMonthly = [
  { time: 'Jan', equity: 10000 },
  { time: 'Feb', equity: 11500 },
  { time: 'Mar', equity: 10800 },
  { time: 'Apr', equity: 13200 },
  { time: 'May', equity: 14500 },
  { time: 'Jun', equity: 13800 },
  { time: 'Jul', equity: 16200 },
];

export default function StrategyLab() {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', indicator: 'Price', operator: 'Crosses Above', value: 'VWAP', logic: 'AND' },
    { id: '2', indicator: 'RSI', operator: 'Less Than', value: '30', logic: 'AND' },
  ]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeView, setActiveView] = useState<'analytics' | 'journal'>('analytics');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2026-03-15',
      entryPrice: '892.40',
      exitPrice: '904.15',
      pnl: '+11.75',
      notes: 'Bullish sweep confirmation on NVDA. Exited at resistance.'
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    entryPrice: '',
    exitPrice: '',
    pnl: '',
    notes: ''
  });

  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const analyzeJournal = async () => {
    if (journalEntries.length === 0) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const journalText = journalEntries.map(e => 
        `Date: ${e.date}, P&L: ${e.pnl}, Notes: ${e.notes}`
      ).join('\n---\n');

      const prompt = `Analyze these trading journal entries and identify recurring mistakes, psychological patterns, or strategy leaks. Be concise and provide actionable advice.
      
      Journal Entries:
      ${journalText}`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "You are Alpha, a professional trading performance psychologist. Your goal is to find 'leaks' in a trader's execution based on their journal notes.",
          temperature: 0.7,
        }
      });

      setAiAnalysis(response.text || "No patterns identified yet. Keep logging more trades.");
    } catch (error) {
      console.error('Journal Analysis Error:', error);
      setAiAnalysis("Failed to connect to Alpha Intelligence. Please check your configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addJournalEntry = () => {
    if (!newEntry.entryPrice || !newEntry.exitPrice) return;
    
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      ...newEntry
    };
    
    setJournalEntries([entry, ...journalEntries]);
    setNewEntry({ entryPrice: '', exitPrice: '', pnl: '', notes: '' });
    setIsAddingEntry(false);
    setFormStep(1);
  };

  const addCondition = () => {
    const newCondition: Condition = {
      id: Math.random().toString(36).slice(2, 9),
      indicator: 'Indicator',
      operator: 'Operator',
      value: 'Value',
      logic: 'AND',
    };
    setConditions([...conditions, newCondition]);
  };

  const toggleLogic = (id: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, logic: c.logic === 'AND' ? 'OR' : 'AND' } : c
    ));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const runBacktest = () => {
    setIsBacktesting(true);
    setTimeout(() => {
      setIsBacktesting(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="p-8 h-screen flex flex-col gap-8 overflow-hidden">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-electric-accent mb-2">
            <FlaskConical className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Strategy R&D</span>
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Strategy Lab</h2>
          <p className="text-white/40 text-sm mt-1">Build, backtest, and optimize your automated trading systems.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-panel px-4 py-2 flex items-center gap-2 text-xs font-bold hover:bg-white/5 transition-all">
            <Save className="w-4 h-4" />
            Save Strategy
          </button>
          <button 
            onClick={runBacktest}
            disabled={isBacktesting}
            className="btn-primary flex items-center gap-2"
          >
            {isBacktesting ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isBacktesting ? 'Backtesting...' : 'Run Backtest'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Strategy Builder */}
        <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">
          <div className="glass-panel p-6 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-electric-accent" />
                Logic Builder
              </h3>
              <button 
                onClick={addCondition}
                className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-electric-accent transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {conditions.map((condition, idx) => (
                    <motion.div 
                      key={condition.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative"
                    >
                      {idx > 0 && (
                        <div className="flex justify-center my-2 relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                          </div>
                          <button 
                            onClick={() => toggleLogic(condition.id)}
                            className={cn(
                              "relative z-10 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                              condition.logic === 'AND' 
                                ? "bg-electric-accent/10 border-electric-accent/30 text-electric-accent" 
                                : "bg-warning/10 border-warning/30 text-warning"
                            )}
                          >
                            {condition.logic}
                          </button>
                        </div>
                      )}
                      
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-electric-accent/20 group-hover:bg-electric-accent transition-all" />
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Condition {idx + 1}</span>
                          <button 
                            onClick={() => removeCondition(condition.id)}
                            className="p-1.5 rounded-lg hover:bg-bearish/10 text-white/20 hover:text-bearish transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <select className="bg-primary-dark border border-white/10 rounded-lg px-2 py-2 text-[10px] font-mono focus:outline-none focus:border-electric-accent/50 appearance-none cursor-pointer">
                            <option>{condition.indicator}</option>
                            <option>Price</option>
                            <option>RSI</option>
                            <option>MACD</option>
                            <option>VWAP</option>
                            <option>EMA</option>
                          </select>
                          <select className="bg-primary-dark border border-white/10 rounded-lg px-2 py-2 text-[10px] font-mono text-electric-accent focus:outline-none focus:border-electric-accent/50 appearance-none cursor-pointer text-center">
                            <option>{condition.operator}</option>
                            <option>Crosses Above</option>
                            <option>Crosses Below</option>
                            <option>Greater Than</option>
                            <option>Less Than</option>
                            <option>Equals</option>
                          </select>
                          <input 
                            type="text"
                            defaultValue={condition.value}
                            className="bg-primary-dark border border-white/10 rounded-lg px-2 py-2 text-[10px] font-mono focus:outline-none focus:border-electric-accent/50 text-right"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button 
                  onClick={addCondition}
                  className="w-full py-4 rounded-xl border border-dashed border-white/10 hover:border-electric-accent/30 hover:bg-electric-accent/5 text-white/20 hover:text-electric-accent transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Add New Condition</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 mt-6">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 block">Risk Management</span>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-white/40">Stop Loss</span>
                      <span className="text-bearish font-bold">1.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-bearish w-[15%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-white/40">Take Profit</span>
                      <span className="text-bullish font-bold">4.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-bullish w-[45%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 bg-electric-accent/5 border-electric-accent/20">
            <div className="flex items-center gap-2 text-electric-accent mb-3">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-widest">AI Validation</h4>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed italic">
              "Your current logic has a high correlation with mean-reversion environments. Consider adding a volume filter to avoid false breakouts."
            </p>
          </div>
        </div>

        {/* Backtest Results & Journal */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
            <button 
              onClick={() => setActiveView('analytics')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                activeView === 'analytics' ? "bg-electric-accent text-primary-dark" : "text-white/40 hover:text-white"
              )}
            >
              Analytics
            </button>
            <button 
              onClick={() => setActiveView('journal')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                activeView === 'journal' ? "bg-electric-accent text-primary-dark" : "text-white/40 hover:text-white"
              )}
            >
              Trade Journal
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeView === 'analytics' ? (
              !showResults ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel flex-1 flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <BarChart2 className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">No Backtest Data</h3>
                  <p className="text-sm text-white/40 max-w-xs">
                    Configure your strategy logic and run a backtest to see performance analytics.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col gap-6 min-h-0"
                >
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Total Return', value: '+21.4%', color: 'text-bullish' },
                      { label: 'Win Rate', value: '64.2%', color: 'text-white' },
                      { label: 'Profit Factor', value: '2.14', color: 'text-electric-accent' },
                      { label: 'Max Drawdown', value: '-4.2%', color: 'text-bearish' },
                    ].map((stat, i) => (
                      <div key={i} className="glass-panel p-4">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={cn("text-xl font-display font-bold", stat.color)}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="glass-panel p-6 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h3 className="font-display font-bold text-sm uppercase tracking-wider">Equity Curve</h3>
                        <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg">
                          {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                            <button
                              key={tf}
                              onClick={() => setTimeframe(tf)}
                              className={cn(
                                "px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all",
                                timeframe === tf ? "bg-electric-accent text-primary-dark shadow-[0_0_10px_rgba(0,229,255,0.3)]" : "text-white/40 hover:text-white"
                              )}
                            >
                              {tf}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <TrendingUp className="w-3 h-3 text-bullish" />
                        <span>Benchmark: SPY (+4.2%)</span>
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={
                          timeframe === 'daily' ? mockBacktestDataDaily :
                          timeframe === 'weekly' ? mockBacktestDataWeekly :
                          mockBacktestDataMonthly
                        }>
                          <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111A23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#00E5FF', fontSize: '12px' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="#00E5FF" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorEquity)" 
                            animationDuration={1000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-panel p-6">
                    <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Trade Log</h3>
                    <div className="space-y-2">
                      {[
                        { type: 'BUY', price: '894.20', time: 'Mon 09:42', result: '+1.2%' },
                        { type: 'SELL', price: '902.15', time: 'Mon 10:15', result: '+0.8%' },
                        { type: 'BUY', price: '898.50', time: 'Tue 11:30', result: '-0.4%' },
                      ].map((trade, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-[10px]">
                          <div className="flex items-center gap-4">
                            <span className={trade.type === 'BUY' ? "text-bullish font-bold" : "text-bearish font-bold"}>{trade.type}</span>
                            <span className="font-mono text-white/60">{trade.time}</span>
                            <span className="font-mono">${trade.price}</span>
                          </div>
                          <span className={trade.result.startsWith('+') ? "text-bullish font-bold" : "text-bearish font-bold"}>
                            {trade.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-6 bg-gradient-to-br from-[#7C4DFF]/10 to-transparent border-[#7C4DFF]/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[#7C4DFF]">
                        <Zap className="w-4 h-4" />
                        <h3 className="font-display font-bold text-sm uppercase tracking-wider">AI Optimization</h3>
                      </div>
                      <span className="text-[10px] font-bold text-white/40">GENETIC ALGORITHM ACTIVE</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed mb-4">
                      "Alpha has identified a parameter set that increases Profit Factor to 2.8 by shifting the RSI threshold from 30 to 24 and adding a 200-period EMA filter."
                    </p>
                    <button className="w-full py-2 rounded-lg bg-[#7C4DFF] text-white text-[10px] font-bold hover:opacity-90 transition-all">
                      Apply Optimized Parameters
                    </button>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div 
                key="journal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col gap-6 min-h-0"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-xl">Trade Journal</h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={analyzeJournal}
                      disabled={isAnalyzing || journalEntries.length === 0}
                      className="glass-panel px-4 py-2 flex items-center gap-2 text-xs font-bold hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-electric-accent" />}
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Patterns'}
                    </button>
                    <button 
                      onClick={() => setIsAddingEntry(true)}
                      className="btn-primary flex items-center gap-2 text-xs"
                    >
                      <Plus className="w-4 h-4" />
                      New Entry
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {aiAnalysis && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-panel p-6 bg-electric-accent/5 border-electric-accent/20 relative group"
                    >
                      <button 
                        onClick={() => setAiAnalysis(null)}
                        className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 text-electric-accent mb-3">
                        <ShieldCheck className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Alpha Performance Audit</h4>
                      </div>
                      <div className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">
                        {aiAnalysis}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isAddingEntry && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-panel p-6 overflow-hidden mb-6"
                    >
                      <div className="flex items-center gap-8 mb-8 border-b border-white/5 pb-4">
                        <button 
                          onClick={() => setFormStep(1)}
                          className={cn(
                            "flex items-center gap-3 transition-all",
                            formStep === 1 ? "text-electric-accent" : "text-white/20 hover:text-white/40"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold",
                            formStep === 1 ? "border-electric-accent bg-electric-accent/10" : "border-white/10"
                          )}>1</div>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Trade Execution</span>
                        </button>
                        <div className="h-px w-8 bg-white/5" />
                        <button 
                          onClick={() => setFormStep(2)}
                          className={cn(
                            "flex items-center gap-3 transition-all",
                            formStep === 2 ? "text-electric-accent" : "text-white/20 hover:text-white/40"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold",
                            formStep === 2 ? "border-electric-accent bg-electric-accent/10" : "border-white/10"
                          )}>2</div>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Post-Trade Analysis</span>
                        </button>
                      </div>

                      <AnimatePresence mode="wait">
                        {formStep === 1 ? (
                          <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6"
                          >
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Entry Price</label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                                <input 
                                  type="text" 
                                  value={newEntry.entryPrice}
                                  onChange={(e) => setNewEntry({...newEntry, entryPrice: e.target.value})}
                                  placeholder="0.00"
                                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-xs focus:outline-none focus:border-electric-accent/50 font-mono"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Exit Price</label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                                <input 
                                  type="text" 
                                  value={newEntry.exitPrice}
                                  onChange={(e) => setNewEntry({...newEntry, exitPrice: e.target.value})}
                                  placeholder="0.00"
                                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-xs focus:outline-none focus:border-electric-accent/50 font-mono"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">P&L Result</label>
                              <input 
                                type="text" 
                                value={newEntry.pnl}
                                onChange={(e) => setNewEntry({...newEntry, pnl: e.target.value})}
                                placeholder="+0.00"
                                className={cn(
                                  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-electric-accent/50 font-mono font-bold",
                                  newEntry.pnl.startsWith('+') ? "text-bullish" : newEntry.pnl.startsWith('-') ? "text-bearish" : "text-white"
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Execution Date</label>
                              <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white/40 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-2"
                          >
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Performance Notes & Context</label>
                            <textarea 
                              value={newEntry.notes}
                              onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                              placeholder="Describe the setup, your emotional state, and market context..."
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-electric-accent/50 min-h-[120px] leading-relaxed"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                        <button 
                          onClick={() => {
                            setIsAddingEntry(false);
                            setFormStep(1);
                          }}
                          className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-all"
                        >
                          Discard Entry
                        </button>
                        
                        <div className="flex gap-3">
                          {formStep === 1 ? (
                            <button 
                              onClick={() => setFormStep(2)}
                              className="btn-primary px-6 py-2 text-xs flex items-center gap-2"
                            >
                              Next Step
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => setFormStep(1)}
                                className="px-6 py-2 rounded-lg text-xs font-bold text-white/40 hover:text-white transition-all"
                              >
                                Back
                              </button>
                              <button 
                                onClick={addJournalEntry}
                                className="btn-primary px-8 py-2 text-xs"
                              >
                                Complete Entry
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="glass-panel flex-1 overflow-hidden flex flex-col min-h-0">
                  <div className="p-4 border-b border-white/5 grid grid-cols-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span>Date</span>
                    <span>Entry</span>
                    <span>Exit</span>
                    <span>P&L</span>
                    <span>Notes</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {journalEntries.map((entry) => (
                      <div key={entry.id} className="p-4 border-b border-white/5 grid grid-cols-5 text-xs hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </div>
                        <div className="font-mono">${entry.entryPrice}</div>
                        <div className="font-mono">${entry.exitPrice}</div>
                        <div className={cn(
                          "font-mono font-bold",
                          entry.pnl.startsWith('+') ? "text-bullish" : "text-bearish"
                        )}>
                          {entry.pnl}
                        </div>
                        <div className="text-white/40 truncate pr-4 italic">
                          {entry.notes}
                        </div>
                      </div>
                    ))}
                    {journalEntries.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-white/20 p-12">
                        <BookOpen className="w-12 h-12 mb-4" />
                        <p className="text-sm font-display font-bold">No journal entries yet</p>
                        <p className="text-xs">Start logging your trades to track performance.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
