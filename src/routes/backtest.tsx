import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Filter,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { STRATEGIES, type StrategyId } from "@/components/algo/types";

const searchSchema = z.object({
  id: z.enum(["momentum-breakout", "pullback-pro", "trend-continuation", "iron-condor", "range-hunter", "mean-revert"]).optional(),
});

export const Route = createFileRoute("/backtest")({
  validateSearch: searchSchema,
  component: BacktestPage,
});

type SectionId = "overview" | "performance" | "equity" | "distribution" | "trades" | "monthly" | "market" | "summary";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "performance", label: "Performance" },
  { id: "equity", label: "Equity" },
  { id: "distribution", label: "Distribution" },
  { id: "trades", label: "Trades" },
  { id: "monthly", label: "Monthly" },
  { id: "market", label: "Market" },
  { id: "summary", label: "Summary" },
];

function BacktestPage() {
  const { id } = Route.useSearch();
  const strategy = STRATEGIES.find((s) => s.id === (id as StrategyId)) ?? STRATEGIES[0];
  const [active, setActive] = useState<SectionId>("overview");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/strategies"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold leading-tight">Backtest Results</h1>
          <p className="text-xs text-muted-foreground">{strategy.name} • Jan 2022 – Apr 2024</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          27 mo
        </div>
      </div>

      {/* Section nav */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-border bg-background/90 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActive(s.id);
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                active === s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Overview />
      <Performance />
      <Equity />
      <Distribution />
      <Trades />
      <Monthly />
      <Market />
      <Summary />

      {/* CTA */}
      <div className="sticky bottom-20 z-20 pt-3">
        <Link
          to="/strategies"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" /> Deploy Strategy
        </Link>
      </div>
    </div>
  );
}

/* ============= Slide 3: Overview ============= */
function Overview() {
  return (
    <Section id="overview" title="Backtest Overview" subtitle="Quick summary of overall performance">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Total Net Profit" value="₹12,45,500" tone="positive" />
        <MetricCard label="Win Rate" value="68%" tone="positive" />
        <MetricCard label="Profit Factor" value="2.1" tone="info" />
        <MetricCard label="Max Drawdown" value="18.6%" tone="negative" />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">Equity Curve</div>
        <EquityMini />
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">
          <TrendingUp className="h-3.5 w-3.5" /> Steady growth with controlled drawdowns
        </div>
      </div>
    </Section>
  );
}

