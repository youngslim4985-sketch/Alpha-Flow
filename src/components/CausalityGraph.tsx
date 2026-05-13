import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntelligenceEvent } from '../types';
import { GitBranch, MessageSquare, Zap, Activity, Info } from 'lucide-react';

interface CausalityGraphProps {
  events: IntelligenceEvent[];
  selectedEventId?: string;
  onEventSelect?: (eventId: string) => void;
}

export const CausalityGraph: React.FC<CausalityGraphProps> = ({ 
  events, 
  selectedEventId,
  onEventSelect 
}) => {
  // Sort events by canonical order
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.clock.kernel_time !== b.clock.kernel_time) {
        return a.clock.kernel_time - b.clock.kernel_time;
      }
      return a.clock.logical_time - b.clock.logical_time;
    });
  }, [events]);

  return (
    <div className="flex flex-col h-full bg-[#050505] border border-white/5 rounded-xl overflow-hidden font-mono text-xs">
      <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-white tracking-tighter">CAUSALITY_GRAPH v1.0</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            <span className="text-white/40 uppercase">Market</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500/50" />
            <span className="text-white/40 uppercase">Signal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500/50" />
            <span className="text-white/40 uppercase">Order</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {sortedEvents.map((event, index) => {
            const isSelected = selectedEventId === event.id;
            const hasCausality = event.causality_chain.length > 0;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onEventSelect?.(event.id)}
                className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-white/5 border-white/5 hover:border-white/20 text-white/60'
                }`}
              >
                {/* Connection Line */}
                {index > 0 && (
                  <div className="absolute -top-4 left-6 w-[2px] h-4 bg-white/10" />
                )}

                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1.5 rounded-md ${
                    event.category === 'MARKET' ? 'bg-emerald-500/20 text-emerald-500' :
                    event.category === 'SIGNAL' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-purple-500/20 text-purple-500'
                  }`}>
                    {event.category === 'MARKET' ? <Activity className="w-3 h-3" /> :
                     event.category === 'SIGNAL' ? <Zap className="w-3 h-3" /> :
                     <MessageSquare className="w-3 h-3" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold truncate ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                        {event.type}
                      </span>
                      <span className="text-[10px] text-white/30 shrink-0">
                        L:{event.clock.logical_time} | SEQ:{event.clock.sequence_id.split('-')[2]}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed mb-2 opacity-80 truncate">
                      {JSON.stringify(event.data).slice(0, 80)}...
                    </p>

                    {hasCausality && (
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <Info className="w-3 h-3 text-white/40" />
                        <span className="text-[10px] text-white/40">
                          CAUSED BY: {event.causality_chain.map(id => id.slice(0, 6)).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div 
                    layoutId="selected-border"
                    className="absolute inset-0 border border-emerald-500 rounded-lg pointer-events-none" 
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-4 text-[10px] text-white/40">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            KERNEL_TIME: {sortedEvents.length > 0 ? sortedEvents[sortedEvents.length - 1].clock.kernel_time : 'NULL'}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            TOTAL_EVENTS: {sortedEvents.length}
          </div>
        </div>
      </div>
    </div>
  );
};
