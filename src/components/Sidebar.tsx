import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Zap, 
  Radio, 
  Radar, 
  FlaskConical, 
  Settings,
  TrendingUp,
  ShieldAlert,
  RotateCcw,
  Swords,
  Monitor,
  Milestone,
  Network
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { id: 'command', label: 'Command Center', icon: Monitor },
  { id: 'network', label: 'Alpha OS', icon: Network },
  { id: 'roadmap', label: 'Strategic Vision', icon: Milestone },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: BarChart3 },
  { id: 'orderflow', label: 'Alpha Engine', icon: Zap },
  { id: 'radar', label: 'Smart Money', icon: Radar },
  { id: 'signals', label: 'AI Coach', icon: Radio },
  { id: 'replay', label: 'Market Replay', icon: RotateCcw },
  { id: 'battles', label: 'Trade Battles', icon: Swords },
  { id: 'lab', label: 'Strategy Lab', icon: FlaskConical },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-white/5 bg-panel-surface/50 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-accent to-[#7C4DFF] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
          <TrendingUp className="text-primary-dark w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight">AlphaFlow</h1>
          <p className="text-[10px] text-electric-accent font-mono uppercase tracking-widest opacity-70">Terminal v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-electric-accent/10 text-electric-accent border border-electric-accent/20" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
              activeTab === item.id ? "text-electric-accent" : "text-white/40"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-electric-accent shadow-[0_0_8px_#00E5FF]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-warning">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Risk Alert</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            High volatility detected in NVDA options flow. Gamma squeeze potential: 84%
          </p>
        </div>
        
        <button className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}