/* ============= Slide 4: Performance ============= */
function Performance() {
  const [tab, setTab] = useState<"overview" | "trades" | "monthly" | "yearly">("overview");
  return (
    <Section id="performance" title="Performance" subtitle="Deeper dive into key metrics">
      <div className="flex gap-1 rounded-xl bg-muted p-1">
        {(["overview", "trades", "monthly", "yearly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-colors ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {[
          ["Total Trades", "256"],
          ["Winning Trades", "174 (68%)"],
          ["Losing Trades", "82 (32%)"],
          ["Average Win", "₹8,450"],
          ["Average Loss", "₹4,120"],
          ["Risk Reward Ratio", "1 : 2.05"],
          ["Expectancy", "₹4,863"],
          ["Sharpe Ratio", "1.48"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-semibold">{v}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">Win Rate in Each Month</div>
        <MonthlyBars
          values={[72, 65, 58, 70, 75, 62, 80, 68, 71, 66, 74, 69]}
          tone="positive"
        />
      </div>
    </Section>
  );
}

/* ============= Slide 5: Equity & Drawdown ============= */
function Equity() {
  return (
    <Section id="equity" title="Equity & Drawdown" subtitle="Growth and drawdowns visualised">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Equity Curve</div>
          <span className="text-xs text-muted-foreground">Jan '22 – Apr '24</span>
        </div>
        <EquityMini big />
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">Drawdown</div>
        <DrawdownChart />
        <div className="mt-3 flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <TrendingDown className="h-4 w-4" />
            Maximum Drawdown
          </div>
          <span className="text-sm font-bold text-destructive">18.6%</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">From 15 Aug '22 to 10 Oct '22</p>
      </div>
    </Section>
  );
}

/* ============= Slide 6: Trade Distribution ============= */
function Distribution() {
  return (
    <Section id="distribution" title="Trade Distribution" subtitle="How trades are distributed">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">By Outcome</div>
        <div className="flex items-center gap-5">
          <Donut percent={68} />
          <div className="space-y-2 text-sm">
            <Legend color="bg-primary" label="Win" value="174 (68%)" />
            <Legend color="bg-destructive" label="Loss" value="82 (32%)" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">By Day of Week</div>
        <div className="space-y-2">
          {[
            ["Mon", 14],
            ["Tue", 17],
            ["Wed", 19],
            ["Thu", 18],
            ["Fri", 20],
          ].map(([d, v]) => (
            <div key={d as string} className="flex items-center gap-3 text-xs">
              <span className="w-8 text-muted-foreground">{d}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(v as number) * 4}%` }} />
              </div>
              <span className="w-8 text-right font-semibold">{v}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">By Time</div>
        <Heatmap />
      </div>
    </Section>
  );
}

/* ============= Slide 7: Trades ============= */
function Trades() {
  const [filter, setFilter] = useState<"all" | "wins" | "losses">("all");
  const trades = [
    { time: "24 Apr '24, 10:15 AM", type: "CE Buy", result: "win", pnl: 12450 },
    { time: "23 Apr '24, 11:05 AM", type: "CE Buy", result: "win", pnl: 7800 },
    { time: "22 Apr '24, 1:20 PM", type: "CE Buy", result: "loss", pnl: -4200 },
    { time: "19 Apr '24, 10:10 AM", type: "CE Buy", result: "win", pnl: 9150 },
    { time: "18 Apr '24, 2:35 PM", type: "CE Buy", result: "loss", pnl: -3750 },
    { time: "17 Apr '24, 11:45 AM", type: "CE Buy", result: "win", pnl: 8600 },
    { time: "16 Apr '24, 9:50 AM", type: "CE Buy", result: "win", pnl: 6300 },
  ].filter((t) => filter === "all" || (filter === "wins" ? t.result === "win" : t.result === "loss"));

  return (
    <Section id="trades" title="Trade List" subtitle="Review individual trades">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {(["all", "wins", "losses"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                filter === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "all" ? "All Trades" : t}
            </button>
          ))}
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_60px_60px_90px] gap-2 border-b border-border bg-muted/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Time</div>
          <div>Type</div>
          <div>Result</div>
          <div className="text-right">P&L</div>
        </div>
        {trades.map((t, i) => (
          <div key={i} className="grid grid-cols-[1fr_60px_60px_90px] items-center gap-2 border-b border-border px-4 py-2.5 text-xs last:border-0">
            <div className="text-muted-foreground">{t.time}</div>
            <div className="font-medium">{t.type}</div>
            <div>
              <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                t.result === "win" ? "bg-primary-soft text-accent-foreground" : "bg-destructive/10 text-destructive"
              }`}>
                {t.result === "win" ? "Win" : "Loss"}
              </span>
            </div>
            <div className={`text-right font-semibold ${t.pnl > 0 ? "text-primary" : "text-destructive"}`}>
              {t.pnl > 0 ? "+" : ""}₹{Math.abs(t.pnl).toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full rounded-xl border border-border bg-card py-2.5 text-xs font-semibold hover:bg-muted">
        Load More
      </button>
    </Section>
  );
}

/* ============= Slide 8: Monthly Performance ============= */
function Monthly() {
  const months = useMemo(
    () => [120, -45, 80, 150, 95, -30, 200, 110, 60, 175, -20, 140],
    [],
  );
  const max = Math.max(...months.map(Math.abs));
  return (
    <Section id="monthly" title="Monthly Performance" subtitle="Performance month over month">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Trophy className="h-3.5 w-3.5" /> Best Month
          </div>
          <div className="mt-1 text-sm text-muted-foreground">Mar 2024</div>
          <div className="mt-1 font-display text-lg font-bold text-primary">+₹2,45,000</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" /> Worst Month
          </div>
          <div className="mt-1 text-sm text-muted-foreground">Feb 2024</div>
          <div className="mt-1 font-display text-lg font-bold text-destructive">-₹45,000</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">Monthly P&L (₹)</div>
        <div className="flex h-32 items-end gap-1.5">
          {months.map((v, i) => {
            const h = (Math.abs(v) / max) * 100;
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                <div
                  className={`w-full rounded-sm ${v >= 0 ? "bg-primary" : "bg-destructive"}`}
                  style={{ height: `${h}%`, minHeight: "4px" }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" /> 7 of 12 months are profitable
        </div>
      </div>
    </Section>
  );
}

/* ============= Slide 9: Market Condition ============= */
function Market() {
  return (
    <Section id="market" title="Market Condition Analysis" subtitle="How strategy performs in different markets">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">Market Trend</div>
        <div className="flex items-center gap-5">
          <Donut percent={62} />
          <div className="space-y-2 text-sm">
            <Legend color="bg-primary" label="Trending" value="62%" />
            <Legend color="bg-muted-foreground/40" label="Sideways" value="22%" />
            <Legend color="bg-destructive" label="Volatile" value="16%" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 text-sm font-semibold">Performance in Each Condition</div>
        <div className="grid grid-cols-3 gap-2 border-b border-border bg-muted/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Condition</div>
          <div>Win Rate</div>
          <div className="text-right">Profit Factor</div>
        </div>
        {[
          ["Trending", "72%", "2.35", "positive"],
          ["Sideways", "61%", "1.62", "neutral"],
          ["Volatile", "58%", "1.28", "neutral"],
        ].map(([c, w, p, tone]) => (
          <div key={c} className="grid grid-cols-3 gap-2 border-b border-border px-4 py-3 text-sm last:border-0">
            <div className="font-medium">{c}</div>
            <div className={tone === "positive" ? "font-semibold text-primary" : "font-semibold"}>{w}</div>
            <div className="text-right font-semibold">{p}</div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-border bg-primary-soft p-3 text-xs">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
        <p className="text-accent-foreground">This strategy performs best in <strong>trending markets</strong>.</p>
      </div>
    </Section>
  );
}

/* ============= Slide 10: Summary ============= */
function Summary() {
  return (
    <Section id="summary" title="Backtest Summary" subtitle="Final summary before deploying">
      <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
          <Trophy className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-3 font-display text-lg font-bold">Great Results!</h3>
        <p className="mt-1 text-xs text-muted-foreground">This strategy has shown consistent performance in backtests.</p>

        <div className="mt-4 divide-y divide-border text-left">
          {[
            ["Total Net Profit", "₹12,45,500"],
            ["Win Rate", "68%"],
            ["Profit Factor", "2.1"],
            ["Max Drawdown", "18.6%"],
            ["Total Trades", "256"],
            ["Backtest Period", "Jan 2022 – Apr 2024"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ============= Building blocks ============= */
function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 space-y-3 pt-2">
      <div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "positive" | "negative" | "info" }) {
  const toneCls =
    tone === "positive"
      ? "text-primary"
      : tone === "negative"
      ? "text-destructive"
      : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className={`font-display text-2xl font-bold ${toneCls}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function EquityMini({ big = false }: { big?: boolean }) {
  // Smooth uptrending equity curve
  const points = [10, 15, 22, 18, 28, 35, 30, 42, 38, 48, 56, 52, 62, 70, 68, 78, 85, 80, 92, 100];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 600;
  const h = big ? 160 : 100;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / (max - min)) * (h - 10) - 5;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: h }}>
      <defs>
        <linearGradient id="eqGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.18 145)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.68 0.18 145)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#eqGrad)" />
      <path d={path} fill="none" stroke="oklch(0.68 0.18 145)" strokeWidth="2" />
    </svg>
  );
}

function DrawdownChart() {
  const points = [-2, -5, -3, -8, -12, -18, -15, -10, -6, -4, -7, -3, -5, -2, -4, -6, -3, -2, -5, -3];
  const min = Math.min(...points);
  const w = 600;
  const h = 110;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = (p / min) * (h - 10) + 5;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w},0 L0,0 Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: h }}>
      <defs>
        <linearGradient id="ddGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.22 25)" stopOpacity="0" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 25)" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ddGrad)" />
      <path d={path} fill="none" stroke="oklch(0.62 0.22 25)" strokeWidth="2" />
    </svg>
  );
}

function MonthlyBars({ values }: { values: number[]; tone?: "positive" | "negative" }) {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div>
      <div className="flex h-24 items-end gap-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex flex-1 items-end">
            <div className="w-full rounded-sm bg-primary" style={{ height: `${v}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

function Donut({ percent }: { percent: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
      <circle cx="40" cy="40" r={r} stroke="oklch(0.93 0.005 240)" strokeWidth="10" fill="none" />
      <circle
        cx="40"
        cy="40"
        r={r}
        stroke="oklch(0.68 0.18 145)"
        strokeWidth="10"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text x="40" y="44" textAnchor="middle" className="rotate-90 fill-foreground text-[14px] font-bold" transform="rotate(90 40 40)">
        {percent}%
      </text>
    </svg>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Heatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = 7;
  // intensity 0-3
  const data = [
    [1, 2, 3, 2, 1, 2, 1],
    [2, 3, 3, 2, 2, 1, 1],
    [1, 2, 2, 3, 2, 2, 1],
    [2, 3, 2, 3, 3, 2, 1],
    [1, 2, 2, 2, 1, 1, 1],
  ];
  const colors = ["bg-primary/10", "bg-primary/30", "bg-primary/60", "bg-primary"];
  return (
    <div>
      <div className="flex justify-between pl-10 pr-1 text-[10px] text-muted-foreground">
        {["9 AM", "11 AM", "1 PM", "3 PM"].map((t) => <span key={t}>{t}</span>)}
      </div>
      <div className="mt-2 space-y-1">
        {days.map((d, i) => (
          <div key={d} className="flex items-center gap-2">
            <span className="w-8 text-[10px] text-muted-foreground">{d}</span>
            <div className="grid flex-1 grid-cols-7 gap-1">
              {Array.from({ length: slots }).map((_, j) => (
                <div key={j} className={`h-4 rounded-sm ${colors[data[i][j]]}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>Low</span>
        {colors.map((c, i) => <div key={i} className={`h-2 w-3 rounded-sm ${c}`} />)}
        <span>High</span>
      </div>
    </div>
  );
}
