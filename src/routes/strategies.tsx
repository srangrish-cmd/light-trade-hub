import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronRight, Home, BookOpen, User, BarChart3, Play, Lock, Rocket, TrendingUp, TrendingDown, Activity, ShieldCheck, Sparkles } from "lucide-react";
import { Stepper } from "@/components/algo/Stepper";
import { MiniChart } from "@/components/algo/MiniChart";
import { STRATEGIES, type AlgoType, type Strategy } from "@/components/algo/types";

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
    <div className="min-h-screen bg-surface">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">A</div>
            <span className="text-lg font-display font-bold tracking-tight">Algoo</span>
          </div>
          <nav className="hidden items-center gap-7 md:flex text-sm font-medium text-muted-foreground">
            <a className="text-foreground">Home</a>
            <a>My Strategies</a>
            <a>Learn</a>
            <a>Profile</a>
          </nav>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Stepper */}
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Stepper current={step} />
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        {step === 0 && <StepAlgoType selected={algoType} onSelect={(a) => { setAlgoType(a); goto(1); }} />}
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
          <StepComplete strategy={strategy} answers={answers} onBack={() => goto(3)} onNext={() => { setChecks(strategy.checks.map(() => false)); goto(5); }} />
        )}
        {step === 5 && strategy && (
          <StepDeploy strategy={strategy} checks={checks} setChecks={setChecks} onBack={() => goto(4)} onDeployed={() => goto(0)} />
        )}
      </main>

      {/* Bottom nav (mobile feel) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: BarChart3, label: "Strategies" },
            { icon: BookOpen, label: "Learn" },
            { icon: User, label: "Profile" },
          ].map((it) => (
            <button key={it.label} className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-xs ${it.active ? "text-primary" : "text-muted-foreground"}`}>
              <it.icon className="h-5 w-5" />
              {it.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ---------- Step 0 ---------- */
function StepAlgoType({ selected, onSelect }: { selected: AlgoType | null; onSelect: (a: AlgoType) => void }) {
  const groups = [
    {
      title: "Trending Market",
      desc: "For markets showing clear direction",
      icon: TrendingUp,
      options: [
        { id: "option-buying" as AlgoType, label: "Option Buying", desc: "Buy options to profit from strong moves", tag: "BUY", tone: "up" },
        { id: "option-selling" as AlgoType, label: "Option Selling", desc: "Sell options in trending market for premium", tag: "SELL", tone: "down" },
      ],
    },
    {
      title: "Non-Trending Market",
      desc: "For sideways or range bound markets",
      icon: Activity,
      options: [
        { id: "option-selling-only" as AlgoType, label: "Option Selling Only", desc: "Sell options and collect premium in range", tag: "STILL", tone: "flat" },
      ],
    },
  ];
  return (
    <div className="space-y-6">
      <Header
        title="Select Algo Type"
        subtitle="Pick the market condition that matches your view"
      />
      {groups.map((g) => (
        <section key={g.title} className="space-y-3">
          <div className="flex items-center gap-2">
            <g.icon className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">{g.title}</h3>
            <span className="text-xs text-muted-foreground">— {g.desc}</span>
          </div>
          <div className="grid gap-3">
            {g.options.map((o) => (
              <button
                key={o.id}
                onClick={() => onSelect(o.id)}
                className={`group flex items-center gap-4 rounded-2xl border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-[var(--shadow-card)] ${
                  selected === o.id ? "border-primary ring-4 ring-primary-soft" : "border-border"
                }`}
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${o.tone === "down" ? "bg-destructive/10 text-destructive" : "bg-primary-soft text-primary"}`}>
                  <span className="text-[10px] font-bold tracking-wider">{o.tag}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{o.label}</div>
                  <div className="text-sm text-muted-foreground">{o.desc}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </section>
      ))}
      <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <div className="flex-1 text-sm">
          <div className="font-medium">Not sure which to choose?</div>
          <div className="text-muted-foreground">Learn more about market conditions</div>
        </div>
        <button className="text-sm font-semibold text-primary">Learn more</button>
      </div>
    </div>
  );
}

/* ---------- Step 1 ---------- */
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
      <div className="grid gap-4">
        {STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-xl">{s.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display text-lg font-bold">{s.name}</div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge>{s.level}</Badge>
                  <Badge tone="primary">{s.probability}</Badge>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.tagline}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
                <div className="text-2xl font-display font-bold text-primary">{s.winRate}%</div>
              </div>
              <div className="w-32">
                <MiniChart trend="up" />
              </div>
            </div>
          </button>
        ))}
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
      <Header title={strategy.name} subtitle="Learn the strategy in 3 short lessons" onBack={onBack} action={<Bookmark className="h-5 w-5 text-muted-foreground" />} />

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
        <div className="mb-3 text-sm font-semibold">Deployment Details</div>
        <dl className="space-y-3 text-sm">
          {[
            ["Required Capital", `₹${strategy.capital.toLocaleString("en-IN")}`],
            ["Lot Multiplier", `${strategy.lots} Lot`],
            ["Max Risk Per Trade", strategy.maxRisk],
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
