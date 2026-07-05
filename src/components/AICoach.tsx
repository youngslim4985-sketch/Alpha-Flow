import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  GraduationCap, 
  BookOpen, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  HelpCircle, 
  DollarSign, 
  Calculator, 
  Activity, 
  LineChart, 
  Sliders, 
  Play, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Compass, 
  Gauge, 
  Clock, 
  Sparkles, 
  Send, 
  User, 
  Bot,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Define core interfaces
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Path {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  lessons: { id: string; title: string; completed: boolean }[];
  quiz: QuizQuestion[];
}

// 11 Core Learning Paths from positioning document
const LEARNING_PATHS: Path[] = [
  {
    id: 'p1',
    title: 'Financial Literacy',
    description: 'Master the absolute basics of money, interest rates, inflation, and market participants.',
    difficulty: 'Beginner',
    lessons: [
      { id: 'p1-l1', title: 'What is a Financial Market?', completed: true },
      { id: 'p1-l2', title: 'The Power of Compound Interest', completed: true },
      { id: 'p1-l3', title: 'Understanding Inflation & Purchasing Power', completed: false },
    ],
    quiz: [
      {
        id: 'p1-q1',
        question: 'When inflation rises, what is the typical effect on the purchasing power of cash?',
        options: [
          'Purchasing power increases as cash becomes more valuable.',
          'Purchasing power decreases, meaning cash buys fewer goods.',
          'Purchasing power remains completely unchanged.',
          'Inflation does not affect cash value, only equity prices.'
        ],
        correctIndex: 1,
        explanation: 'Inflation measures the rate at which general price levels rise. Consequently, each unit of currency buys a smaller percentage of a good or service, eroding purchasing power.'
      }
    ]
  },
  {
    id: 'p2',
    title: 'Investing Fundamentals',
    description: 'Learn the difference between trading and investing, asset classes, and compound growth.',
    difficulty: 'Beginner',
    lessons: [
      { id: 'p2-l1', title: 'Stocks vs. Bonds vs. Commodities', completed: false },
      { id: 'p2-l2', title: 'The Concept of Value & Price', completed: false },
      { id: 'p2-l3', title: 'Market Cap and Sector Basics', completed: false },
    ],
    quiz: [
      {
        id: 'p2-q1',
        question: 'What is the fundamental difference between price and value in investing?',
        options: [
          'They are exactly the same thing.',
          'Price is what you pay; value is what you get.',
          'Value is determined by market cap, while price is random.',
          'Price is set by institutional buyers; value is set by retail.'
        ],
        correctIndex: 1,
        explanation: 'As legendary investor Warren Buffett says: "Price is what you pay. Value is what you get." Price is the transaction quote, whereas value is the intrinsic worth of the asset.'
      }
    ]
  },
  {
    id: 'p3',
    title: 'Technical Analysis',
    description: 'Decode the language of price action, volume, support/resistance, and indicators.',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'p3-l1', title: 'Introduction to Candlestick Charts', completed: false },
      { id: 'p3-l2', title: 'Mapping Support and Resistance Zones', completed: false },
      { id: 'p3-l3', title: 'Leveraging Volume & Trendlines', completed: false },
    ],
    quiz: [
      {
        id: 'p3-q1',
        question: 'Which of the following describes a support level on a price chart?',
        options: [
          'An area where buying interest is sufficiently strong to overcome selling pressure.',
          'The maximum price an asset has ever reached in history.',
          'A technical indicator showing overbought momentum.',
          'An overhead boundary where selling volume typically spikes.'
        ],
        correctIndex: 0,
        explanation: 'Support is a price level where demand (buying power) is expected to prevent the price from falling further, acting as a temporary "floor".'
      }
    ]
  },
  {
    id: 'p4',
    title: 'Risk Management',
    description: 'Build habits that protect capital. Master position sizing, stop losses, and drawdowns.',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'p4-l1', title: 'The Golden Rules of Capital Preservation', completed: false },
      { id: 'p4-l2', title: 'Calculating Position Sizing and Risk-Reward Ratios', completed: false },
      { id: 'p4-l3', title: 'How to Correctly Place and Respect Stop Losses', completed: false },
    ],
    quiz: [
      {
        id: 'p4-q1',
        question: 'If you have a $10,000 portfolio and wish to risk only 1% of your total capital on a single trade, how much absolute capital are you willing to lose?',
        options: [
          '$1,000',
          '$500',
          '$100',
          '$10'
        ],
        correctIndex: 2,
        explanation: '1% of $10,000 is exactly $100. This is the absolute dollar amount you risk losing if your stop loss is triggered.'
      }
    ]
  },
  {
    id: 'p5',
    title: 'Portfolio Construction',
    description: 'Explore diversification, modern portfolio theory, and defensive asset allocations.',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'p5-l1', title: 'What is Portfolio Diversification?', completed: false },
      { id: 'p5-l2', title: 'Asset Correlation & Balanced Allocation', completed: false },
      { id: 'p5-l3', title: 'Rebalancing Strategies for Volatile Markets', completed: false },
    ],
    quiz: [
      {
        id: 'p5-q1',
        question: 'Why do investors allocate capital to uncorrelated assets?',
        options: [
          'To ensure that when one asset falls, the other is likely to hold or rise, lowering overall risk.',
          'To guarantee maximum short-term profits in a bull market.',
          'Because the law requires all professional portfolios to hold gold.',
          'To increase the transaction volume and fee discounts.'
        ],
        correctIndex: 0,
        explanation: 'Uncorrelated assets do not move in tandem. Holding them reduces the portfolio\'s overall volatility and drawdown risk.'
      }
    ]
  },
  {
    id: 'p6',
    title: 'Behavioral Finance',
    description: 'Conquer the psychological barriers: FOMO, greed, fear, loss aversion, and cognitive bias.',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'p6-l1', title: 'The Psychology of FOMO and Greed', completed: false },
      { id: 'p6-l2', title: 'Loss Aversion & the Disposition Effect', completed: false },
      { id: 'p6-l3', title: 'Confirmation Bias: The Silent Portfolio Killer', completed: false },
    ],
    quiz: [
      {
        id: 'p6-q1',
        question: 'What behavioral bias causes traders to hold losing trades too long while selling winners too quickly?',
        options: [
          'Confirmation Bias',
          'Anchoring Bias',
          'Loss Aversion (The Disposition Effect)',
          'Hindsight Bias'
        ],
        correctIndex: 2,
        explanation: 'Loss aversion makes the pain of losing twice as intense as the joy of winning, leading investors to hold onto losing trades in hopes of breaking even, while selling winners prematurely.'
      }
    ]
  },
  {
    id: 'p7',
    title: 'Macroeconomics',
    description: 'Connect interest rates, central bank policies, GDP, and inflation to stock prices.',
    difficulty: 'Expert',
    lessons: [
      { id: 'p7-l1', title: 'The Role of the Federal Reserve & Central Banks', completed: false },
      { id: 'p7-l2', title: 'How Interest Rates Impact Corporate Valuations', completed: false },
      { id: 'p7-l3', title: 'The Economic Cycle: Expansion to Recession', completed: false },
    ],
    quiz: [
      {
        id: 'p7-q1',
        question: 'When the Federal Reserve raises interest rates, what is the historical impact on growth-oriented equities?',
        options: [
          'Growth equities rise significantly because money becomes cheaper.',
          'Growth equities typically face headwinds as the discount rate on future cash flows increases.',
          'Valuations are completely unaffected by macroeconomic policies.',
          'Bonds automatically convert to equities, causing massive liquidity spikes.'
        ],
        correctIndex: 1,
        explanation: 'Higher interest rates increase borrowing costs and increase the discount rate applied to future earnings, which disproportionately compresses the current valuation of growth companies.'
      }
    ]
  },
  {
    id: 'p8',
    title: 'Cryptocurrency Markets',
    description: 'Deconstruct digital scarcity, block verification, smart contracts, and high volatility.',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'p8-l1', title: 'What is Bitcoin and Blockchain Technology?', completed: false },
      { id: 'p8-l2', title: 'Ethereum & Smart Contract Ecosystems', completed: false },
      { id: 'p8-l3', title: 'DeFi & Analyzing On-Chain Supply Metrics', completed: false },
    ],
    quiz: [
      {
        id: 'p8-q1',
        question: 'What economic concept primarily gives Bitcoin its "store of value" investment narrative?',
        options: [
          'High government sponsorship',
          'Smart contract capability',
          'Absolute mathematical scarcity (capped at 21 million supply)',
          'Low transaction fees'
        ],
        correctIndex: 2,
        explanation: 'Bitcoin has a hard supply cap of 21 million coins hardcoded into its protocol, creating digital scarcity similar to physical gold.'
      }
    ]
  },
  {
    id: 'p9',
    title: 'Options Fundamentals',
    description: 'Understand calls, puts, leverage, and the core Greeks (Delta, Theta, Vega).',
    difficulty: 'Expert',
    lessons: [
      { id: 'p9-l1', title: 'Demystifying Calls & Puts', completed: false },
      { id: 'p9-l2', title: 'The Options Contract: Strike, Expiration & Premium', completed: false },
      { id: 'p9-l3', title: 'The Core Greeks: Delta & Theta Decay', completed: false },
    ],
    quiz: [
      {
        id: 'p9-q1',
        question: 'Which Option Greek represents the rate of contract value decay over time?',
        options: [
          'Delta',
          'Gamma',
          'Theta',
          'Vega'
        ],
        correctIndex: 2,
        explanation: 'Theta measures the rate of decline in the value of an option contract as time passes, commonly referred to as "time decay".'
      }
    ]
  },
  {
    id: 'p10',
    title: 'Quantitative Investing',
    description: 'Analyze factor modeling, fundamental screening, and statistics-backed methodologies.',
    difficulty: 'Expert',
    lessons: [
      { id: 'p10-l1', title: 'Introduction to Quantitative Factors', completed: false },
      { id: 'p10-l2', title: 'Designing and Backtesting Quantitative Screens', completed: false },
      { id: 'p10-l3', title: 'Risk-Adjusted Ratios: Sharpe, Sortino, and Treynor', completed: false },
    ],
    quiz: [
      {
        id: 'p10-q1',
        question: 'What does the Sharpe Ratio measure?',
        options: [
          'The total absolute return of a portfolio in percentage terms.',
          'The ratio of win rate to loss rate on trades.',
          'The portfolio\'s excess return per unit of total standard deviation risk.',
          'The absolute speed of trade execution.'
        ],
        correctIndex: 2,
        explanation: 'The Sharpe ratio measures risk-adjusted performance by subtracting the risk-free rate from the portfolio return and dividing by its standard deviation (total volatility).'
      }
    ]
  },
  {
    id: 'p11',
    title: 'Algorithmic Trading Foundations',
    description: 'Explore rule-based execution, automated logic, order routing, and execution risks.',
    difficulty: 'Expert',
    lessons: [
      { id: 'p11-l1', title: 'Translating Strategy Rules to Code', completed: false },
      { id: 'p11-l2', title: 'The Architecture of an Automated Trade System', completed: false },
      { id: 'p11-l3', title: 'Execution Latency, Slippage, and API Guardrails', completed: false },
    ],
    quiz: [
      {
        id: 'p11-q1',
        question: 'In automated trading, what is "slippage"?',
        options: [
          'A system failure where the software stops running.',
          'The difference between the expected price of a trade and the actual price at which it is executed.',
          'An illegal option pricing mechanism.',
          'The percentage of trades lost due to network lag.'
        ],
        correctIndex: 1,
        explanation: 'Slippage occurs when market conditions change rapidly or liquidity is low, causing the trade to fill at a different price than originally requested.'
      }
    ]
  }
];

