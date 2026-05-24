import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, AlertTriangle, CheckCircle, Play, RefreshCw, Terminal, Activity } from 'lucide-react';
import { DeterministicStateEngine } from '../lib/state-engine';
import { SimulationHarness, SimulationResult } from '../lib/simulation-harness';
import { EngineState } from '../types/state-engine';

export const StateEngineMonitor: React.FC = () => {
  const [engine] = useState(() => new DeterministicStateEngine());
  const [history, setHistory] = useState<any[]>([]);
  const [state, setState] = useState<EngineState>('DISCONNECTED');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runSimulation = async () => {
    setIsRunningSim(true);
    setLogs([]);
    const harness = new SimulationHarness();
    const result = await harness.runChaosTest();
    setSimResult(result);
    setIsRunningSim(false);
  };

  const manualSignal = (type: string, priority: any, payload: any = {}) => {
    const result = engine.step([{
      id: Math.random().toString(36).substr(2, 9),
      type,
      priority,
      payload,
      timestamp: Date.now()
    }]);
    
    setLogs(prev => [...prev, ...result.logs].slice(-50));
    setHistory(engine.getHistory());
    setState(engine.getState());
  };

  return (
    <div className="flex flex-col h-full bg-[#030303] border border-white/10 rounded-xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-white tracking-widest uppercase">State_Core_Harness_v2.5</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            state === 'LIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' :
            state === 'DEGRADED' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
            'bg-blue-500/10 text-blue-500 border border-blue-500/30'
          }`}>
            {state}
          </span>
          <button 
            onClick={runSimulation}
            disabled={isRunningSim}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-50"
          >
            <Play className={`w-3 h-3 text-emerald-400 ${isRunningSim ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left: Logic Controls & State Chart */}
        <div className="col-span-8 p-4 border-r border-white/10 flex flex-col gap-4 overflow-y-auto">
          {/* Visual State Path */}
          <div className="flex items-center justify-between px-4 py-6 bg-white/[0.02] rounded-lg border border-white/5 relative">
            {['DISCONNECTED', 'CONNECTING', 'SESSION_VALIDATED', 'REPLAY_SYNC', 'LIVE'].map((s, idx, arr) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    state === s ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 
                    idx < arr.indexOf(state) ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5'
                  }`}>
                    {state === s ? <Zap className="w-4 h-4 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                  </div>
                  <span className={`text-[8px] font-bold uppercase transition-colors ${state === s ? 'text-white' : 'text-white/20'}`}>
                    {s.split('_')[0]}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex-1 h-[2px] bg-white/5 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Signal Injector */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[9px] text-white/40 uppercase mb-2 font-bold select-none">System Signals</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => manualSignal('CONNECT_REQUEST', 'HIGH')} className="px-2 py-1 bg-blue-500 text-white rounded text-[10px] hover:bg-blue-400">Connect</button>
                <button onClick={() => manualSignal('SESSION_VALIDATED', 'MEDIUM')} className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px]">Validate</button>
                <button onClick={() => manualSignal('START_REPLAY', 'HIGH')} className="px-2 py-1 bg-emerald-500 text-black font-bold rounded text-[10px] hover:bg-emerald-400">Replay</button>
                <button onClick={() => manualSignal('HEARTBEAT_TIMEOUT', 'CRITICAL')} className="px-2 py-1 bg-red-500/20 text-red-500 border border-red-500/40 rounded text-[10px] hover:bg-red-500/30">Timeout</button>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <p className="text-[9px] text-white/40 uppercase mb-2 font-bold">Operational Signals</p>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => manualSignal('REPLAY_COMPLETE', 'HIGH')} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px]">Complete</button>
                    <button onClick={() => manualSignal('PRESSURE', 'CRITICAL', { level: 0.95 })} className="px-2 py-1 bg-red-500 text-white rounded text-[10px]">Overpressure</button>
                    <button onClick={() => manualSignal('PRESSURE', 'MEDIUM', { level: 0.4 })} className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded text-[10px]">Cooling</button>
                    <button onClick={() => manualSignal('FORCED_TERMINATION', 'CRITICAL')} className="px-2 py-1 bg-black text-red-500 border border-red-500/50 rounded text-[10px]">Kill</button>
                </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="flex-1 bg-black/40 rounded-lg p-3 border border-white/5 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 text-white/40 border-b border-white/5 pb-2">
                <Activity className="w-3 h-3" />
                <span className="text-[9px] uppercase font-bold tracking-widest">Real-time Transition Logs</span>
            </div>
            <div className="space-y-1">
                {logs.length === 0 && <p className="text-white/20 italic">Awaiting signal ingestion...</p>}
                {logs.map((log, i) => (
                    <div key={i} className="text-[10px] text-white/60 font-mono leading-tight">
                        <span className="text-white/20 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                        {log}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Simulation Harness Results */}
        <div className="col-span-4 p-4 bg-black/60 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-white/40">
            <Shield className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] uppercase font-bold">CHAOS_INVARIANT_VALIDATION</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2">
            {!simResult ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 border border-dashed border-white/10 rounded-lg">
                    <RefreshCw className="w-8 h-8 text-white/10 mb-4" />
                    <p className="text-white/20 font-bold uppercase tracking-tighter">No Test Data</p>
                    <p className="text-[10px] text-white/10 mt-2">Execute simulation to verify engine invariants.</p>
                </div>
            ) : (
                simResult.assertions.map((a, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-2 rounded border flex items-start gap-2 ${
                            a.passed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                        }`}
                    >
                        {a.passed ? <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5" /> : <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5" />}
                        <div className="min-w-0">
                            <p className={`text-[10px] font-bold ${a.passed ? 'text-emerald-400' : 'text-red-400'} truncate uppercase`}>{a.name}</p>
                            {a.error && <p className="text-[8px] text-red-400/60 mt-1">{a.error}</p>}
                        </div>
                    </motion.div>
                ))
            )}
          </div>

          {simResult && (
              <div className="mt-4 p-3 bg-white/5 rounded border border-white/5">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-white/40 uppercase font-bold">Chaos Metrics</span>
                    <span className={`text-[10px] font-bold ${simResult.assertions.every(a => a.passed) ? 'text-emerald-500' : 'text-red-500'}`}>
                        {simResult.assertions.filter(a => a.passed).length}/{simResult.assertions.length} PASS
                    </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${(simResult.assertions.filter(a => a.passed).length / simResult.assertions.length) * 100}%` }}
                    />
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
