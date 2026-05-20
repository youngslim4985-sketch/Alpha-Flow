import React from 'react';
import { motion } from 'motion/react';
import { DecisionEvent } from '../types/epistemic';
import { ShieldCheck, Target, Layers, Hash, Clock, Activity, Zap, Info } from 'lucide-react';

interface DecisionSnapshotViewProps {
  decision: DecisionEvent;
}

export const DecisionSnapshotView: React.FC<DecisionSnapshotViewProps> = ({ decision }) => {
  const { snapshot, score, reasoning, decision: action, intent_id } = decision.data;

  return (
    <div className="flex flex-col h-full bg-[#05080A] rounded-xl font-mono text-[11px] overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-electric-accent">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-bold tracking-tight text-sm uppercase">Decision Snapshot v2.1</span>
        </div>
        <div className="flex items-center gap-2">
            {intent_id && (
                <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-bold">
                    INTENT_LIVE
                </div>
            )}
            <div className={`px-2 py-1 rounded border font-bold text-[10px] ${
            action === 'EXECUTE' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' :
            action === 'AVOID' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
            'bg-blue-500/10 border-blue-500/50 text-blue-400'
            }`}>
            {action}
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Scorer & Regime */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-[9px] text-white/40 uppercase mb-1 flex items-center gap-1">
                <Activity className="w-2 h-2" /> Score
            </p>
            <p className="text-2xl font-bold text-white">{(score * 100).toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-[9px] text-white/40 uppercase mb-1 flex items-center gap-1">
                <Zap className="w-2 h-2" /> Detected Regime
            </p>
            <p className="text-xs font-bold text-amber-400 tracking-tighter truncate uppercase">{snapshot.regime.name}</p>
            <p className="text-[8px] text-white/20">CONFIDENCE: {(snapshot.regime.prevalence * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Liquidity Diagnostics (Option C Focus) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
            <p className="text-[9px] text-white/40 uppercase mb-1">Liquidity Depth</p>
            <p className="text-xs font-bold text-white/80">${(snapshot.liquidity_depth / 1000000).toFixed(2)}M</p>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
            <p className="text-[9px] text-white/40 uppercase mb-1">Order Pressure</p>
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${snapshot.order_pressure > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ 
                            width: `${Math.abs(snapshot.order_pressure) * 100}%`,
                            marginLeft: snapshot.order_pressure > 0 ? '50%' : `${50 - Math.abs(snapshot.order_pressure) * 50}%`
                        }}
                    />
                </div>
                <span className={`text-[10px] font-bold ${snapshot.order_pressure > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {snapshot.order_pressure.toFixed(2)}
                </span>
            </div>
          </div>
        </div>

        {/* Reasoning Block */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-white/40">
            <Target className="w-3 h-3" />
            <span className="text-[9px] uppercase font-bold">Traceable Reasoning</span>
          </div>
          <div className="p-3 bg-white/[0.05] border border-white/10 rounded-lg text-white/80 leading-relaxed italic text-[10px]">
            "{reasoning}"
          </div>
        </div>

        {/* Lineage Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2 text-white/40">
            <Layers className="w-3 h-3" />
            <span className="text-[9px] uppercase font-bold">Lineage & Dependencies</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
              <span className="text-white/40 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Contributing Events
              </span>
              <span className="text-white font-bold">{snapshot.contributing_event_ids.length} Nodes</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
              <span className="text-white/40">State Hash</span>
              <span className="font-mono text-white/60 text-[9px]">{snapshot.cache_state_hash}</span>
            </div>
            {intent_id && (
                <div className="flex items-center justify-between p-2 bg-amber-500/5 rounded border border-amber-500/20">
                    <span className="text-amber-500/60 uppercase text-[9px] font-bold">Intent Payload</span>
                    <span className="font-mono text-amber-500 text-[9px]">{intent_id.slice(0, 12)}</span>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[9px] text-white/20">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          SNAP_TIME: {new Date(snapshot.timestamp).toLocaleTimeString()}
        </div>
        <span>ENGINE_V: {decision.data.engine_version}</span>
      </div>
    </div>
  );
};
