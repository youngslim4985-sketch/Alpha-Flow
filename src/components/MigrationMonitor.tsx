import React from 'react';
import { motion } from 'motion/react';
import { ProductionEvent } from '../types';
import { Shield, Database, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MigrationMonitorProps {
  migratedEvents: ProductionEvent[];
}

export const MigrationMonitor: React.FC<MigrationMonitorProps> = ({ migratedEvents }) => {
  return (
    <div className="flex flex-col h-full bg-[#080808] border border-white/10 rounded-xl font-mono text-[11px] overflow-hidden">
      <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-400">
          <Database className="w-4 h-4" />
          <span className="font-bold tracking-tight">MIGRATION_V6_ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px]">
          <CheckCircle2 className="w-3 h-3" />
          VALIDATION_PASSING
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {migratedEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <Shield className="w-8 h-8 mb-2 opacity-50" />
            <p>AWAITING LEGACY STREAM...</p>
          </div>
        )}
        {migratedEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 border border-white/5 bg-white/[0.02] rounded flex items-center gap-3 group"
          >
            <div className="flex fle-col items-center gap-1 min-w-[80px]">
              <span className="text-[9px] text-blue-500/60 font-bold">{event.metadata.legacySource.toUpperCase()}</span>
              <ArrowRight className="w-2 h-2 text-white/20" />
              <span className="text-[9px] text-emerald-500/60 font-bold">KERNEL</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white/80 font-bold truncate">{event.type}</span>
                <span className="text-white/20 text-[9px]">SEQ:{event.sequence}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-white/40 truncate">CID: {event.correlationId.slice(0, 8)}...</span>
                <span className="text-[9px] text-emerald-500/40 px-1 border border-emerald-500/20 rounded">SIG:{event.signature?.slice(0, 6)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-2 border-t border-white/10 bg-black/40 flex items-center justify-between text-[9px] text-white/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            LEGACY_SYNC
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            PRODUCTION_READY
          </span>
        </div>
        <span>TOTAL: {migratedEvents.length}</span>
      </div>
    </div>
  );
};
