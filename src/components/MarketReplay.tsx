import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  FastForward, 
  Pause, 
  BookOpen, 
  Calendar, 
  Trophy,
  ChevronRight,
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ReplaySession } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const mockSessions: ReplaySession[] = [
  {
    id: 's1',
    title: 'NVDA Earnings Breakout',
    date: 'May 22, 2024',
    description: 'Replay the massive volatility and order flow absorption during the Q1 earnings release.',
    difficulty: 'Expert',
    tags: ['Volatility', 'Earnings', 'Tech']
  },
  {
    id: 's2',
    title: 'TSLA Volatility Spike',
    date: 'June 10, 2024',
    description: 'Learn to identify the liquidity trap that led to a 15% intraday move.',
    difficulty: 'Intermediate',
    tags: ['Liquidity Trap', 'Momentum']
  },
  {
    id: 's3',
    title: 'GME Short Squeeze Replay',
    date: 'Historical',
    description: 'The ultimate study in gamma pressure and retail-driven momentum.',
    difficulty: 'Beginner',
    tags: ['Short Squeeze', 'Gamma']
  }
];

export default function MarketReplay() {
  const [activeSession, setActiveSession] = useState<ReplaySession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  return (
    <div className="p-8 h-screen flex flex-col gap-8 overflow-hidden">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-institutional mb-2">
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Training Simulator</span>
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Market Replay Engine</h2>
          <p className="text-white/40 text-sm mt-1">Master the tape by replaying historical market events.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <Trophy className="w-4 h-4 text-institutional" />
            <span className="text-xs font-mono font-bold">XP: 2,450</span>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!activeSession ? (
          <motion.div 
            key="library"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mockSessions.map((session) => (
              <div 
                key={session.id} 
                onClick={() => setActiveSession(session)}
                className="glass-panel p-6 glow-hover group cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-institutional/10 transition-colors">
                    <BookOpen className="w-6 h-6 text-institutional" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full",
                    session.difficulty === 'Beginner' ? "bg-bullish/10 text-bullish" :
                    session.difficulty === 'Intermediate' ? "bg-warning/10 text-warning" :
                    "bg-bearish/10 text-bearish"
                  )}>
                    {session.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold mb-2 group-hover:text-institutional transition-colors">
                  {session.title}
                </h3>
                <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>{session.date}</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
                  {session.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {session.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-white/40 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full btn-primary py-3 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-all">
                  <Play className="w-4 h-4 fill-current" />
                  Start Replay
                </button>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col gap-6 min-h-0"
          >
            {/* Replay Player UI */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
              <div className="lg:col-span-3 glass-panel p-6 flex flex-col relative overflow-hidden">
                {/* Mock Chart Area */}
                <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Zap className="w-64 h-64 text-institutional" />
                  </div>
                  <div className="text-center z-10">
                    <p className="text-white/40 font-mono text-sm mb-2">SIMULATION ACTIVE</p>
                    <h4 className="text-2xl font-display font-bold">{activeSession.title}</h4>
                  </div>
                  
                  {/* Floating AI Insight */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute top-6 right-6 w-64 p-4 rounded-xl bg-institutional/10 border border-institutional/20 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2 text-institutional mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">AI Coach Insight</span>
                    </div>
                    <p className="text-[10px] text-white/80 leading-relaxed italic">
                      "Notice how buyers absorbed selling at 410. That absorption triggered the breakout."
                    </p>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-institutional text-primary-dark flex items-center justify-center hover:scale-110 transition-all active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold">10:42:15 AM</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">Playback Time</span>
                    </div>
                  </div>

                  <div className="flex-1 mx-12">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-institutional/20 w-1/3" />
                      <div className="absolute top-0 left-1/3 w-2 h-full bg-institutional shadow-[0_0_10px_#F1C40F]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                      {[1, 2, 3, 5].map(s => (
                        <button 
                          key={s}
                          onClick={() => setSpeed(s)}
                          className={cn(
                            "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                            speed === s ? "bg-institutional text-primary-dark" : "text-white/40 hover:text-white"
                          )}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setActiveSession(null)}
                      className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex flex-col min-h-0">
                <div className="glass-panel p-6 flex-1 flex flex-col min-h-0">
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-institutional" />
                    Replay Feed
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 font-mono text-[10px]">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex justify-between mb-1">
                          <span className="text-white/40">10:42:0{i}</span>
                          <span className="text-bullish font-bold">BUY</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">412.50</span>
                          <span className="font-bold">2,400</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 bg-institutional/5 border-institutional/20">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-institutional mb-2">Learning Objective</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    Identify the specific moment institutional absorption turns into momentum. Watch for the 'Sweep' alerts on the tape.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
