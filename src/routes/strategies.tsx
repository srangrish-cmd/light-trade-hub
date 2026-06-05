import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronRight, Home, BookOpen, User, BarChart3, Play, Lock, Rocket, TrendingUp, TrendingDown, Activity, ShieldCheck, Sparkles, Bot, Flame, Shield, Sparkle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Stepper } from "@/components/algo/Stepper";
import { MiniChart } from "@/components/algo/MiniChart";
import { STRATEGIES, type AlgoType, type Strategy } from "@/components/algo/types";

/* ---------- Strategy meta helpers ---------- */
function getStrategyMeta(s: Strategy) {
  const returnPct = s.winRate + Math.round((s.capital % 13) + 8);
  const backtestPct = Math.max(20, returnPct - 6); // backtest slightly lower than live
  const drawdown = Math.max(6, Math.round((100 - s.winRate) * 0.6));
  const risk: "Low" | "Medium" | "High" =
    s.level === "Beginner" ? "Low" : s.level === "Intermediate" ? "Medium" : "High";
  const tag: "Trending" | "Safe" | "New" =
    s.id === "iron-condor" || s.id === "range-hunter" ? "Safe"
    : s.id === "mean-revert" ? "New"
    : "Trending";
  // deterministic users count based on win rate & id length
  const users = 800 + (s.winRate * 47) + (s.id.length * 113);
  const tested = s.level === "Advanced" ? "5Y" : s.level === "Intermediate" ? "3Y" : "2Y";
  return { returnPct, backtestPct, drawdown, risk, tag, users, tested };
}

