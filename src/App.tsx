import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OrderFlow from './components/OrderFlow';
import AICoach from './components/AICoach';
import SmartMoneyRadar from './components/SmartMoneyRadar';
import MarketReplay from './components/MarketReplay';
import TradeBattleArena from './components/TradeBattleArena';
import StrategyLab from './components/StrategyLab';
import CommandCenter from './components/CommandCenter';
import Roadmap from './components/Roadmap';
import NetworkIntelligence from './components/NetworkIntelligence';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('command');

  const renderContent = () => {
    switch (activeTab) {
      case 'command':
        return <CommandCenter />;
      case 'network':
        return <NetworkIntelligence />;
      case 'roadmap':
        return <Roadmap />;
      case 'dashboard':
        return <Dashboard />;
      case 'orderflow':
        return <OrderFlow />;
      case 'radar':
        return <SmartMoneyRadar />;
      case 'signals':
        return <AICoach />;
      case 'replay':
        return <MarketReplay />;
      case 'battles':
        return <TradeBattleArena />;
      case 'lab':
        return <StrategyLab />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-4">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
              <span className="text-4xl font-display font-bold">?</span>
            </div>
            <p className="font-display font-medium uppercase tracking-widest text-xs">Module Under Development</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-primary-dark text-white selection:bg-electric-accent/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#7C4DFF]/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
