import React from 'react';
import { motion } from 'motion/react';
import { DecisionEvent } from '../types/epistemic';
import { ShieldCheck, Target, Layers, Hash, Clock } from 'lucide-react';

interface DecisionSnapshotViewProps {
  decision: DecisionEvent;
}

export const DecisionSnapshotView: React.FC<DecisionSnapshotViewProps> = ({ decision }) => {
  const { snapshot, score, reasoning, decision: action } = decision.data;

  return (
    <div className="flex flex-col h-full bg-[#05080A] rounded-xl font-mono text-[11px] overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-electric-accent">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-bold tracking-tight text-sm uppercase">Decision Snapshot v2.1</span>
        </div>
        <div className={`px-2 py-1 rounded border font-bold text-[10px] ${
          action === 'EXECUTE' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' :
          action === 'AVOID' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
          'bg-blue-500/10 border-blue-500/50 text-blue-400'
        }`}>
          {action}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Scorer Header */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[9px] text-white/40 uppercase mb-1">Final Score</p>
            <p className="text-2xl font-bold text-white">{(score * 100).toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[9px] text-white/40 uppercase mb-1">State Hash</p>
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-white/20" />
              <p className="text-xs font-bold text-white/60 truncate">{snapshot.cache_state_hash}</p>
            </div>
          </div>
        </div>

        {/* Reasoning Block */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-white/40">
            <Target className="w-3 h-3" />
            <span className="text-[9px] uppercase font-bold">Traceable Reasoning</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-white/70 leading-relaxed italic">
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
              <span className="text-white/40">Contributing Events</span>
              <span className="text-white font-bold">{snapshot.contributing_event_ids.length} Nodes</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
              <span className="text-white/40">Active Annotations</span>
              <span className="text-white font-bold">{snapshot.active_annotations.length} Validated</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
              <span className="text-white/40">Engine Version</span>
              <span className="text-white/60">{decision.data.engine_version}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[9px] text-white/20">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          SNAP_TIME: {new Date(snapshot.timestamp).toLocaleTimeString()}
        </div>
        <span>SNAPSHOT_ID: {snapshot.id.slice(0,8)}</span>
      </div>
    </div>
  );
};
