import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Target, 
  Zap, 
  BookOpen,
  User,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CoachMode, Message } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const modeConfig = {
  Strategist: {
    icon: Target,
    color: 'text-bullish',
    bgColor: 'bg-bullish/10',
    description: 'Professional analyst focusing on high-level strategy and risk.'
  },
  Tactical: {
    icon: Zap,
    color: 'text-electric-accent',
    bgColor: 'bg-electric-accent/10',
    description: 'Fast-paced trading style focusing on momentum and sweeps.'
  },
  Analyst: {
    icon: BookOpen,
    color: 'text-institutional',
    bgColor: 'bg-institutional/10',
    description: 'Educational mode focusing on market mechanics and patterns.'
  }
};

export default function AICoach() {
  const [mode, setMode] = useState<CoachMode>('Strategist');
  const [coachState, setCoachState] = useState<'Chat' | 'Live' | 'Review'>('Chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Alpha Terminal online. I'm monitoring NVDA and TSLA order flow. How can I assist your strategy today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, coachState]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `You are a world-class AI Trade Coach named Alpha. 
      Current Mode: ${mode}. 
      ${modeConfig[mode].description}
      Keep responses concise, professional, and focused on market intelligence, order flow, and trading psychology. 
      Use trading terminology like VWAP, Delta, Sweeps, and Liquidity Walls where appropriate.`;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: response.text || "I'm having trouble processing that market data right now. Let's try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: "System Error: Connection to Alpha Intelligence lost. Please check your configuration.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col gap-6 overflow-hidden">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-electric-accent/10">
            <Bot className="w-6 h-6 text-electric-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">AI Trade Coach</h2>
            <p className="text-white/40 text-xs">Personalized Market Intelligence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 p-1 rounded-xl flex gap-1">
            {['Chat', 'Live', 'Review'].map(s => (
              <button
                key={s}
                onClick={() => setCoachState(s as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  coachState === s ? "bg-electric-accent text-primary-dark" : "text-white/40 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        {/* Mode Selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Select Mode</h3>
          {(Object.keys(modeConfig) as CoachMode[]).map((m) => {
            const config = modeConfig[m];
            const isActive = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "w-full p-4 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden",
                  isActive 
                    ? "bg-white/5 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                    : "bg-transparent border-white/5 hover:border-white/10"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-mode"
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={cn("p-2 rounded-lg", config.bgColor)}>
                    <config.icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  <div>
                    <h4 className={cn("font-display font-bold", isActive ? "text-white" : "text-white/60")}>{m}</h4>
                    <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{config.description}</p>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="glass-panel p-6 mt-8">
            <div className="flex items-center gap-2 mb-4 text-electric-accent">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Insights</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/60 leading-relaxed">
                  "Institutional activity in NVDA is 2.4x above average today. High probability of a trend day."
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/60 leading-relaxed">
                  "Market sentiment is shifting neutral. Consider tightening stops on long positions."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Interface */}
        <div className="lg:col-span-3 glass-panel flex flex-col min-h-0 overflow-hidden relative">
          {coachState === 'Chat' && (
            <>
              {/* Avatar Visualizer (Mock) */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-electric-accent/5 to-transparent pointer-events-none flex items-center justify-center">
                <div className="flex gap-1 items-end h-8">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, Math.random() * 32 + 8, 8] }}
                      transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                      className="w-1 bg-electric-accent/30 rounded-full"
                    />
                  ))}
                </div>
              </div>

              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 pt-24"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex gap-4 max-w-[80%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        msg.role === 'ai' ? "bg-electric-accent/10" : "bg-white/10"
                      )}>
                        {msg.role === 'ai' ? <Bot className="w-5 h-5 text-electric-accent" /> : <User className="w-5 h-5 text-white/60" />}
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed",
                        msg.role === 'ai' 
                          ? "bg-white/5 border border-white/5 text-white/90" 
                          : "bg-electric-accent text-primary-dark font-medium"
                      )}>
                        {msg.text}
                        <div className={cn(
                          "text-[8px] mt-2 opacity-40",
                          msg.role === 'user' ? "text-primary-dark" : "text-white"
                        )}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-white/5 bg-panel-surface/50">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isLoading ? "Alpha is thinking..." : `Ask the ${mode}...`}
                    disabled={isLoading}
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-24 text-sm focus:outline-none focus:border-electric-accent/50 transition-all",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleSend}
                      disabled={isLoading}
                      className={cn(
                        "p-2 bg-electric-accent text-primary-dark rounded-xl hover:opacity-90 transition-all active:scale-95",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <Activity className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {coachState === 'Live' && (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-300">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-electric-accent/10 flex items-center justify-center relative z-10">
                  <Bot className="w-16 h-16 text-electric-accent" />
                </div>
                <div className="absolute inset-0 bg-electric-accent/20 rounded-full animate-ping" />
                <div className="absolute inset-0 bg-electric-accent/10 rounded-full animate-pulse scale-125" />
              </div>
              
              <div className="space-y-4 max-w-md">
                <h3 className="text-2xl font-display font-bold">Live Trade Guidance</h3>
                <p className="text-white/60">
                  I'm currently monitoring your active positions. I'll provide real-time alerts for momentum shifts or liquidity walls.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                <div className="glass-panel p-4 text-left border-bullish/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-bullish">NVDA LONG</span>
                    <span className="text-[10px] font-mono text-white/40">+2.4%</span>
                  </div>
                  <p className="text-[10px] text-white/80 leading-relaxed italic">
                    "Momentum still strong. Next resistance: 903. Consider scaling partial profits."
                  </p>
                </div>
                <div className="glass-panel p-4 text-left border-white/10 opacity-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white/60">TSLA WATCH</span>
                    <span className="text-[10px] font-mono text-white/40">--</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed italic">
                    "Waiting for liquidity trap confirmation..."
                  </p>
                </div>
              </div>
            </div>
          )}

          {coachState === 'Review' && (
            <div className="flex-1 p-8 overflow-y-auto animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-display font-bold">Trade Review Mode</h3>
                  <p className="text-white/40 text-sm">Analyzing your last 5 sessions for performance leaks.</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-display font-bold text-institutional">78<span className="text-lg text-white/40">/100</span></div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Performance Score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 border-bullish/20">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-bullish mb-4">Strengths</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-bullish mt-1.5" />
                      Excellent entry timing on momentum breakouts.
                    </li>
                    <li className="flex gap-3 text-sm text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-bullish mt-1.5" />
                      Consistent risk management (Stop loss discipline).
                    </li>
                  </ul>
                </div>
                <div className="glass-panel p-6 border-bearish/20">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-bearish mb-4">Weaknesses</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-bearish mt-1.5" />
                      Exiting trades too early (Average profit left: 12%).
                    </li>
                    <li className="flex gap-3 text-sm text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-bearish mt-1.5" />
                      Over-trading during low-volatility mid-day sessions.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-electric-accent mb-4">Coach Recommendation</h4>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  "You trade best during the first 90 minutes of market open. Your win rate drops by 34% after 1:00 PM EST. I recommend focusing your capital on the morning volatility and using the afternoon for strategy research."
                </p>
                <div className="flex gap-3">
                  <button className="btn-primary py-2 text-xs">Update Strategy Lab</button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">View Full Analytics</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