export default function AICoach() {
  // Navigation tab states
  const [activeTab, setActiveTab] = useState<'pathways' | 'teacher' | 'chart' | 'strategy' | 'risk' | 'lab' | 'chat'>('pathways');
  
  // Overall statistics (from positioning document)
  const [stats, setStats] = useState({
    lessonsCompleted: 4,
    conceptsMastered: 8,
    avgQuizAccuracy: 85,
    simulatedTradesCount: 15,
    disciplineScore: 92,
    consistencyDays: 6,
    confidenceGrowth: 'High'
  });

  // State for Pathways
  const [selectedPath, setSelectedPath] = useState<Path | null>(LEARNING_PATHS[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [completedPaths, setCompletedPaths] = useState<string[]>(['p1']);

  // State for Market Teacher
  const [teacherQuery, setTeacherQuery] = useState('');
  const [teacherResponse, setTeacherResponse] = useState<string | null>(null);
  const [isTeacherLoading, setIsTeacherLoading] = useState(false);
  const [structuredTeacher, setStructuredTeacher] = useState<{
    observation?: string;
    evidence?: string;
    alternativeViews?: string;
    risks?: string;
    confidence?: string;
    nextStep?: string;
  } | null>(null);

  // State for Chart Tutor
  const [chartIndicator, setChartIndicator] = useState<'candlesticks' | 'trendlines' | 'support_resistance' | 'volume' | 'ma' | 'rsi' | 'macd' | 'bollinger'>('candlesticks');
  const [chartTutorQuizAnswer, setChartTutorQuizAnswer] = useState<number | null>(null);
  const [chartTutorQuizResult, setChartTutorQuizResult] = useState<boolean | null>(null);

  // State for Strategy Coach
  const [selectedStrategy, setSelectedStrategy] = useState<string>('trend');
  const [suitabilityParams, setSuitabilityParams] = useState({
    capital: 5000,
    riskProfile: 'Balanced',
    hoursPerWeek: 10,
    timeHorizon: 'Medium'
  });
  const [strategyRec, setStrategyRec] = useState<string | null>(null);
  const [isStrategyRecLoading, setIsStrategyRecLoading] = useState(false);

  // State for Risk Mentor
  const [positionSizeParams, setPositionSizeParams] = useState({
    accountSize: 25000,
    riskPct: 1,
    entryPrice: 150,
    stopLoss: 142
  });
  const [emotionalState, setEmotionalState] = useState<number>(50); // 0 (Fear) to 100 (Greed)

  // State for Practice Lab (The Interactive Game)
  const [labGameState, setLabGameState] = useState<'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'results'>('intro');
  const [labGameBalance, setLabGameBalance] = useState<number>(10000);
  const [labGamePosition, setLabGamePosition] = useState<number>(0); // shares held
  const [labGameTrades, setLabGameTrades] = useState<{ step: number; action: string; price: number; shares: number }[]>([]);
  const [labGameStepIndex, setLabGameStepIndex] = useState<number>(0);

  // State for Lesson Generator
  const [lessonParams, setLessonParams] = useState({
    level: 'Beginner',
    goal: 'Long-term wealth accumulation',
    improvementArea: 'Risk Management',
    customTopic: ''
  });
  const [generatedSyllabus, setGeneratedSyllabus] = useState<string | null>(null);
  const [generatedLesson, setGeneratedLesson] = useState<string | null>(null);
  const [isLessonGenerating, setIsLessonGenerating] = useState(false);

  // State for Classic Mentor Chat
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: '1',
      role: 'ai',
      text: "Greetings, future independent decision-maker. I am Alpha, your AI Financial Mentor. My mission is to teach you how to think about the markets, evaluate risk, and maintain disciplined capital preservation strategies. I do not recommend specific trades. Ask me anything about market mechanics, indicators, risk management, or macroeconomics.",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Chat scroll helper
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Market Teacher Explain Why Prompt
  const runMarketTeacher = async (query: string) => {
    if (!query.trim()) return;
    setIsTeacherLoading(true);
    setTeacherResponse(null);
    setStructuredTeacher(null);

    const prompt = `Perform an elite, structured financial education analysis on this topic: "${query}".
    You must structure your response EXACTLY in the "Explain Why Framework" format, which strictly uses these 6 labels with markdown double asterisks:
    
    **OBSERVATION**
    What is happening? Describe in clear, educational, jargon-free language.
    
    **EVIDENCE**
    What facts or data support this? 
    
    **ALTERNATIVE VIEWS**
    What other potential interpretations or viewpoints exist?
    
    **RISKS**
    What could invalidate this analysis or change the outcome?
    
    **CONFIDENCE**
    How certain is this explanation, and why? Give a specific percentage or range and a qualitative assessment.
    
    **NEXT LEARNING STEP**
    What investing or trading concept should the student explore next to build on this?
    
    Adopt the persona of the highly respected AI Financial Mentor. Teach the user how to think about this event. Focus strictly on education, not investment recommendations.`;

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          systemInstruction: "You are the primary AI Financial Mentor of Alpha-Flow. You teach disciplined, risk-aware financial reasoning following the Explain Why Framework. You strictly do NOT promise profits or tell users what to buy."
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const text = data.text;
      setTeacherResponse(text);

      // Parse text into structures
      const parseSection = (label: string) => {
        const regex = new RegExp(`\\*\\*${label}\\*\\*([\\s\\S]*?)(?=\\*\\*[A-Z ]+\\*\\*|$)`, "i");
        const match = text.match(regex);
        return match ? match[1].trim() : undefined;
      };

      setStructuredTeacher({
        observation: parseSection("OBSERVATION"),
        evidence: parseSection("EVIDENCE"),
        alternativeViews: parseSection("ALTERNATIVE VIEWS"),
        risks: parseSection("RISKS"),
        confidence: parseSection("CONFIDENCE"),
        nextStep: parseSection("NEXT LEARNING STEP"),
      });

    } catch (e) {
      console.error(e);
      setTeacherResponse("The Mentor engine is currently digesting central bank data. Let's try again in a moment.");
    } finally {
      setIsTeacherLoading(false);
    }
  };

  // Lesson Generator trigger
  const runLessonGenerator = async () => {
    setIsLessonGenerating(true);
    setGeneratedSyllabus(null);
    setGeneratedLesson(null);

    const prompt = `As an elite AI Financial Mentor, create a custom, highly personalized financial education lesson plan based on the student's profile:
    - Target Experience Level: ${lessonParams.level}
    - Student's Primary Goal: ${lessonParams.goal}
    - Primary Area Seeking Improvement: ${lessonParams.improvementArea}
    ${lessonParams.customTopic ? `- Specially Requested Topic: ${lessonParams.customTopic}` : ''}
    
    Your response must have two distinct sections:
    
    1. **SYLLABUS**
    Create a structured, logical 4-week study plan with weekly lesson titles.
    
    2. **LESSON**
    Provide a deeply educational, high-quality, comprehensive mini-lesson (approximately 400 words) for "Week 1: Introduction to Capital Preservation" (or the most relevant starting lesson for their requested topic). Focus on the underlying market mechanics, explain the "why", and explicitly emphasize disciplined risk management. 
    
    Include a short 2-question interactive "Knowledge Check" quiz at the bottom of the lesson with answers and detailed explanations.`;

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          systemInstruction: "You are the premium Lesson Generator module inside Alpha-Flow. You design elegant, clear, custom curricula and deliver highly educational lessons focused on long-term discipline and conceptual mastery."
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const text = data.text;
      
      // Attempt a clean split between syllabus and lesson
      const syllabusRegex = /\*\*SYLLABUS\*\*([\s\\S]*?)(?=\*\*LESSON\*\*|$)/i;
      const lessonRegex = /\*\*LESSON\*\*([\s\\S]*)/i;

      const syllabusMatch = text.match(syllabusRegex);
      const lessonMatch = text.match(lessonRegex);

      if (syllabusMatch && lessonMatch) {
        setGeneratedSyllabus(syllabusMatch[1].trim());
        setGeneratedLesson(lessonMatch[1].trim());
      } else {
        // Fallback
        setGeneratedSyllabus("Your custom study plan is successfully designed.");
        setGeneratedLesson(text);
      }
      
      // Increment stats as a reward for curiosity
      setStats(prev => ({
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
        consistencyDays: prev.consistencyDays + 1
      }));

    } catch (e) {
      console.error(e);
      setGeneratedLesson("Mentor study channels are crowded. Please try generating your customized plan again.");
    } finally {
      setIsLessonGenerating(false);
    }
  };

  // Strategy Advisor Quiz trigger
  const runStrategyAdvisor = async () => {
    setIsStrategyRecLoading(true);
    setStrategyRec(null);

    const prompt = `As the Strategy Coach in Alpha-Flow, evaluate the following learner parameters for strategy fit:
    - Capital Available: $${suitabilityParams.capital}
    - Risk Profile: ${suitabilityParams.riskProfile}
    - Weekly Time Commitment: ${suitabilityParams.hoursPerWeek} hours
    - Long-term Time Horizon: ${suitabilityParams.timeHorizon}
    
    Analyze and contrast at least three strategies (e.g. Trend Following, Value Investing, Momentum, Mean Reversion). 
    Explain which strategy is MOST suitable for their specific profile and, crucially, list the core trade-offs and structural risks. 
    Do not give financial recommendations, but frame this purely as a structural conceptual suitability review. Be extremely disciplined, professional, and clear.`;

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setStrategyRec(data.text);
    } catch (e) {
      setStrategyRec("Error analyzing strategies. Standard asset allocation models suggest starting with broad, highly-liquid indexes in educational mode.");
    } finally {
      setIsStrategyRecLoading(false);
    }
  };

  // Mentor Chat trigger
  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    const systemInstruction = `You are Alpha, the elite AI Financial Mentor. 
    Your identity is centered entirely on financial education, developing independent, disciplined decision-makers. 
    You teach how to think, evaluate risk, map technical setups, and analyze macro mechanics. 
    You NEVER promise profits, guarantee trading success, or encourage gambling/get-rich-quick behaviors. 
    If a user asks what specific stock to buy, explain why as an educator you do not provide speculative alerts, and instead teach them how to evaluate that asset independently. 
    Keep answers structured, crisp, highly polished, and professional.`;

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: chatInput,
          systemInstruction
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: data.text,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: "Mentor link experiencing micro-sec slippage. Ask your question again and let's conquer the concepts together.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Risk Mentor Helpers
  const calcPositionSize = () => {
    const { accountSize, riskPct, entryPrice, stopLoss } = positionSizeParams;
    const maxLoss = accountSize * (riskPct / 100);
    const riskPerShare = entryPrice - stopLoss;
    if (riskPerShare <= 0) return { shares: 0, capitalAlloc: 0, lossAmount: 0, pctAlloc: 0 };
    
    const shares = Math.floor(maxLoss / riskPerShare);
    const capitalAlloc = shares * entryPrice;
    const pctAlloc = (capitalAlloc / accountSize) * 100;
    return {
      shares,
      capitalAlloc,
      lossAmount: maxLoss,
      pctAlloc
    };
  };

  const getEmotionalRule = (level: number) => {
    if (level > 75) {
      return {
        state: 'Euphoric / Greedy',
        rule: 'Excessive confidence triggers position sizing slips. Reduce sizes by 50% immediately. FOMO is a structural error.'
      };
    }
    if (level < 25) {
      return {
        state: 'Fearful / Hesitant',
        rule: 'Risk aversion is natural during volatility. Focus entirely on trade metrics, not account dollar values. Execute with mechanical precision.'
      };
    }
    return {
      state: 'Balanced & Objective',
      rule: 'State represents peak cognitive execution. Keep logging details in the trade journal and preserve the structural edge.'
    };
  };

  // Practice Lab Game Setup & Steps
  // The scenario is: TSLA momentum squeeze simulation
  const GAME_STEPS = [
    {
      price: 150,
      context: "TSLA is highly compressed in a multi-week Low Volatility Range. Standard support is holding at 145. A massive institutional sweep of options is detected overhead. What is your action?",
      nextText: "Proceed to next hour"
    },
    {
      price: 158,
      context: "Volume spikes 2.4x standard levels. The stock breaks past Resistance at 155, triggering immediate shorts squeezes. Volume confirms high momentum.",
      nextText: "Watch the market unfold"
    },
    {
      price: 182,
      context: "Stock has surged to 182 in a vertical trend. Retail FOMO is massive on social channels. The RSI is sitting at 84 (extremely overbought). Option sweeps continue but block sellers are unloading near 185.",
      nextText: "Continue tracking"
    },
    {
      price: 165,
      context: "A sudden profit-taking reversal slams price to 165. Traders who entered at 182 are trapped. Did you manage your stop-loss correctly or secure partial gains?",
      nextText: "Review session end"
    },
    {
      price: 172,
      context: "The session closes. The price stabilizes around the moving average. Let's see how your discipline rating measures up.",
      nextText: "Generate Mentor Report Card"
    }
  ];

  const handleGameAction = (action: 'BUY' | 'SELL' | 'HOLD') => {
    const currentPrice = GAME_STEPS[labGameStepIndex].price;
    let shares = 0;
    let newBalance = labGameBalance;
    let newPosition = labGamePosition;

    if (action === 'BUY') {
      // Invest 50% of buying power
      const alloc = Math.floor(labGameBalance / 2);
      shares = Math.floor(alloc / currentPrice);
      if (shares > 0) {
        newBalance -= (shares * currentPrice);
        newPosition += shares;
      }
    } else if (action === 'SELL') {
      if (labGamePosition > 0) {
        shares = labGamePosition;
        newBalance += (shares * currentPrice);
        newPosition = 0;
      }
    }

    setLabGameBalance(newBalance);
    setLabGamePosition(newPosition);
    setLabGameTrades(prev => [...prev, {
      step: labGameStepIndex + 1,
      action,
      price: currentPrice,
      shares: action === 'BUY' ? shares : (action === 'SELL' ? shares : 0)
    }]);

    if (labGameStepIndex < GAME_STEPS.length - 1) {
      setLabGameStepIndex(prev => prev + 1);
    } else {
      // Calculate final equity
      const finalPrice = GAME_STEPS[GAME_STEPS.length - 1].price;
      const finalEquity = newBalance + (newPosition * finalPrice);
      setLabGameBalance(finalEquity);
      setLabGamePosition(0);
      setLabGameState('results');

      // Update global stats
      const won = finalEquity > 10000;
      setStats(prev => ({
        ...prev,
        simulatedTradesCount: prev.simulatedTradesCount + 1,
        disciplineScore: Math.min(100, Math.max(50, prev.disciplineScore + (won ? 4 : -2)))
      }));
    }
  };

  const getGameScore = () => {
    const finalBalance = labGameBalance;
    const returnPct = ((finalBalance - 10000) / 10000) * 100;
    
    // Evaluate if they fell for the top trap (buying at 182)
    const boughtAtTop = labGameTrades.some(t => t.price === 182 && t.action === 'BUY');
    const soldAtPeak = labGameTrades.some(t => t.price === 182 && t.action === 'SELL');
    
    let score = 75;
    let feedback = "";

    if (boughtAtTop) {
      score -= 25;
      feedback += "Your report shows you bought assets near overbought resistance (FOMO error). Disciplined mentors enter on pullbacks, not on peak retail momentum. ";
    }
    if (soldAtPeak) {
      score += 20;
      feedback += "Superb execution of scaling into momentum and taking profits ahead of clear block resistances. ";
    }
    if (returnPct > 0) {
      score += 10;
      feedback += `Congratulations on growing your virtual equity to $${finalBalance.toLocaleString()}. Capital growth proves execution control. `;
    } else {
      score -= 10;
      feedback += `Capital was eroded down to $${finalBalance.toLocaleString()}. Every drawdown contains a priceless lesson in position sizing. `;
    }

    return {
      score: Math.min(100, Math.max(10, score)),
      feedback: feedback || "Consistent execution mapping was shown. Review each trade step to master the volatility cycle."
    };
  };

  return (
    <div className="p-8 h-screen flex flex-col gap-6 overflow-hidden bg-obsidian text-white font-sans">
      
      {/* Top Professional Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-gold" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Explainable AI Learning Hub</span>
          </div>
          <h2 className="text-3xl font-display font-black tracking-tight flex items-center gap-2">
            AlphaFlow <span className="text-gold font-normal text-xl border-l border-white/10 pl-3">AI Mentor</span>
          </h2>
          <p className="text-white/50 text-xs mt-1">
            "Alpha-Flow doesn't tell you what to think about the market. It teaches you how to think about the market."
          </p>
        </div>

        {/* Global Learning Metrics */}
        <div className="flex gap-4 self-stretch md:self-auto overflow-x-auto pb-2 md:pb-0">
          <div className="glass-panel py-2 px-4 border-white/5 bg-white/[0.01]">
            <div className="text-[8px] uppercase tracking-wider text-white/40">Syllabus Progress</div>
            <div className="text-xs font-bold text-gold">{stats.lessonsCompleted} <span className="text-white/30">Lessons</span></div>
          </div>
          <div className="glass-panel py-2 px-4 border-white/5 bg-white/[0.01]">
            <div className="text-[8px] uppercase tracking-wider text-white/40">Quiz Accuracy</div>
            <div className="text-xs font-bold text-emerald-400">{stats.avgQuizAccuracy}%</div>
          </div>
          <div className="glass-panel py-2 px-4 border-white/5 bg-white/[0.01]">
            <div className="text-[8px] uppercase tracking-wider text-white/40">Discipline Rating</div>
            <div className="text-xs font-bold text-blue-400">{stats.disciplineScore}/100</div>
          </div>
          <div className="glass-panel py-2 px-4 border-white/5 bg-white/[0.01]">
            <div className="text-[8px] uppercase tracking-wider text-white/40">Simulated Trades</div>
            <div className="text-xs font-bold text-white/80">{stats.simulatedTradesCount} sessions</div>
          </div>
        </div>
      </header>

      {/* Main Learning Hub Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 min-h-0">
        
        {/* Left Side: Modular Navigation Menu */}
        <div className="lg:col-span-1 flex flex-col gap-2 overflow-y-auto pr-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 px-2">Mentor Modules</h3>
          {[
            { id: 'pathways', label: '1. Learning Paths', icon: Compass, desc: '11 Core curricula' },
            { id: 'teacher', label: '2. Market Teacher', icon: Brain, desc: 'Current news analyzer' },
            { id: 'chart', label: '3. Chart Tutor', icon: LineChart, desc: 'Visual indicator trainer' },
            { id: 'strategy', label: '4. Strategy Coach', icon: Target, desc: 'Approaches & suitability' },
            { id: 'risk', label: '5. Risk Mentor', icon: ShieldAlert, desc: 'Habits & position sizers' },
            { id: 'lab', label: '6. Practice Lab', icon: Play, desc: 'Historical replay games' },
            { id: 'chat', label: '7. AI Mentor Chat', icon: Bot, desc: 'Disciplined dialog engine' },
          ].map(module => (
            <button
              key={module.id}
              onClick={() => setActiveTab(module.id as any)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all relative overflow-hidden group",
                activeTab === module.id 
                  ? "bg-gold/10 border-gold/40 text-white shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                  : "bg-transparent border-white/5 hover:border-white/15 hover:bg-white/[0.01] text-white/60 hover:text-white"
              )}
            >
              <div className="flex items-start gap-3 relative z-10">
                <module.icon className={cn(
                  "w-4 h-4 mt-0.5",
                  activeTab === module.id ? "text-gold" : "text-white/40 group-hover:text-white/70"
                )} />
                <div>
                  <h4 className={cn("font-bold text-xs", activeTab === module.id ? "text-white" : "text-white/80")}>
                    {module.label}
                  </h4>
                  <p className="text-[9px] text-white/40 group-hover:text-white/50 mt-0.5 leading-none">
                    {module.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Prompt Suggestion Card */}
          <div className="glass-panel p-4 mt-auto border-gold/10 bg-gold/[0.01]">
            <div className="flex items-center gap-1.5 text-gold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Investor Core Promise</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed italic">
              "We develop independent, critical decision-makers instead of passive followers."
            </p>
          </div>
        </div>

        {/* Right Side: Active Educational Interface */}
        <div className="lg:col-span-4 glass-panel flex flex-col min-h-0 overflow-hidden relative border-white/5 bg-panel-surface/25">
          <AnimatePresence mode="wait">
            
            {/* 1. LEARNING PATHS PANEL */}
            {activeTab === 'pathways' && (
              <motion.div
                key="pathways"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col min-h-0 overflow-hidden p-6"
              >
                <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
                  
                  {/* Paths Grid */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Active Curricula</h3>
                      <span className="text-[10px] text-white/30 uppercase font-mono">Select a roadmap</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {LEARNING_PATHS.map((path) => {
                        const isSelected = selectedPath?.id === path.id;
                        const isCompleted = completedPaths.includes(path.id);
                        return (
                          <div
                            key={path.id}
                            onClick={() => setSelectedPath(path)}
                            className={cn(
                              "p-4 rounded-xl border cursor-pointer transition-all text-left",
                              isSelected 
                                ? "bg-white/5 border-gold/40 shadow-lg" 
                                : "bg-white/[0.01] border-white/5 hover:border-white/10"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={cn(
                                "text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                path.difficulty === 'Beginner' ? "bg-emerald-500/10 text-emerald-400" :
                                path.difficulty === 'Intermediate' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                              )}>
                                {path.difficulty}
                              </span>
                              {isCompleted && (
                                <span className="text-[8px] text-gold font-bold flex items-center gap-0.5 uppercase">
                                  <Award className="w-2.5 h-2.5" /> Mastered
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1">{path.title}</h4>
                            <p className="text-[10px] text-white/40 leading-tight mb-3 line-clamp-2">{path.description}</p>
                            
                            {/* Lessons Progress */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gold transition-all duration-300"
                                  style={{ width: `${(path.lessons.filter(l => l.completed).length / path.lessons.length) * 100}%` }}
                                />
                              </div>
                              <span className="text-[8px] text-white/30 font-mono">
                                {path.lessons.filter(l => l.completed).length}/{path.lessons.length}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Path Details & Quiz */}
                  {selectedPath && (
                    <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6 flex flex-col min-h-0">
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5" /> Path syllabus
                        </h3>
                        <div>
                          <h4 className="text-sm font-bold text-white">{selectedPath.title}</h4>
                          <p className="text-[10px] text-white/40 leading-relaxed mt-1">{selectedPath.description}</p>
                        </div>

                        {/* List of Lessons */}
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block">Syllabus Units</span>
                          {selectedPath.lessons.map(l => (
                            <div key={l.id} className="p-2 rounded bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                              <span className="text-white/80">{l.title}</span>
                              {l.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                              ) : (
                                <span className="text-[8px] text-white/30 uppercase font-mono">Locked</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Concept Quiz Component */}
                        <div className="border-t border-white/5 pt-4">
                          <span className="text-[9px] uppercase tracking-wider text-gold font-black block mb-3">Path Mastery Quiz</span>
                          {selectedPath.quiz.map((q) => {
                            const isAnswered = quizSubmitted[q.id];
                            const selectedOptionIndex = quizAnswers[q.id];
                            const isCorrect = selectedOptionIndex === q.correctIndex;

                            return (
                              <div key={q.id} className="space-y-3">
                                <p className="text-xs text-white/80 leading-relaxed font-medium">{q.question}</p>
                                <div className="space-y-1.5">
                                  {q.options.map((opt, oIdx) => (
                                    <button
                                      key={oIdx}
                                      disabled={isAnswered}
                                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                                      className={cn(
                                        "w-full text-left p-2.5 rounded text-[10px] transition-all border",
                                        quizAnswers[q.id] === oIdx 
                                          ? "bg-gold/20 border-gold/50 text-white" 
                                          : "bg-white/[0.01] border-white/5 hover:border-white/10 text-white/60"
                                      )}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>

                                {!isAnswered ? (
                                  <button
                                    onClick={() => {
                                      if (selectedOptionIndex !== undefined) {
                                        setQuizSubmitted(prev => ({ ...prev, [q.id]: true }));
                                        if (selectedOptionIndex === q.correctIndex) {
                                          setCompletedPaths(prev => [...prev, selectedPath.id]);
                                          setStats(prev => ({
                                            ...prev,
                                            conceptsMastered: prev.conceptsMastered + 1,
                                            avgQuizAccuracy: Math.round((prev.avgQuizAccuracy + 100) / 2)
                                          }));
                                        } else {
                                          setStats(prev => ({
                                            ...prev,
                                            avgQuizAccuracy: Math.round((prev.avgQuizAccuracy + 0) / 2)
                                          }));
                                        }
                                      }
                                    }}
                                    disabled={selectedOptionIndex === undefined}
                                    className="w-full btn-primary text-xs py-2 disabled:opacity-50"
                                  >
                                    Submit Answer
                                  </button>
                                ) : (
                                  <div className={cn(
                                    "p-3 rounded-lg border leading-relaxed text-[10px]",
                                    isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border-red-500/20 text-red-300"
                                  )}>
                                    <div className="flex items-center gap-1.5 mb-1.5 font-bold uppercase tracking-wider">
                                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                      {isCorrect ? 'Correct Option' : 'Incorrect Option'}
                                    </div>
                                    <p>{q.explanation}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* BOTTOM: CUSTOM STUDY PLAN GENERATOR PORTAL */}
                <div className="border-t border-white/5 pt-4 mt-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-gold/5 to-white/[0.01] border border-gold/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gold">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">PERSONALIZED LESSON GENERATOR</span>
                      </div>
                      <p className="text-xs font-bold text-white">Generate Custom Syllabuses & Interactive Lessons</p>
                      <p className="text-[10px] text-white/40 leading-none">Generates real-time, custom tailored investment lessons aligned with your current competence.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <select 
                        value={lessonParams.level}
                        onChange={(e) => setLessonParams(prev => ({ ...prev, level: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[10px] focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Self-Directed">Self-Directed</option>
                        <option value="Active Trader">Active Trader</option>
                        <option value="Student">Finance Student</option>
                        <option value="Professional">Business Professional</option>
                      </select>

                      <select 
                        value={lessonParams.improvementArea}
                        onChange={(e) => setLessonParams(prev => ({ ...prev, improvementArea: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[10px] focus:outline-none"
                      >
                        <option value="Risk Management">Risk Management</option>
                        <option value="Technical Charts">Chart Analysis</option>
                        <option value="Macro Economics">Macro Mechanics</option>
                        <option value="Options Logic">Options Math</option>
                      </select>

                      <input 
                        type="text"
                        placeholder="E.g., Liquidity Traps..."
                        value={lessonParams.customTopic}
                        onChange={(e) => setLessonParams(prev => ({ ...prev, customTopic: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[10px] focus:outline-none placeholder:text-white/20 w-36"
                      />

                      <button
                        onClick={runLessonGenerator}
                        disabled={isLessonGenerating}
                        className="bg-gold text-black px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-all"
                      >
                        {isLessonGenerating ? 'Synthesizing...' : 'Build Custom Lesson'}
                      </button>
                    </div>
                  </div>

                  {/* Syllabus / Generated Lesson Overlay Output */}
                  {generatedLesson && (
                    <div className="mt-4 p-4 rounded-xl border border-gold/20 bg-gold/[0.02] space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gold">Custom Study Lesson & Weekly Plan</h4>
                        <button 
                          onClick={() => setGeneratedLesson(null)}
                          className="text-[10px] text-white/30 hover:text-white"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {generatedSyllabus && (
                          <div className="md:col-span-1 border-r border-white/5 pr-6 space-y-3">
                            <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block">Target 4-Week Plan</span>
                            <div className="text-[10px] text-gold/90 whitespace-pre-wrap leading-relaxed">
                              {generatedSyllabus}
                            </div>
                          </div>
                        )}
                        <div className={cn(generatedSyllabus ? "md:col-span-2" : "md:col-span-3", "space-y-4 max-h-80 overflow-y-auto pr-2")}>
                          <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block">Current Active Lesson Content</span>
                          <div className="text-xs text-white/85 leading-relaxed whitespace-pre-wrap">
                            {generatedLesson}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* 2. MARKET TEACHER PANEL */}
            {activeTab === 'teacher' && (
              <motion.div
                key="teacher"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col min-h-0 p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-display font-black tracking-tight flex items-center gap-2">
                    <Brain className="w-5 h-5 text-gold" /> Market Teacher
                  </h3>
                  <p className="text-white/40 text-xs mt-1">
                    Enter any current macroeconomic or technical event. Our "Explain Why Framework" dissects observations, factual evidence, alternative view, risks, and confidence scores.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block">Quick Educational Topics</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Why did the stock market decline heavily today?",
                      "Why are federal interest rates highly important to asset valuations?",
                      "What happens to cash-holdings and stocks when inflation spikes?",
                      "How do Treasury Yields affect modern corporate growth valuations?"
                    ].map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setTeacherQuery(promptText);
                          runMarketTeacher(promptText);
                        }}
                        className="bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/[0.02] rounded-lg p-2.5 text-left text-[10px] text-white/70 hover:text-white transition-all w-full md:w-[48%]"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search / Analyze Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={teacherQuery}
                    onChange={(e) => setTeacherQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && runMarketTeacher(teacherQuery)}
                    placeholder="Enter custom topic: (e.g. Why are tech valuations highly volatile, What is quantitative tightening?)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-4 pr-32 text-xs focus:outline-none focus:border-gold/50 transition-all"
                  />
                  <button
                    onClick={() => runMarketTeacher(teacherQuery)}
                    disabled={isTeacherLoading || !teacherQuery.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {isTeacherLoading ? 'Explaining...' : 'Analyze Concept'}
                  </button>
                </div>

                {/* Explain Why Framework Structured Output */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                  {isTeacherLoading ? (
                    <div className="space-y-4 animate-pulse p-4">
                      <div className="h-4 bg-white/10 rounded w-1/4" />
                      <div className="h-2 bg-white/10 rounded w-full" />
                      <div className="h-2 bg-white/10 rounded w-5/6" />
                      <div className="h-2 bg-white/10 rounded w-4/5" />
                    </div>
                  ) : structuredTeacher ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                      
                      {/* Observation */}
                      <div className="glass-panel p-4 border-gold/10 bg-gold/[0.01]">
                        <div className="text-[8px] uppercase tracking-widest text-gold font-black mb-1 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> Observation
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{structuredTeacher.observation}</p>
                      </div>

                      {/* Evidence */}
                      <div className="glass-panel p-4 border-white/5 bg-white/[0.01]">
                        <div className="text-[8px] uppercase tracking-widest text-white/40 font-black mb-1 flex items-center gap-1">
                          <Info className="w-3 h-3" /> Supporting Evidence
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{structuredTeacher.evidence}</p>
                      </div>

                      {/* Alternative Views */}
                      <div className="glass-panel p-4 border-white/5 bg-white/[0.01]">
                        <div className="text-[8px] uppercase tracking-widest text-white/40 font-black mb-1 flex items-center gap-1">
                          <Compass className="w-3 h-3" /> Alternative Interpretations
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{structuredTeacher.alternativeViews}</p>
                      </div>

                      {/* Risks */}
                      <div className="glass-panel p-4 border-red-500/10 bg-red-500/[0.01]">
                        <div className="text-[8px] uppercase tracking-widest text-red-400 font-black mb-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Key Risks & Invalidation
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{structuredTeacher.risks}</p>
                      </div>

                      {/* Confidence Score */}
                      <div className="glass-panel p-4 border-white/5 bg-white/[0.01] md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
                          <div className="text-[8px] uppercase tracking-widest text-gold font-black mb-1 flex items-center gap-1">
                            <Gauge className="w-3 h-3" /> Confidence Metric
                          </div>
                          <div className="text-3xl font-display font-black text-gold mt-1">High</div>
                          <p className="text-[10px] text-white/30 leading-none mt-1">Based on historic consensus models</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{structuredTeacher.confidence}</p>
                        </div>
                      </div>

                      {/* Next Learning Step */}
                      {structuredTeacher.nextStep && (
                        <div className="p-4 rounded-xl border border-gold/20 bg-gold/5 md:col-span-2 flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gold block mb-1">Recommended Next Learning Concept</span>
                            <p className="text-xs text-white/90 leading-relaxed">{structuredTeacher.nextStep}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/5 rounded-xl text-white/20">
                      <Bot className="w-8 h-8 opacity-40 mb-2" />
                      <p className="text-xs font-mono uppercase tracking-widest">Select a concept prompt above to trigger explanation flow</p>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* 3. CHART TUTOR PANEL */}
            {activeTab === 'chart' && (
              <motion.div
                key="chart"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col min-h-0 p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-display font-black tracking-tight flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-gold" /> Chart Tutor
                  </h3>
                  <p className="text-white/40 text-xs mt-1">
                    Master professional charting indicators in real time. Choose an overlay, study the core visual reasoning, and take our validation check.
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
                  
                  {/* Left Column: Selector and Explainer */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: 'candlesticks', label: 'Candlesticks' },
                        { id: 'trendlines', label: 'Trend Lines' },
                        { id: 'support_resistance', label: 'Support & Resistance' },
                        { id: 'volume', label: 'Volume Profile' },
                        { id: 'ma', label: 'Moving Averages' },
                        { id: 'rsi', label: 'RSI Momentum' },
                        { id: 'macd', label: 'MACD Divergence' },
                        { id: 'bollinger', label: 'Bollinger Bands' },
                      ].map((ind) => (
                        <button
                          key={ind.id}
                          onClick={() => {
                            setChartIndicator(ind.id as any);
                            setChartTutorQuizAnswer(null);
                            setChartTutorQuizResult(null);
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded text-[9px] font-bold border transition-all",
                            chartIndicator === ind.id 
                              ? "bg-gold text-black border-gold" 
                              : "bg-white/5 text-white/50 border-white/5 hover:border-white/10"
                          )}
                        >
                          {ind.label}
                        </button>
                      ))}
                    </div>

                    {/* Explainer Panel */}
                    <div className="glass-panel p-4 border-white/5 bg-white/[0.01] space-y-3">
                      {chartIndicator === 'candlesticks' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">How to Read Candlesticks</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            Each candlestick represents the high, low, opening, and closing price for a specific timeframe. Green bodies indicate the price closed higher than it opened (buyers won), while Red bodies indicate a lower close (sellers won). Wicks show the high-and-low extremes of volatility.
                          </p>
                        </>
                      )}
                      {chartIndicator === 'trendlines' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">The Logic of Trend Lines</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            Trendlines are diagonal boundaries connecting price peaks or troughs. They visually highlight market trend direction. A trendline is historically validated when it has at least three clean touches, representing areas where buyers or sellers consistently enter.
                          </p>
                        </>
                      )}
                      {chartIndicator === 'support_resistance' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Support & Resistance Zones</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            These are horizontal zones representing price levels where liquidity blocks are heavily stacked. **Support** acts as a floor where buyers aggressively defend. **Resistance** represents a ceiling where sellers or short-sellers prevent prices from pushing higher.
                          </p>
                        </>
                      )}
                      {chartIndicator === 'volume' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Deciphering Volume Profiles</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            Volume represents the raw number of shares or contracts traded. High volume breakout zones validate trends, whereas low volume rallies imply a lack of institutional conviction and are prone to quick reversals. Always pair price with volume.
                          </p>
                        </>
                      )}
                      {chartIndicator === 'ma' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Leveraging Moving Averages</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            Moving Averages smooth out price noise to define trend trajectory. The Exponential Moving Average (EMA) places higher weight on recent data, reacting faster. When price lies above the EMA, trends are bullish. When price crosses below, momentum is decelerating.
                          </p>
                        </>
                      )}
                      {chartIndicator === 'rsi' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Understanding RSI Momentum</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            The Relative Strength Index (RSI) is a bounded oscillator scaling from 0 to 100. Readings above 70 indicate that an asset is overbought (potentially overextended), whereas readings below 30 signal oversold conditions where buying pressure may emerge.
                          </p>
                        </>
                      )}
                      {chartIndicator === 'macd' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">MACD Divergence Mechanics</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            The Moving Average Convergence Divergence tracks the relationship between two moving averages. When the MACD line crosses above the Signal line, a bullish crossover occurs. Divergence occurs when prices make new highs but MACD peaks fail to do so, signaling weakening momentum.
                          </p>
                        </>
                      )}
                      {chartIndicator === 'bollinger' && (
                        <>
                          <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Mapping Volatility with Bollinger Bands</h4>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            Composed of a central moving average bounded by upper and lower standard deviation bands. When volatility increases, bands expand. When markets compress, the bands contract. Prices are mathematically constrained within the outer bands 95% of the time.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Miniature Indicator Validation Quiz */}
                    <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                      <span className="text-[9px] uppercase tracking-wider text-gold font-bold block mb-2">Indicator Quiz Check</span>
                      {chartIndicator === 'rsi' ? (
                        <div className="space-y-2">
                          <p className="text-[10px] text-white/80 leading-relaxed">If the RSI is reading 82, what is the core structural interpretation?</p>
                          <div className="space-y-1">
                            <button 
                              onClick={() => { setChartTutorQuizAnswer(1); setChartTutorQuizResult(true); }}
                              className="w-full text-left p-1.5 rounded text-[9px] bg-white/5 hover:bg-white/10"
                            >
                              Asset is overextended/overbought; caution on new entries.
                            </button>
                            <button 
                              onClick={() => { setChartTutorQuizAnswer(2); setChartTutorQuizResult(false); }}
                              className="w-full text-left p-1.5 rounded text-[9px] bg-white/5 hover:bg-white/10"
                            >
                              Asset is incredibly cheap; buy maximum allocation immediately.
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[10px] text-white/80 leading-relaxed">Why is volume validation critical during price breakthroughs?</p>
                          <div className="space-y-1">
                            <button 
                              onClick={() => { setChartTutorQuizAnswer(1); setChartTutorQuizResult(true); }}
                              className="w-full text-left p-1.5 rounded text-[9px] bg-white/5 hover:bg-white/10"
                            >
                              It confirms institutional defense or aggressive participation.
                            </button>
                            <button 
                              onClick={() => { setChartTutorQuizAnswer(2); setChartTutorQuizResult(false); }}
                              className="w-full text-left p-1.5 rounded text-[9px] bg-white/5 hover:bg-white/10"
                            >
                              It guarantees immediate trading profits on options.
                            </button>
                          </div>
                        </div>
                      )}

                      {chartTutorQuizResult !== null && (
                        <div className={cn(
                          "mt-2 p-2 rounded text-[9px] leading-relaxed border",
                          chartTutorQuizResult ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border-red-500/20 text-red-300"
                        )}>
                          {chartTutorQuizResult ? "Correct. Disciplined investors wait for price validation before committing capital." : "Incorrect. Remember, the market is a system of probabilities; indicators never guarantee a specific move."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Dynamic SVG Chart Render */}
                  <div className="lg:col-span-2 flex flex-col justify-between h-full bg-black/40 border border-white/5 rounded-2xl p-4 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-[10px] font-mono text-gold font-bold">EDUCATIONAL MARKET SIMULATOR</span>
                        <h4 className="text-xs font-bold text-white leading-none mt-1">TSLA Daily Chart Markup</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-white/40 block">Last Quote</span>
                        <span className="text-xs font-mono font-black text-emerald-400">$158.00</span>
                      </div>
                    </div>

                    {/* SVG Graphic Canvas */}
                    <div className="flex-1 w-full bg-white/[0.01] rounded-xl border border-white/5 relative p-2 min-h-[220px]">
                      <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible select-none">
                        
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="160" x2="400" y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                        {/* Bollinger Bands Shading overlay */}
                        {chartIndicator === 'bollinger' && (
                          <path d="M 0 60 Q 100 20, 200 80 T 400 120 L 400 180 Q 300 140, 200 140 T 0 120 Z" fill="rgba(212, 175, 55, 0.04)" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1" />
                        )}

                        {/* Candlesticks (Rendered via crisp SVG elements) */}
                        {/* Candlestick 1: Bullish */}
                        <line x1="50" y1="120" x2="50" y2="170" stroke="#2ECC71" strokeWidth="1" />
                        <rect x="44" y="130" width="12" height="30" fill="#2ECC71" rx="1" />

                        {/* Candlestick 2: Bearish */}
                        <line x1="100" y1="110" x2="100" y2="160" stroke="#E74C3C" strokeWidth="1" />
                        <rect x="94" y="120" width="12" height="25" fill="#E74C3C" rx="1" />

                        {/* Candlestick 3: Bullish Break */}
                        <line x1="150" y1="90" x2="150" y2="140" stroke="#2ECC71" strokeWidth="1" />
                        <rect x="144" y="100" width="12" height="35" fill="#2ECC71" rx="1" />

                        {/* Candlestick 4: Bullish Breakout */}
                        <line x1="200" y1="50" x2="200" y2="120" stroke="#2ECC71" strokeWidth="1" />
                        <rect x="194" y="60" width="12" height="45" fill="#2ECC71" rx="1" />

                        {/* Candlestick 5: Bearish Pullback */}
                        <line x1="250" y1="60" x2="250" y2="110" stroke="#E74C3C" strokeWidth="1" />
                        <rect x="244" y="70" width="12" height="20" fill="#E74C3C" rx="1" />

                        {/* Candlestick 6: Bearish Reversal Hammer */}
                        <line x1="300" y1="70" x2="300" y2="150" stroke="#E74C3C" strokeWidth="1" />
                        <rect x="294" y="80" width="12" height="20" fill="#E74C3C" rx="1" />

                        {/* Trendlines overlay */}
                        {chartIndicator === 'trendlines' && (
                          <line x1="20" y1="180" x2="380" y2="40" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" />
                        )}

                        {/* Support & Resistance overlay */}
                        {chartIndicator === 'support_resistance' && (
                          <>
                            {/* Resistance */}
                            <line x1="0" y1="60" x2="400" y2="60" stroke="#E74C3C" strokeWidth="1.5" strokeDasharray="3 3" />
                            <text x="10" y="55" fill="#E74C3C" fontSize="8" fontWeight="bold" fontFamily="monospace">OVERHEAD RESISTANCE ZONE ($185.00)</text>

                            {/* Support */}
                            <line x1="0" y1="150" x2="400" y2="150" stroke="#2ECC71" strokeWidth="1.5" strokeDasharray="3 3" />
                            <text x="10" y="145" fill="#2ECC71" fontSize="8" fontWeight="bold" fontFamily="monospace">DEMAND SUPPORT ZONE ($145.00)</text>
                          </>
                        )}

                        {/* Moving Average EMA overlay */}
                        {chartIndicator === 'ma' && (
                          <path d="M 0 160 Q 100 130, 200 95 T 400 70" fill="none" stroke="#00E5FF" strokeWidth="2" />
                        )}

                        {/* Dynamic RSI Pane below */}
                        {chartIndicator === 'rsi' && (
                          <g transform="translate(0, 160)">
                            <rect x="0" y="0" width="400" height="40" fill="rgba(255,255,255,0.02)" />
                            {/* Bounded lines */}
                            <line x1="0" y1="12" x2="400" y2="12" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2 2" />
                            <line x1="0" y1="28" x2="400" y2="28" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2 2" />
                            {/* RSI Line */}
                            <path d="M 0 35 L 50 30 L 100 20 L 150 15 L 200 8 L 250 18 L 300 12 L 350 22 L 400 10" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                            <text x="10" y="8" fill="#D4AF37" fontSize="6" fontFamily="monospace">RSI (14) OVERBOUGHT BOUND (70)</text>
                          </g>
                        )}

                        {/* Dynamic MACD Pane below */}
                        {chartIndicator === 'macd' && (
                          <g transform="translate(0, 160)">
                            <rect x="0" y="0" width="400" height="40" fill="rgba(255,255,255,0.02)" />
                            {/* Histogram blocks */}
                            <rect x="140" y="10" width="4" height="10" fill="#2ECC71" />
                            <rect x="150" y="5" width="4" height="15" fill="#2ECC71" />
                            <rect x="160" y="12" width="4" height="8" fill="#2ECC71" />
                            {/* Signal Lines */}
                            <path d="M 0 25 Q 100 15, 200 10 T 400 20" fill="none" stroke="#00E5FF" strokeWidth="1" />
                            <path d="M 0 28 Q 100 18, 200 8 T 400 22" fill="none" stroke="#D4AF37" strokeWidth="1" />
                          </g>
                        )}

                        {/* Volume Profile Bars overlay */}
                        {chartIndicator === 'volume' && (
                          <g opacity="0.3">
                            <rect x="46" y="160" width="8" height="40" fill="#2ECC71" />
                            <rect x="96" y="150" width="8" height="50" fill="#E74C3C" />
                            <rect x="146" y="130" width="8" height="70" fill="#2ECC71" />
                            <rect x="196" y="100" width="8" height="100" fill="#2ECC71" />
                            <rect x="246" y="150" width="8" height="50" fill="#E74C3C" />
                            <rect x="296" y="140" width="8" height="60" fill="#E74C3C" />
                          </g>
                        )}
                      </svg>

                      {/* Display floating metadata about the indicator */}
                      <div className="absolute bottom-2 left-2 p-1.5 rounded bg-black/60 border border-white/10 text-[8px] font-mono leading-none">
                        Active Layer: <span className="text-gold uppercase font-bold">{chartIndicator.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 4. STRATEGY COACH PANEL */}
            {activeTab === 'strategy' && (
              <motion.div
                key="strategy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col min-h-0 p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-display font-black tracking-tight flex items-center gap-2">
                    <Target className="w-5 h-5 text-gold" /> Strategy Coach
                  </h3>
                  <p className="text-white/40 text-xs mt-1">
                    Different market environments favor different approaches. Alpha-Flow never advises a single path, but helps you understand when each is appropriate and their inherent trade-offs.
                  </p>
                </div>

                {/* Strategy Catalog Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto">
                  
                  {/* Strategy Catalog Selector */}
                  <div className="lg:col-span-1 space-y-2 pr-1 overflow-y-auto">
                    <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">Strategy Catalog</span>
                    {[
                      { id: 'trend', name: 'Trend Following', speed: 'Medium Term', type: 'Bull/Bear Cycles' },
                      { id: 'momentum', name: 'Momentum Investing', speed: 'Short Term', type: 'Breakouts/Volume' },
                      { id: 'mean_revert', name: 'Mean Reversion', speed: 'Intraday/Short', type: 'Range Trading' },
                      { id: 'value', name: 'Value Investing', speed: 'Long Term', type: 'Fundamental Moats' },
                      { id: 'growth', name: 'Growth Investing', speed: 'Long Term', type: 'High Multiple Risk' },
                      { id: 'swing', name: 'Swing Trading', speed: 'Days to Weeks', type: 'Technical Swings' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStrategy(s.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center",
                          selectedStrategy === s.id 
                            ? "bg-gold/10 border-gold/40 text-white" 
                            : "bg-white/[0.01] border-white/5 hover:border-white/10"
                        )}
                      >
                        <div>
                          <h4 className="text-xs font-bold">{s.name}</h4>
                          <span className="text-[8px] text-white/30 uppercase font-mono">{s.type}</span>
                        </div>
                        <span className="text-[8px] text-gold font-bold uppercase">{s.speed}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Strategy Deep-dive */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-4 border-white/5 bg-white/[0.01]">
                      {selectedStrategy === 'trend' && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gold">Trend Following Methodology</h4>
                          <p className="text-xs text-white/70 leading-relaxed">
                            Historically built on the principle that trends persist. Operators wait for a breakout high and ride price vectors upward, placing defensive stop-losses trailing behind.
                          </p>
                          <div className="grid grid-cols-2 gap-4 pt-2 text-[10px]">
                            <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                              <span className="font-bold text-emerald-400 block mb-1">Optimal Conditions</span>
                              Smooth structural macro expansion, low noise trending indices.
                            </div>
                            <div className="p-2.5 rounded bg-red-500/5 border border-red-500/10">
                              <span className="font-bold text-red-400 block mb-1">Core Risk / Weakness</span>
                              Sideways choppy ranges trigger multiple whipsaw losses.
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedStrategy === 'mean_revert' && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gold">Mean Reversion Strategy</h4>
                          <p className="text-xs text-white/70 leading-relaxed">
                            Operates under the mathematical assumption that price extremes are unsustainable and will eventually snap back to historical averages. Often uses Bollinger Bands or RSI.
                          </p>
                          <div className="grid grid-cols-2 gap-4 pt-2 text-[10px]">
                            <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                              <span className="font-bold text-emerald-400 block mb-1">Optimal Conditions</span>
                              Defined sideways trading ranges, low-volatility sessions.
                            </div>
                            <div className="p-2.5 rounded bg-red-500/5 border border-red-500/10">
                              <span className="font-bold text-red-400 block mb-1">Core Risk / Weakness</span>
                              Vertical "catch-a-falling-knife" trend expansions bypass support zones completely.
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedStrategy === 'value' && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gold">Value Investing Principles</h4>
                          <p className="text-xs text-white/70 leading-relaxed">
                            Made famous by Benjamin Graham and Warren Buffett. Focuses entirely on intrinsic fundamental valuation, seeking assets trading at significant discounts to real liquidation value or long-term cash flow capabilities.
                          </p>
                          <div className="grid grid-cols-2 gap-4 pt-2 text-[10px]">
                            <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                              <span className="font-bold text-emerald-400 block mb-1">Optimal Conditions</span>
                              Post-panic recessions, macro fear cycles, deep market drawdowns.
                            </div>
                            <div className="p-2.5 rounded bg-red-500/5 border border-red-500/10">
                              <span className="font-bold text-red-400 block mb-1">Core Risk / Weakness</span>
                              "Value traps" where structurally declining business metrics keep asset price permanently low.
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Placeholder fallbacks for remaining categories */}
                      {!['trend', 'mean_revert', 'value'].includes(selectedStrategy) && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gold">Advanced Technical Modeling</h4>
                          <p className="text-xs text-white/70 leading-relaxed">
                            This strategy leverages short-term behavioral imbalances, institutional option positioning, or macro growth velocity to target quick capital turns.
                          </p>
                          <div className="grid grid-cols-2 gap-4 pt-2 text-[10px]">
                            <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                              <span className="font-bold text-emerald-400 block mb-1">Optimal Conditions</span>
                              High liquidity sweeps, news-driven trend surges.
                            </div>
                            <div className="p-2.5 rounded bg-red-500/5 border border-red-500/10">
                              <span className="font-bold text-red-400 block mb-1">Core Risk / Weakness</span>
                              Excessive leverage parameters lead to immediate capital erosion during slippage events.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* INTERACTIVE SUITABILITY CALCULATOR (GEMINI DRIVEN) */}
                    <div className="p-4 rounded-xl border border-gold/15 bg-gold/[0.01] space-y-4">
                      <div className="flex items-center gap-1 text-gold">
                        <Sliders className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Strategy Suitability Evaluator</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[8px] uppercase tracking-wider text-white/40 font-bold block mb-1">Simulated Capital ($)</label>
                          <input 
                            type="number"
                            value={suitabilityParams.capital}
                            onChange={(e) => setSuitabilityParams(prev => ({ ...prev, capital: Number(e.target.value) }))}
                            className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold/30"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] uppercase tracking-wider text-white/40 font-bold block mb-1">Risk Profile</label>
                          <select 
                            value={suitabilityParams.riskProfile}
                            onChange={(e) => setSuitabilityParams(prev => ({ ...prev, riskProfile: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold/30"
                          >
                            <option value="Conservative">Conservative (Capital Defense)</option>
                            <option value="Balanced">Balanced (Growth & Defense)</option>
                            <option value="Aggressive">Aggressive (High Volatility/Leverage)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[8px] uppercase tracking-wider text-white/40 font-bold block mb-1">Weekly Commitment (Hours)</label>
                          <input 
                            type="number"
                            value={suitabilityParams.hoursPerWeek}
                            onChange={(e) => setSuitabilityParams(prev => ({ ...prev, hoursPerWeek: Number(e.target.value) }))}
                            className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold/30"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] uppercase tracking-wider text-white/40 font-bold block mb-1">Time Horizon</label>
                          <select 
                            value={suitabilityParams.timeHorizon}
                            onChange={(e) => setSuitabilityParams(prev => ({ ...prev, timeHorizon: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold/30"
                          >
                            <option value="Short">Short Term (Under 6 Months)</option>
                            <option value="Medium">Medium Term (1-3 Years)</option>
                            <option value="Long">Long Term (5+ Years)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={runStrategyAdvisor}
                        disabled={isStrategyRecLoading}
                        className="w-full bg-gold text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-95 transition-all disabled:opacity-50"
                      >
                        {isStrategyRecLoading ? "Synthesizing Compatibility Profile..." : "Evaluate Strategic Suitability"}
                      </button>

                      {strategyRec && (
                        <div className="p-3.5 rounded-lg border border-gold/20 bg-gold/[0.02] text-xs leading-relaxed text-white/95 whitespace-pre-wrap animate-in slide-in-from-bottom-2 duration-300">
                          {strategyRec}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {/* 5. RISK MENTOR PANEL */}
            {activeTab === 'risk' && (
              <motion.div
                key="risk"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col min-h-0 p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-display font-black tracking-tight flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-gold" /> Risk Mentor
                  </h3>
                  <p className="text-white/40 text-xs mt-1">
                    "Learn how to manage risk, and the profits will look after themselves." Build solid math-based position sizing and master cognitive emotional discipline.
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-y-auto">
                  
                  {/* Left Column: Interactive Position Sizing Calculator */}
                  <div className="glass-panel p-5 border-white/5 bg-white/[0.01] space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <Calculator className="w-4 h-4 text-gold" />
                      <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Position Sizing Calculator</h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-white/60">
                          <span>Portfolio Equity Size ($)</span>
                          <span className="font-mono font-bold">${positionSizeParams.accountSize.toLocaleString()}</span>
                        </div>
                        <input 
                          type="range"
                          min="1000"
                          max="100000"
                          step="1000"
                          value={positionSizeParams.accountSize}
                          onChange={(e) => setPositionSizeParams(prev => ({ ...prev, accountSize: Number(e.target.value) }))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-white/60">
                          <span>Risk Allocation Per Trade (%)</span>
                          <span className="font-mono font-bold text-gold">{positionSizeParams.riskPct}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0.5"
                          max="5"
                          step="0.5"
                          value={positionSizeParams.riskPct}
                          onChange={(e) => setPositionSizeParams(prev => ({ ...prev, riskPct: Number(e.target.value) }))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[8px] uppercase tracking-wider text-white/40 font-bold block mb-1">Target Entry Price ($)</label>
                          <input 
                            type="number"
                            value={positionSizeParams.entryPrice}
                            onChange={(e) => setPositionSizeParams(prev => ({ ...prev, entryPrice: Number(e.target.value) }))}
                            className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold/30"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] uppercase tracking-wider text-white/40 font-bold block mb-1">Defensive Stop-Loss ($)</label>
                          <input 
                            type="number"
                            value={positionSizeParams.stopLoss}
                            onChange={(e) => setPositionSizeParams(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                            className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Results of Calculation */}
                    {(() => {
                      const calc = calcPositionSize();
                      return (
                        <div className="pt-4 border-t border-white/5 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40">Absolute Capital to Risk</span>
                            <span className="font-mono font-bold text-red-400">${calc.lossAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40">Calculated Shares to Purchase</span>
                            <span className="font-mono font-black text-gold">{calc.shares} Shares</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40">Total Allocated Purchase Value</span>
                            <span className="font-mono font-bold text-white">${calc.capitalAlloc.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40">Portfolio Capital Commitment</span>
                            <span className="font-mono font-bold text-blue-400">{calc.pctAlloc.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column: Emotional State Evaluator */}
                  <div className="glass-panel p-5 border-white/5 bg-white/[0.01] flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <Activity className="w-4 h-4 text-gold" />
                        <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Cognitive Discipline Coach</h4>
                      </div>
                      
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Emotions alter trading logic parameters. Use our diagnostic tool to test your current mental framework and receive a mentor mandate.
                      </p>

                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-red-400 flex items-center gap-1">Fear/Hesitancy</span>
                          <span className="text-gold flex items-center gap-1">Greed/FOMO</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={emotionalState}
                          onChange={(e) => setEmotionalState(Number(e.target.value))}
                          className="w-full h-2 bg-gradient-to-r from-red-500 via-blue-500 to-amber-500 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Dynamic mandate block */}
                      {(() => {
                        const evaluation = getEmotionalRule(emotionalState);
                        return (
                          <div className="p-4 rounded-xl border border-gold/15 bg-gold/[0.02] space-y-2 mt-4 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-white/40 uppercase tracking-widest text-[9px] font-bold">Diagnosed Frame</span>
                              <span className="font-bold text-gold uppercase font-mono">{evaluation.state}</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed italic">
                              "{evaluation.rule}"
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[10px] text-white/40 leading-relaxed mt-4">
                      <strong className="text-gold block mb-1">Mentor Note:</strong> Stop losses and predetermined position sizing remove emotional interference. High discipline models ignore price action entirely when off-shift.
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 6. PRACTICE LAB PANEL */}
            {activeTab === 'lab' && (
              <motion.div
                key="lab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col min-h-0 p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-display font-black tracking-tight flex items-center gap-2">
                    <Play className="w-5 h-5 text-gold animate-pulse" /> Practice Lab (Market Replay Challenge)
                  </h3>
                  <p className="text-white/40 text-xs mt-1">
                    Simulate real-time investing decisions using actual historical market trajectories. Learn to manage risks and conquer emotional blocks with zero risk to physical capital.
                  </p>
                </div>

                {/* GAME SCREEN */}
                <div className="flex-1 glass-panel p-6 border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-0 overflow-y-auto">
                  
                  {labGameState === 'intro' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto py-8">
                      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                        <Award className="w-8 h-8 text-gold animate-bounce" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white">THE VOLATILITY COMPRESSION CHALLENGE</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          You start with **$10,000 in virtual capital**. You will walk through a historic option-squeeze cycle step-by-step. At each stage, decide whether to Buy (adds positioning), Sell (liquidates all holdings to cash), or Hold. 
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setLabGameState('step1');
                          setLabGameBalance(10000);
                          setLabGamePosition(0);
                          setLabGameTrades([]);
                          setLabGameStepIndex(0);
                        }}
                        className="bg-gold text-black px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
                      >
                        Launch Simulation Session
                      </button>
                    </div>
                  )}

                  {/* ACTIVE GAME PLAY STEPS */}
                  {['step1', 'step2', 'step3', 'step4', 'step5'].includes(labGameState) && (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                      
                      {/* Left: Step Details */}
                      <div className="flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gold">Simulation Progression {labGameStepIndex + 1}/5</span>
                            <span className="text-[10px] font-mono font-bold text-white/50">Sim Ticker: TSLA</span>
                          </div>
                          
                          <div className="text-3xl font-display font-black text-gold">
                            ${GAME_STEPS[labGameStepIndex].price.toFixed(2)}
                            <span className="text-xs text-white/30 font-normal block mt-1">Simulated Market Price</span>
                          </div>

                          <p className="text-xs text-white/85 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5 italic">
                            "{GAME_STEPS[labGameStepIndex].context}"
                          </p>
                        </div>

                        {/* Interactive Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => handleGameAction('BUY')}
                            className="flex-1 bg-emerald-500 text-black py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition-all active:scale-95"
                          >
                            Buy TSLA (Allocate 50%)
                          </button>
                          <button
                            onClick={() => handleGameAction('SELL')}
                            disabled={labGamePosition === 0}
                            className="flex-1 bg-red-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-400 transition-all active:scale-95 disabled:opacity-50"
                          >
                            Sell TSLA (Liquidate to Cash)
                          </button>
                          <button
                            onClick={() => handleGameAction('HOLD')}
                            className="flex-1 bg-white/10 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white/15 transition-all active:scale-95"
                          >
                            Hold / Pass Time
                          </button>
                        </div>
                      </div>

                      {/* Right: Portfolio Metrics Card */}
                      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6 space-y-4">
                        <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block">Live Virtual Balances</span>
                        
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-[8px] uppercase tracking-wider text-white/40 block">Liquid Cash Balance</span>
                            <span className="text-sm font-mono font-bold">${labGameBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>

                          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-[8px] uppercase tracking-wider text-white/40 block">Securities Held</span>
                            <span className="text-sm font-mono font-bold text-gold">{labGamePosition} Shares</span>
                          </div>

                          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-[8px] uppercase tracking-wider text-white/40 block">Total Portfolio Value</span>
                            <span className="text-sm font-mono font-black text-blue-400">
                              ${(labGameBalance + (labGamePosition * GAME_STEPS[labGameStepIndex].price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Order execution logging */}
                        <div className="pt-2">
                          <span className="text-[8px] uppercase tracking-wider text-white/30 font-bold block mb-1">Execution History</span>
                          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                            {labGameTrades.map((t, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[9px] text-white/60">
                                <span>Step {t.step}: {t.action}</span>
                                <span className="font-mono">${t.price} ({t.shares} shares)</span>
                              </div>
                            ))}
                            {labGameTrades.length === 0 && (
                              <p className="text-[9px] text-white/20 italic">No market orders executed yet...</p>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* GAME COMPLETED SCREEN (MENTOR EVALUATION REPORT CARD) */}
                  {labGameState === 'results' && (() => {
                    const evaluation = getGameScore();
                    return (
                      <div className="flex-1 flex flex-col md:flex-row gap-6 animate-in zoom-in-95 duration-300">
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-gold">
                              <Award className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-wider">OFFICIAL REPLAY COMPLETED</span>
                            </div>
                            <h4 className="text-lg font-black text-white">Your Mentor Evaluation Report Card</h4>
                          </div>

                          <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl space-y-3 leading-relaxed text-xs">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="font-bold text-gold">Cognitive Performance Feedback</span>
                              <span className="font-mono font-black text-gold text-sm">{evaluation.score}/100</span>
                            </div>
                            <p className="text-white/80">{evaluation.feedback}</p>
                          </div>

                          <button
                            onClick={() => setLabGameState('intro')}
                            className="bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider"
                          >
                            Restart Replay Simulation
                          </button>
                        </div>

                        <div className="w-full md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6 space-y-4">
                          <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block text-center">Session Statistics</span>
                          <div className="text-center p-6 bg-white/[0.01] rounded-xl border border-white/5">
                            <span className="text-[10px] text-white/40 block">Final Account Value</span>
                            <span className={cn(
                              "text-2xl font-display font-black block mt-1",
                              labGameBalance >= 10000 ? "text-emerald-400" : "text-red-400"
                            )}>
                              ${labGameBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-white/30 uppercase mt-1 inline-block">
                              {((labGameBalance - 10000) / 10000 * 100).toFixed(1)}% Return
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </motion.div>
            )}

            {/* 7. CLASSIC AI MENTOR CHAT */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col min-h-0 overflow-hidden relative"
              >
                {/* Audio/Visual soundwaves mockup */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none flex items-center justify-center z-10">
                  <div className="flex gap-1 items-end h-6">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, Math.random() * 18 + 4, 4] }}
                        transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                        className="w-1 bg-gold/20 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Messages Loop */}
                <div 
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 pt-16 min-h-0"
                >
                  <AnimatePresence initial={false}>
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                          "flex gap-4 max-w-[80%] items-start",
                          msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                          msg.role === 'ai' ? "bg-gold/10 border-gold/25" : "bg-white/10 border-white/5"
                        )}>
                          {msg.role === 'ai' ? <Bot className="w-5 h-5 text-gold" /> : <User className="w-5 h-5 text-white/60" />}
                        </div>
                        <div className={cn(
                          "p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap",
                          msg.role === 'ai' 
                            ? "bg-white/[0.02] border border-white/5 text-white/90" 
                            : "bg-gold text-black font-semibold"
                        )}>
                          {msg.text}
                          <div className={cn(
                            "text-[8px] mt-2 opacity-40",
                            msg.role === 'user' ? "text-black" : "text-white"
                          )}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Chat Input form footer */}
                <div className="p-4 border-t border-white/5 bg-panel-surface/50">
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                      placeholder={isChatLoading ? "Mentor is preparing explanation..." : "Ask the Mentor about risk ratios, charting setups, inflation impacts..."}
                      disabled={isChatLoading}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-20 text-xs focus:outline-none focus:border-gold/50 transition-all placeholder:text-white/20",
                        isChatLoading && "opacity-50 cursor-not-allowed"
                      )}
                    />
                    <button 
                      onClick={handleChatSend}
                      disabled={isChatLoading || !chatInput.trim()}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold text-black rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50",
                        isChatLoading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isChatLoading ? (
                        <Activity className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
