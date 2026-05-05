export type AlgoType = "option-buying" | "option-selling" | "option-selling-only";
export type StrategyId =
  | "momentum-breakout"
  | "pullback-pro"
  | "trend-continuation"
  | "iron-condor"
  | "range-hunter"
  | "mean-revert";

export interface Strategy {
  id: StrategyId;
  name: string;
  tagline: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  probability: "High Probability" | "Balanced";
  winRate: number;
  icon: string;
  capital: number;
  lots: number;
  maxRisk: string;
  suitable: string;
  timeframe: string;
  type: string;
  locked?: boolean;
  price?: number;
  lessons: { title: string; duration: string; summary: string }[];
  quiz: { question: string; options: string[]; correct: number }[];
  checks: string[];
}

export const STRATEGIES: Strategy[] = [
  {
    id: "momentum-breakout",
    name: "Momentum Breakout",
    tagline: "Capture strong breakouts with price & volume confirmation",
    level: "Beginner",
    probability: "High Probability",
    winRate: 68,
    icon: "🚀",
    capital: 100000,
    lots: 1,
    maxRisk: "₹2,000 (2%)",
    suitable: "Intraday",
    timeframe: "15m – 1h",
    type: "Trending Market",
    lessons: [
      { title: "When it will work", duration: "02:15", summary: "Understand the market conditions where this strategy performs best." },
      { title: "Entry Rules", duration: "02:10", summary: "Learn precise entry triggers using price action and volume." },
      { title: "SL & Target", duration: "02:05", summary: "How to set stop-loss and target for a healthy risk-reward." },
    ],
    quiz: [
      {
        question: "When does the Momentum Breakout strategy work best?",
        options: [
          "When the market is in a strong uptrend with high volume",
          "When the market is sideways and low volatility",
          "When the market is in a strong downtrend",
          "During news announcements and volatility spikes",
        ],
        correct: 0,
      },
      {
        question: "What confirms a valid breakout entry?",
        options: [
          "A single green candle",
          "Price closing above resistance with above-average volume",
          "RSI below 30",
          "Random price spikes",
        ],
        correct: 1,
      },
      {
        question: "Where should the stop-loss be placed?",
        options: [
          "Far away to avoid getting hit",
          "Below the breakout level / recent swing low",
          "At the entry price",
          "Anywhere comfortable",
        ],
        correct: 1,
      },
    ],
    checks: ["I understand when this strategy works", "I know the entry rules", "I know the SL & Target", "I understand the risks involved"],
  },
  {
    id: "pullback-pro",
    locked: true,
    price: 499,
    name: "Pullback Pro",
    tagline: "Buy options on pullbacks in strong trends",
    level: "Intermediate",
    probability: "Balanced",
    winRate: 62,
    icon: "↩️",
    capital: 150000,
    lots: 1,
    maxRisk: "₹3,000 (2%)",
    suitable: "Swing",
    timeframe: "1h – 1D",
    type: "Trending Market",
    lessons: [
      { title: "Spotting Pullbacks", duration: "02:30", summary: "Identify healthy pullbacks within a strong trend." },
      { title: "Entry Triggers", duration: "02:00", summary: "Use moving averages and candle patterns for entries." },
      { title: "Risk Management", duration: "02:15", summary: "Trail stops and book partial profits." },
    ],
    quiz: [
      { question: "Pullback Pro performs best in:", options: ["Sideways markets", "Strong trending markets with healthy pullbacks", "News-driven markets", "Pre-market"], correct: 1 },
      { question: "Best entry trigger?", options: ["Random dips", "Pullback to key MA with bullish reversal candle", "Top of the trend", "Low-volume noise"], correct: 1 },
      { question: "Risk management means:", options: ["No stop-loss", "Trail SL and book partial profits", "Add on every loss", "Hold forever"], correct: 1 },
    ],
    checks: ["I understand when this strategy works", "I know the entry rules", "I know the SL & Target", "I understand the risks involved"],
  },
  {
    id: "trend-continuation",
    locked: true,
    price: 999,
    name: "Trend Continuation",
    tagline: "Ride the trend using confirmations & momentum",
    level: "Advanced",
    probability: "High Probability",
    winRate: 71,
    icon: "📈",
    capital: 200000,
    lots: 2,
    maxRisk: "₹4,000 (2%)",
    suitable: "Positional",
    timeframe: "1D – 1W",
    type: "Trending Market",
    lessons: [
      { title: "Trend Identification", duration: "02:45", summary: "Use higher highs / higher lows to confirm trend." },
      { title: "Momentum Confirmation", duration: "02:20", summary: "Combine RSI, MACD and volume to confirm." },
      { title: "Exit Strategy", duration: "02:10", summary: "Trail with structure and momentum loss signals." },
    ],
    quiz: [
      { question: "Trend Continuation works best when:", options: ["Trend is clearly defined with momentum", "Market is choppy", "Random noise", "After major reversals"], correct: 0 },
      { question: "Confirmation includes:", options: ["Only one indicator", "Multiple aligned indicators (RSI/MACD/Volume)", "Gut feeling", "News alone"], correct: 1 },
      { question: "Best exit?", options: ["Fixed time", "Trail stops based on structure & momentum", "At entry", "Never exit"], correct: 1 },
    ],
    checks: ["I understand when this strategy works", "I know the entry rules", "I know the SL & Target", "I understand the risks involved"],
  },
  {
    id: "iron-condor",
    name: "Iron Condor",
    tagline: "Earn premium when the market stays in a range",
    level: "Intermediate",
    probability: "High Probability",
    winRate: 74,
    icon: "🦅",
    capital: 175000,
    lots: 1,
    maxRisk: "₹3,500 (2%)",
    suitable: "Weekly Expiry",
    timeframe: "1D",
    type: "Non-Trending Market",
    lessons: [
      { title: "When ranges form", duration: "02:20", summary: "Spot low-volatility consolidation zones." },
      { title: "Setting up the wings", duration: "02:10", summary: "Pick safe strike distances on both sides." },
      { title: "Adjustments & exits", duration: "02:00", summary: "How to defend the position if price moves." },
    ],
    quiz: [
      { question: "Iron Condor performs best when:", options: ["Strong trend up", "Market stays in a range", "High volatility spike", "After news events"], correct: 1 },
      { question: "What's the main income source?", options: ["Capital gains", "Net premium collected", "Dividends", "Interest"], correct: 1 },
      { question: "Biggest risk?", options: ["Sideways drift", "A sharp directional breakout", "Low volume", "Time decay"], correct: 1 },
    ],
    checks: ["I understand when this strategy works", "I know the entry rules", "I know the SL & Target", "I understand the risks involved"],
  },
  {
    id: "range-hunter",
    locked: true,
    price: 499,
    name: "Range Hunter",
    tagline: "Buy support, sell resistance inside a clear range",
    level: "Beginner",
    probability: "Balanced",
    winRate: 64,
    icon: "🎯",
    capital: 120000,
    lots: 1,
    maxRisk: "₹2,400 (2%)",
    suitable: "Intraday",
    timeframe: "15m – 1h",
    type: "Non-Trending Market",
    lessons: [
      { title: "Identifying the range", duration: "02:05", summary: "Use S/R levels to confirm a clean range." },
      { title: "Entry & SL placement", duration: "02:10", summary: "Fade the edges with tight stops." },
      { title: "When to skip a trade", duration: "01:55", summary: "Avoid ranges with breakout pressure." },
    ],
    quiz: [
      { question: "Best market for Range Hunter?", options: ["Strong trends", "Clean sideways range", "News-driven", "Pre-open"], correct: 1 },
      { question: "Where do you enter?", options: ["Middle of range", "At range support / resistance", "Random", "After a breakout"], correct: 1 },
      { question: "What invalidates the trade?", options: ["Price rejecting the level", "A breakout with volume", "Time passing", "Market open"], correct: 1 },
    ],
    checks: ["I understand when this strategy works", "I know the entry rules", "I know the SL & Target", "I understand the risks involved"],
  },
  {
    id: "mean-revert",
    locked: true,
    price: 799,
    name: "Mean Revert Pro",
    tagline: "Trade extremes back to the mean using RSI & Bollinger",
    level: "Advanced",
    probability: "High Probability",
    winRate: 69,
    icon: "🔄",
    capital: 180000,
    lots: 1,
    maxRisk: "₹3,600 (2%)",
    suitable: "Swing",
    timeframe: "1h – 1D",
    type: "Non-Trending Market",
    lessons: [
      { title: "Mean reversion theory", duration: "02:25", summary: "Why prices return to average in ranges." },
      { title: "RSI & Bollinger setup", duration: "02:15", summary: "Combine indicators for high-probability extremes." },
      { title: "Risk control", duration: "02:00", summary: "Position sizing and SL on overshoots." },
    ],
    quiz: [
      { question: "Mean reversion works best in:", options: ["Strong trends", "Range-bound markets", "Volatile breakouts", "Illiquid markets"], correct: 1 },
      { question: "Which combo signals an extreme?", options: ["Only price", "RSI > 70 / < 30 with Bollinger touch", "Volume alone", "MACD cross"], correct: 1 },
      { question: "Stop-loss should sit:", options: ["At the mean", "Beyond the extreme with buffer", "At entry", "No SL"], correct: 1 },
    ],
    checks: ["I understand when this strategy works", "I know the entry rules", "I know the SL & Target", "I understand the risks involved"],
  },
];