function fmtUsers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const RISK_STYLES: Record<string, string> = {
  Low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  High: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
const TAG_STYLES: Record<string, { cls: string; icon: any }> = {
  Trending: { cls: "bg-primary-soft text-primary", icon: Flame },
  Safe: { cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: Shield },
  New: { cls: "bg-violet-500/10 text-violet-600 dark:text-violet-400", icon: Sparkle },
};

export const Route = createFileRoute("/strategies")({ component: Index });

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function Index() {
  const [step, setStep] = useState<Step>(0);
  const [algoType, setAlgoType] = useState<AlgoType | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [lessonsDone, setLessonsDone] = useState<number[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [checks, setChecks] = useState<boolean[]>([]);

  const goto = (s: Step) => setStep(s);

  return (
    <div>
      {/* Stepper */}
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Stepper current={step} />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        {step === 0 && (
          <StepDiscover
            onPickStrategy={(s) => { setStrategy(s); setLessonsDone([]); goto(2); }}
          />
        )}
        {step === 1 && (
          <StepStrategy
            onBack={() => goto(0)}
            onSelect={(s) => { setStrategy(s); setLessonsDone([]); goto(2); }}
          />
        )}
        {step === 2 && strategy && (
          <StepLearn
            strategy={strategy}
            done={lessonsDone}
            setDone={setLessonsDone}
            onBack={() => goto(1)}
            onNext={() => { setQuizIdx(0); setAnswers([]); goto(3); }}
          />
        )}
        {step === 3 && strategy && (
          <StepQuiz
            strategy={strategy}
            quizIdx={quizIdx}
            setQuizIdx={setQuizIdx}
            answers={answers}
            setAnswers={setAnswers}
            onBack={() => goto(2)}
            onComplete={() => goto(4)}
          />
        )}
        {step === 4 && strategy && (
          <StepComplete strategy={strategy} answers={answers} onBack={() => goto(3)} onNext={() => { setChecks(strategy.checks.map(() => true)); goto(5); }} />
        )}
        {step === 5 && strategy && (
          <StepDeploy strategy={strategy} checks={checks} setChecks={setChecks} onBack={() => goto(4)} onDeployed={() => goto(0)} />
        )}
      </div>
    </div>
  );
}

/* ---------- Step 0: Netflix-style Discover ---------- */
const PROOF_POINTS = [
  { label: "Avg. Returns", value: "+38%", sub: "last 12 months" },
  { label: "Active Traders", value: "12,400+", sub: "deploying live" },
  { label: "Capital Deployed", value: "₹284 Cr", sub: "across strategies" },
];

const CATEGORIES = [
  { id: "buying", label: "Options Buying", icon: "🚀", filter: (s: Strategy) => s.type === "Trending Market" && s.level !== "Advanced" },
  { id: "selling", label: "Options Selling", icon: "💰", filter: (s: Strategy) => s.type === "Non-Trending Market" },
  { id: "intraday", label: "Intraday", icon: "⚡", filter: (s: Strategy) => s.suitable === "Intraday" },
];

function StepDiscover({ onPickStrategy }: { onPickStrategy: (s: Strategy) => void }) {
  const [gptOpen, setGptOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const trending = STRATEGIES.filter((s) => s.type === "Trending Market");
  const nonTrending = STRATEGIES.filter((s) => s.type === "Non-Trending Market");

  // Recommended = unlocked, highest win-rate first
  const recommended = [...STRATEGIES].sort((a, b) => Number(!!a.locked) - Number(!!b.locked) || b.winRate - a.winRate).slice(0, 4);

  const filtered = activeCat ? STRATEGIES.filter(CATEGORIES.find((c) => c.id === activeCat)!.filter) : null;

  if (gptOpen) {
    return <PocketfulGPT onBack={() => setGptOpen(false)} onPickStrategy={onPickStrategy} />;
  }

  return (
    <div className="space-y-7">
      {/* Outcome headline */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Deploy proven strategies. <span className="text-primary">Track real PnL.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Hand-picked algos with verified backtests — go from learn to live in minutes.</p>
      </div>

      {/* Category shortcuts */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCat(null)}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeCat === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeCat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
          >
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Pocketful GPT card */}
      <button
        onClick={() => setGptOpen(true)}
        className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-[var(--shadow-card)]"
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Bot className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-display text-base font-bold">Pocketful GPT</div>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">AI</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">3 quick questions → best algo for you</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>

      {filtered ? (
        <AlgoRow
          title={CATEGORIES.find((c) => c.id === activeCat)!.label}
          subtitle="Filtered by category"
          icon={Sparkles}
          items={filtered}
          onPick={onPickStrategy}
        />
      ) : (
        <>
          {/* Recommended for you — above the fold */}
          <AlgoRow
            title="Recommended for you"
            subtitle="Top performers based on your profile"
            icon={Sparkles}
            accent="✨"
            items={recommended}
            onPick={onPickStrategy}
          />

          <AlgoRow
            title="Trending Market"
            subtitle="Strategies built for clear up/down moves"
            icon={TrendingUp}
            accent="🔥"
            items={trending}
            onPick={onPickStrategy}
          />

          <AlgoRow
            title="Non-Trending Market"
            subtitle="Range & sideways setups for low volatility"
            icon={Activity}
            items={nonTrending}
            onPick={onPickStrategy}
          />
        </>
      )}
    </div>
  );
}

function AlgoRow({
  title,
  subtitle,
  icon: Icon,
  accent,
  items,
  onPick,
}: {
  title: string;
  subtitle: string;
  icon: any;
  accent?: string;
  items: Strategy[];
  onPick: (s: Strategy) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold">
              {title} {accent && <span className="ml-1">{accent}</span>}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <button className="text-xs font-semibold text-primary">See all</button>
      </div>
      <div className="-mx-4 sm:-mx-6 overflow-x-auto pb-2">
        <div className="flex items-stretch gap-3 px-4 sm:px-6 snap-x snap-mandatory">
          {items.map((s) => (
            <AlgoTile key={s.id} strategy={s} onPick={onPick} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AlgoTile({ strategy, onPick }: { strategy: Strategy; onPick: (s: Strategy) => void }) {
  const locked = !!strategy.locked;
  const { returnPct, backtestPct, drawdown, risk, tag, users, tested } = getStrategyMeta(strategy);
  const TagIcon = TAG_STYLES[tag].icon;
  const [mode, setMode] = useState<"live" | "backtest">("live");
  const display = mode === "live" ? returnPct : backtestPct;
  return (
    <button
      onClick={() => { if (!locked) onPick(strategy); else alert(`Unlock ${strategy.name} for ₹${strategy.price}`); }}
      className="group relative flex w-[72vw] max-w-[260px] sm:w-[260px] flex-shrink-0 snap-start flex-col self-stretch overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-card)] active:scale-[0.98]"
    >
      {/* Top: tag + lock */}
      <div className="flex items-center justify-between px-4 pt-3">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_STYLES[tag].cls}`}>
          <TagIcon className="h-3 w-3" /> {tag}
        </span>
        {locked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] font-semibold text-background">
            <Lock className="h-3 w-3" /> PRO
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
            <ShieldCheck className="h-3 w-3" /> Verified · {tested} tested
          </span>
        )}
      </div>

      <div className={`flex-1 px-4 pt-2 pb-4 ${locked ? "opacity-80" : ""}`}>
        {/* Name + icon */}
        <div className="flex items-start gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-lg">{strategy.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-bold">{strategy.name}</div>
            <div className="text-[10px] text-muted-foreground">{strategy.level} · {strategy.suitable}</div>
          </div>
        </div>

        {/* Live / Backtest toggle */}
        <div
          role="tablist"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-flex rounded-full bg-muted p-0.5 text-[10px] font-semibold"
        >
          {(["live", "backtest"] as const).map((m) => (
            <span
              key={m}
              role="tab"
              onClick={(e) => { e.stopPropagation(); setMode(m); }}
              className={`cursor-pointer rounded-full px-2 py-0.5 transition-colors ${
                mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {m === "live" ? "Live" : "Backtest"}
            </span>
          ))}
        </div>

        {/* Big return — primary visual */}
        <div className="mt-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Returns (1Y)</div>
          <div className="font-display text-3xl font-extrabold leading-none text-primary">+{display}%</div>
        </div>

        {/* Equity curve */}
        <div className="mt-2 h-12">
          <MiniChart trend="up" />
        </div>

        {/* Quick stats */}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <div>
            <div className="text-muted-foreground">Win</div>
            <div className="font-semibold">{strategy.winRate}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Max DD</div>
            <div className="font-semibold text-rose-500">-{drawdown}%</div>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${RISK_STYLES[risk]}`}>{risk}</span>
        </div>

        {/* Users count */}
        <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
          <User className="h-3 w-3" />
          <span><span className="font-semibold text-foreground">{fmtUsers(users)}</span> traders deployed</span>
        </div>
      </div>
    </button>
  );
}

/* ---------- Pocketful GPT mini-flow ---------- */
function PocketfulGPT({ onBack, onPickStrategy }: { onBack: () => void; onPickStrategy: (s: Strategy) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      q: "What is your total capital for trading?",
      help: "This helps us suggest suitable strategies.",
      options: ["Less than ₹1 Lakh", "₹1 – ₹5 Lakhs", "₹5 – ₹20 Lakhs", "More than ₹20 Lakhs"],
    },
    {
      q: "What is your risk appetite?",
      help: "We'll recommend strategies matching your risk profile.",
      options: ["Low (Conservative)", "Moderate", "High (Aggressive)"],
    },
    {
      q: "What's your trading goal?",
      help: "Different goals suit different setups.",
      options: ["Steady monthly income", "Capital growth", "Learn & experiment"],
    },
  ];

  if (qIdx >= questions.length) {
    return <PocketfulRecommendations answers={answers} onBack={onBack} onPickStrategy={onPickStrategy} />;
  }

  const cur = questions[qIdx];
  const select = (opt: string) => {
    const next = [...answers]; next[qIdx] = opt; setAnswers(next);
    setQIdx(qIdx + 1);
  };

  return (
    <div className="space-y-5">
      <Header title="Pocketful GPT" subtitle={`Step ${qIdx + 1} of ${questions.length}`} onBack={qIdx === 0 ? onBack : () => setQIdx(qIdx - 1)} icon={Bot} />
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${((qIdx) / questions.length) * 100}%` }} />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-xl font-bold">{cur.q}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{cur.help}</p>
        <div className="mt-4 space-y-2.5">
          {cur.options.map((opt) => {
            const sel = answers[qIdx] === opt;
            return (
              <button
                key={opt}
                onClick={() => select(opt)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  sel ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <span className="text-sm font-medium">{opt}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PocketfulRecommendations({ answers, onBack, onPickStrategy }: { answers: string[]; onBack: () => void; onPickStrategy: (s: Strategy) => void }) {
  const risk = answers[1] ?? "";
  // very simple matching: high risk → trending, low/moderate → non-trending bias
  const recs = risk.startsWith("High")
    ? STRATEGIES.filter((s) => s.type === "Trending Market")
    : risk.startsWith("Low")
    ? STRATEGIES.filter((s) => s.type === "Non-Trending Market")
    : [...STRATEGIES.filter((s) => s.type === "Non-Trending Market").slice(0, 2), ...STRATEGIES.filter((s) => s.type === "Trending Market").slice(0, 1)];

  return (
    <div className="space-y-5">
      <Header title="Recommended for you" subtitle="Based on your answers, these strategies fit best" onBack={onBack} icon={Sparkles} />
      <div className="grid gap-3">
        {recs.map((s) => {
          const locked = !!s.locked;
          return (
            <button
              key={s.id}
              onClick={() => { if (!locked) onPickStrategy(s); else alert(`Unlock ${s.name} for ₹${s.price}`); }}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-2xl">{s.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-display text-base font-bold">{s.name}</div>
                  {locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.type} · {s.level}</div>
                <div className="mt-1 text-xs font-semibold text-primary">+{s.winRate}% win rate</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 1 (kept for fallback) ---------- */
function StepStrategy({ onBack, onSelect }: { onBack: () => void; onSelect: (s: Strategy) => void }) {
  const [tab, setTab] = useState<"buying" | "selling">("buying");
  return (
    <div className="space-y-5">
      <Header title="Trending Market" subtitle="Choose your strategy" onBack={onBack} icon={TrendingUp} />
      <div className="inline-flex rounded-full bg-muted p-1">
        {(["buying", "selling"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Option {t === "buying" ? "Buying" : "Selling"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {STRATEGIES.map((s) => {
          const locked = !!s.locked;
          const { returnPct, drawdown, risk, tag, users, tested } = getStrategyMeta(s);
          const TagIcon = TAG_STYLES[tag].icon;
          return (
            <button
              key={s.id}
              onClick={() => { if (!locked) onSelect(s); }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 ${
                locked ? "cursor-not-allowed" : "hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-card)] active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_STYLES[tag].cls}`}>
                  <TagIcon className="h-3 w-3" /> {tag}
                </span>
                {locked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] font-semibold text-background">
                    <Lock className="h-3 w-3" /> PRO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified · {tested} tested
                  </span>
                )}
              </div>

              <div className={`mt-3 ${locked ? "opacity-70" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-xl">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg font-bold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.level} · {s.suitable}</div>
                  </div>
                </div>

                {/* Big return as primary visual */}
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Returns (1Y)</div>
                    <div className="font-display text-4xl font-extrabold leading-none text-primary">+{returnPct}%</div>
                  </div>
                  <div className="h-14 w-32">
                    <MiniChart trend="up" />
                  </div>
                </div>

                {/* Stats row — drawdown highlighted */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-surface p-2.5 text-center">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Win Rate</div>
                    <div className="text-sm font-bold">{s.winRate}%</div>
                  </div>
                  <div className="border-x border-border">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-500/80">Max Drawdown</div>
                    <div className="text-base font-extrabold text-rose-500">-{drawdown}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Risk</div>
                    <div className={`mx-auto mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${RISK_STYLES[risk]}`}>{risk}</div>
                  </div>
                </div>

                {/* Users count */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span><span className="font-semibold text-foreground">{fmtUsers(users)}</span> traders deployed this</span>
                </div>
              </div>

              {locked && (
                <div
                  role="button"
                  onClick={(e) => { e.stopPropagation(); alert(`Unlock ${s.name} for ₹${s.price}`); }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background hover:opacity-90"
                >
                  <Lock className="h-4 w-4" /> Unlock for ₹{s.price}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-card p-4 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <div className="flex-1 text-sm">
          <div className="font-medium">Which strategy is right for me?</div>
          <div className="text-muted-foreground">Compare all strategies</div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

/* ---------- Step 2 ---------- */
function StepLearn({ strategy, done, setDone, onBack, onNext }: { strategy: Strategy; done: number[]; setDone: (d: number[]) => void; onBack: () => void; onNext: () => void }) {
  const [active, setActive] = useState(0);
  const allDone = done.length === strategy.lessons.length;
  return (
    <div className="space-y-5">
      <Header
        title={strategy.name}
        subtitle="Learn the strategy in 3 short lessons"
        onBack={onBack}
        action={
          <Link to="/backtest" search={{ id: strategy.id }} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary">
            <BarChart3 className="h-3.5 w-3.5" /> Backtest Now
          </Link>
        }
      />

      <div className="flex items-center justify-center gap-2">
        {strategy.lessons.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
              done.includes(i) ? "bg-primary text-primary-foreground" : i === active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {done.includes(i) ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            {i < strategy.lessons.length - 1 && <div className={`h-0.5 w-8 ${done.includes(i) ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Active lesson card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-primary">Lesson {active + 1}</div>
            <div className="mt-0.5 font-display text-xl font-bold">{strategy.lessons[active].title}</div>
          </div>
          <span className="text-sm text-muted-foreground">{strategy.lessons[active].duration}</span>
        </div>
        <div className="mt-4 aspect-video w-full rounded-xl bg-gradient-to-br from-primary-soft to-secondary p-6">
          <MiniChart trend="up" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{strategy.lessons[active].summary}</p>
        <button
          onClick={() => {
            if (!done.includes(active)) setDone([...done, active]);
            if (active < strategy.lessons.length - 1) setActive(active + 1);
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Play className="h-4 w-4 fill-current" /> {done.includes(active) ? "Mark complete & continue" : "Watch Video"}
        </button>
      </div>

      {/* Lesson list */}
      <div className="space-y-2">
        {strategy.lessons.map((l, i) => {
          const isDone = done.includes(i);
          const locked = i > 0 && !done.includes(i - 1);
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => setActive(i)}
              className={`flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors ${
                active === i ? "border-primary" : "border-border"
              } ${locked ? "opacity-50" : "hover:border-primary"}`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDone ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {isDone ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-4 w-4" /> : i + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Lesson {i + 1}</div>
                <div className="text-sm font-semibold">{l.title}</div>
              </div>
              <span className="text-xs text-muted-foreground">{l.duration}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-2 text-sm font-semibold">What you'll learn</div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Best market conditions</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Key indicators to watch</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Avoid these situations</li>
        </ul>
      </div>

      <PrimaryNext disabled={!allDone} onClick={onNext} label={allDone ? "Take the quiz" : "Complete all lessons to continue"} />
    </div>
  );
}

/* ---------- Step 3 ---------- */
function StepQuiz({ strategy, quizIdx, setQuizIdx, answers, setAnswers, onBack, onComplete }: any) {
  const total = strategy.quiz.length;
  const q = strategy.quiz[quizIdx];
  const [selected, setSelected] = useState<number | null>(answers[quizIdx] ?? null);

  const submit = () => {
    if (selected === null) return;
    const next = [...answers]; next[quizIdx] = selected; setAnswers(next);
    if (quizIdx + 1 < total) {
      setQuizIdx(quizIdx + 1);
      setSelected(next[quizIdx + 1] ?? null);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-5">
      <Header title="Strategy Quiz" subtitle="Answer all questions correctly" onBack={onBack} />
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {quizIdx + 1} of {total}</span>
          <span>{Math.round(((quizIdx) / total) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${((quizIdx) / total) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-xl font-bold">{q.question}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the correct answer</p>
        <div className="mt-4 space-y-2.5">
          {q.options.map((opt: string, i: number) => {
            const letter = String.fromCharCode(65 + i);
            const isSel = selected === i;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  isSel ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${isSel ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {letter}
                </span>
                <span className="text-sm font-medium">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <PrimaryNext disabled={selected === null} onClick={submit} label={quizIdx + 1 === total ? "Submit" : "Next"} />
    </div>
  );
}

/* ---------- Step 4 ---------- */
function StepComplete({ strategy, answers, onBack, onNext }: any) {
  const correct = answers.filter((a: number, i: number) => a === strategy.quiz[i].correct).length;
  const total = strategy.quiz.length;
  const perfect = correct === total;

  return (
    <div className="space-y-6">
      <Header title="" onBack={onBack} />
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
          <Check className="h-10 w-10 text-primary" strokeWidth={3} />
        </div>
        <h1 className="font-display text-3xl font-bold">Quiz Complete!</h1>
        <p className="mt-2 text-muted-foreground">{perfect ? "Great job! 🎉 You've answered all questions correctly." : "Nice try — review the lessons to do even better."}</p>

        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border bg-surface p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Your Score</span>
            <span className="font-display text-2xl font-bold text-primary">{Math.round((correct / total) * 100)}%</span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{correct} / {total}</div>
        </div>

        <div className="mt-6 space-y-2 text-left">
          {strategy.checks.slice(0, 3).map((c: string) => (
            <div key={c} className="flex items-center gap-2.5 text-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" strokeWidth={3} /></div>
              You {c.replace(/^I /, "")}
            </div>
          ))}
        </div>
      </div>
      <PrimaryNext disabled={!perfect} onClick={onNext} label={perfect ? "Deploy Strategy" : "Retake quiz to deploy"} />
    </div>
  )
}

/* ---------- Step 5 ---------- */
function StepDeploy({ strategy, checks, setChecks, onBack, onDeployed }: any) {
  const allChecked = checks.length > 0 && checks.every(Boolean);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [multiplier, setMultiplier] = useState<number>(strategy.lots);
  const factor = multiplier / strategy.lots;
  const capital = Math.round(strategy.capital * factor);
  const riskMatch = String(strategy.maxRisk).match(/₹([\d,]+)\s*\(([^)]+)\)/);
  const baseRisk = riskMatch ? Number(riskMatch[1].replace(/,/g, "")) : 0;
  const riskPct = riskMatch ? riskMatch[2] : "";
  const scaledRisk = `₹${Math.round(baseRisk * factor).toLocaleString("en-IN")} (${riskPct})`;

  const deploy = () => {
    setDeploying(true);
    setTimeout(() => { setDeploying(false); setDeployed(true); }, 1100);
  };

  if (deployed) {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
            <Rocket className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">Strategy Live</h1>
          <p className="mt-2 text-muted-foreground">{strategy.name} is now running. You can stop it anytime from My Strategies.</p>
          <button onClick={onDeployed} className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Header title="Deploy Strategy" onBack={onBack} />
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-2xl">{strategy.icon}</div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold">{strategy.name}</div>
            <Badge tone="primary">Option Buying</Badge>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{strategy.tagline}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 text-sm font-semibold">Lot Multiplier</div>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setMultiplier(Math.max(1, multiplier - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-lg font-semibold hover:border-primary disabled:opacity-50"
            disabled={multiplier <= 1}
          >−</button>
          <div className="text-center">
            <div className="font-display text-3xl font-bold">{multiplier}</div>
            <div className="text-xs text-muted-foreground">Lot{multiplier > 1 ? "s" : ""}</div>
          </div>
          <button
            onClick={() => setMultiplier(Math.min(10, multiplier + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-lg font-semibold hover:border-primary disabled:opacity-50"
            disabled={multiplier >= 10}
          >+</button>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Capital & risk scale with lots</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 text-sm font-semibold">Deployment Details</div>
        <dl className="space-y-3 text-sm">
          {[
            ["Required Capital", `₹${capital.toLocaleString("en-IN")}`],
            ["Lot Multiplier", `${multiplier} Lot${multiplier > 1 ? "s" : ""}`],
            ["Max Risk Per Trade", scaledRisk],
            ["Suitable For", strategy.suitable],
            ["Strategy Type", strategy.type],
            ["Timeframe", strategy.timeframe],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 text-sm font-semibold">Before you deploy</div>
        <div className="space-y-2.5">
          {strategy.checks.map((c: string, i: number) => (
            <label key={c} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted">
              <button
                type="button"
                onClick={() => { const n = [...checks]; n[i] = !n[i]; setChecks(n); }}
                className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${checks[i] ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
              >
                {checks[i] && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
              <span className="text-sm">{c}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        disabled={!allChecked || deploying}
        onClick={deploy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deploying ? "Deploying..." : "Deploy Now"}
        {!deploying && <Rocket className="h-4 w-4" />}
      </button>
      <p className="text-center text-xs text-muted-foreground">You can stop anytime</p>
    </div>
  );
}

/* ---------- shared bits ---------- */
function Header({ title, subtitle, onBack, icon: Icon, action }: { title: string; subtitle?: string; onBack?: () => void; icon?: any; action?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      {onBack && (
        <button onClick={onBack} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-card border border-border hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "primary" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
      tone === "primary" ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
    }`}>{children}</span>
  );
}

function PrimaryNext({ disabled, onClick, label }: { disabled?: boolean; onClick: () => void; label: string }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
