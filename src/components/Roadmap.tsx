import React from 'react';
import { motion } from 'motion/react';
import { 
  Milestone, 
  Rocket, 
  BrainCircuit, 
  Users, 
  DollarSign, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const roadmapData = [
  {
    phase: "Phase 1",
    title: "Foundation & MVP",
    months: "Months 1–3",
    status: "In Progress",
    icon: <Rocket className="w-5 h-5" />,
    items: [
      "Market Command Center (Live)",
      "Order Flow Alpha Engine (Live)",
      "AI Avatar Trade Coach (Live)",
      "Basic User Accounts",
      "Real-time Signal Feed"
    ],
    metrics: "Target: 1,000 Early Users"
  },
  {
    phase: "Phase 2",
    title: "Intelligence Layer",
    months: "Months 4–6",
    status: "Upcoming",
    icon: <BrainCircuit className="w-5 h-5" />,
    items: [
      "Smart Money Radar (Sweeps/Blocks)",
      "Liquidity Wall Detection",
      "AI Confidence Scoring",
      "Market Replay Engine",
      "Earnings Event Analysis"
    ],
    metrics: "Target: 5,000+ Users"
  },
  {
    phase: "Phase 3",
    title: "Network Effects",
    months: "Months 7–9",
    status: "Planned",
    icon: <Users className="w-5 h-5" />,
    items: [
      "Trade Battle Arena (Gamification)",
      "Strategy Profiles & Sharing",
      "Community Intelligence Feed",
      "Leaderboards & Rankings",
      "Social Copy Trading (Alpha)"
    ],
    metrics: "Target: 15,000+ Users"
  },
  {
    phase: "Phase 4",
    title: "Monetization & Scale",
    months: "Months 10–12",
    status: "Vision",
    icon: <DollarSign className="w-5 h-5" />,
    items: [
      "SaaS Subscription Tiers",
      "Institutional Data Integration",
      "Mobile App (iOS/Android)",
      "Brokerage API Connectivity",
      "AI Portfolio Management"
    ],
    metrics: "Target: $200k+ ARR"
  }
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-[#05080A] p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="px-3 py-1 rounded-full bg-electric-accent/10 border border-electric-accent/20 text-electric-accent text-[10px] font-bold uppercase tracking-widest">
              Strategic Vision
            </div>
            <div className="h-px flex-1 bg-white/5" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-display font-bold mb-6 tracking-tight"
          >
            The Path to <span className="text-electric-accent">Venture Scale.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/40 max-w-2xl leading-relaxed"
          >
            A 12-month roadmap designed to turn AlphaFlow into a category-defining fintech platform under T & F Investments & Holdings.
          </motion.p>
        </header>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roadmapData.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={cn(
                "glass-panel p-8 relative overflow-hidden group",
                phase.status === "In Progress" ? "border-electric-accent/30 bg-electric-accent/5" : "border-white/5"
              )}
            >
              {/* Background Glow */}
              <div className={cn(
                "absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full transition-opacity duration-500",
                phase.status === "In Progress" ? "bg-electric-accent/20 opacity-100" : "bg-white/5 opacity-0 group-hover:opacity-100"
              )} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      phase.status === "In Progress" ? "bg-electric-accent text-primary-dark" : "bg-white/5 text-white/40"
                    )}>
                      {phase.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-electric-accent uppercase tracking-widest">{phase.phase}</p>
                      <h3 className="text-xl font-display font-bold">{phase.title}</h3>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                    phase.status === "In Progress" ? "bg-electric-accent/10 border-electric-accent/20 text-electric-accent" : 
                    phase.status === "Upcoming" ? "bg-white/5 border-white/10 text-white/40" : "bg-black/40 border-white/5 text-white/20"
                  )}>
                    {phase.status}
                  </div>
                </div>

                <p className="text-xs text-white/40 font-mono mb-8">{phase.months}</p>

                <ul className="space-y-4 mb-8">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                      {item.includes("(Live)") ? (
                        <CheckCircle2 className="w-4 h-4 text-bullish shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/10 shrink-0 mt-0.5" />
                      )}
                      <span className={cn(item.includes("(Live)") && "text-white font-medium")}>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-white/20" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{phase.metrics}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-electric-accent transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategic Endgame Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 glass-panel p-12 bg-gradient-to-br from-white/5 to-transparent border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-display font-bold mb-4">The Strategic <span className="text-electric-accent">Endgame.</span></h2>
              <p className="text-sm text-white/40 leading-relaxed">
                We aren't just building a trading tool. We are building the intelligence layer for the next generation of capital markets.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <EndgameCard 
                icon={<Zap className="w-5 h-5" />} 
                title="Brokerage Integration" 
                desc="Direct execution through major clearing firms."
              />
              <EndgameCard 
                icon={<BarChart3 className="w-5 h-5" />} 
                title="Institutional SaaS" 
                desc="High-margin data subscriptions for hedge funds."
              />
              <EndgameCard 
                icon={<Lock className="w-5 h-5" />} 
                title="AI Asset Mgmt" 
                desc="Automated wealth management for the AI era."
              />
            </div>
          </div>
        </motion.section>

        {/* Footer Call to Action */}
        <footer className="mt-24 text-center pb-24">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-8">T & F Investments & Holdings // Proprietary Strategy</p>
          <button className="btn-primary px-12 py-4 text-sm tracking-widest uppercase">
            Execute Phase 2
          </button>
        </footer>
      </div>
    </div>
  );
}

function EndgameCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-electric-accent/20 transition-all group">
      <div className="w-10 h-10 rounded-lg bg-electric-accent/10 flex items-center justify-center text-electric-accent mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-display font-bold text-sm mb-2">{title}</h4>
      <p className="text-[11px] text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}
