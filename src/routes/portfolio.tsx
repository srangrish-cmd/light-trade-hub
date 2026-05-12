import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, Trophy, Activity, Plus, Pause, Play, ChevronRight, ArrowUpRight, ArrowDownRight, Target, ShieldAlert, Clock } from "lucide-react";

export const Route = createFileRoute("/portfolio")({ component: Portfolio });

type Mode = "live" | "forward" | "stopped";

interface Deployment {
  id: string;
  name: string;
  type: string;
  mode: Mode;
  pnl: number;
  pnlPct: number;
  trades: number;
  winRate: number;
  capital: number;
  deployedAt: string;
}

const DEPLOYMENTS: Deployment[] = [
  { id: "1", name: "Momentum Breakout", type: "Trending • Option Buying", mode: "live", pnl: 12480, pnlPct: 12.48, trades: 42, winRate: 67, capital: 100000, deployedAt: "12d ago" },
  { id: "2", name: "Pullback Pro",     type: "Trending • Option Buying", mode: "live", pnl: 7820,  pnlPct: 5.21,  trades: 28, winRate: 62, capital: 150000, deployedAt: "9d ago" },
  { id: "3", name: "Trend Continuation",type: "Trending • Option Buying", mode: "forward", pnl: -1640, pnlPct: -0.82, trades: 11, winRate: 45, capital: 200000, deployedAt: "4d ago" },
  { id: "4", name: "Iron Condor",      type: "Non-Trending • Option Selling", mode: "live", pnl: 4560, pnlPct: 1.82, trades: 9,  winRate: 78, capital: 250000, deployedAt: "6d ago" },
  { id: "5", name: "Range Hunter",     type: "Non-Trending • Option Selling", mode: "stopped", pnl: 0, pnlPct: 0,    trades: 0,  winRate: 0,  capital: 100000, deployedAt: "—" },
];

// 30-day deterministic equity curve
function buildEquity(start = 800000, days = 30) {
  const out: { d: number; v: number }[] = [];
  let v = start;
  for (let i = 0; i < days; i++) {
    const wiggle = Math.sin(i * 0.7) * 4200 + Math.cos(i * 0.3) * 2600 + (i * 850);
    v = start + wiggle;
    out.push({ d: i, v });
  }
  return out;
}

function Portfolio() {
  const [range, setRange] = useState<"1W" | "1M" | "3M" | "ALL">("1M");
  const equity = useMemo(() => buildEquity(800000, range === "1W" ? 7 : range === "1M" ? 30 : range === "3M" ? 90 : 180), [range]);

  const totalCapital = DEPLOYMENTS.reduce((s, d) => s + d.capital, 0);
  const totalPnl = DEPLOYMENTS.reduce((s, d) => s + d.pnl, 0);
  const todayPnl = 4250;
  const livePnlPct = (totalPnl / totalCapital) * 100;
  const liveCount = DEPLOYMENTS.filter((d) => d.mode === "live").length;

  const top = [...DEPLOYMENTS].sort((a, b) => b.pnlPct - a.pnlPct)[0];

  const min = Math.min(...equity.map((p) => p.v));
  const max = Math.max(...equity.map((p) => p.v));
  const path = equity
    .map((p, i) => {
      const x = (i / (equity.length - 1)) * 100;
      const y = 100 - ((p.v - min) / (max - min || 1)) * 100;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const area = `${path} L100,100 L0,100 Z`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Portfolio</h1>
        <p className="text-sm text-muted-foreground">Your live capital, PnL and deployed strategies</p>
      </div>

      {/* Equity Card */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Portfolio value</div>
            <div className="mt-1 font-display text-3xl font-bold">
              ₹{(totalCapital + totalPnl).toLocaleString("en-IN")}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className={`inline-flex items-center gap-0.5 font-semibold ${totalPnl >= 0 ? "text-primary" : "text-destructive"}`}>
                {totalPnl >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {totalPnl >= 0 ? "+" : ""}₹{totalPnl.toLocaleString("en-IN")} ({livePnlPct.toFixed(2)}%)
              </span>
              <span className="text-xs text-muted-foreground">all-time</span>
            </div>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs font-semibold">
            {(["1W", "1M", "3M", "ALL"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-2.5 py-1 transition ${range === r ? "bg-background text-foreground shadow" : "text-muted-foreground"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 h-40 w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="eqg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#eqg)" />
            <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <KPI label="Today's PnL" value={`${todayPnl >= 0 ? "+" : ""}₹${todayPnl.toLocaleString("en-IN")}`} positive={todayPnl >= 0} icon={Activity} />
          <KPI label="Capital deployed" value={`₹${(totalCapital / 100000).toFixed(1)}L`} icon={Wallet} />
          <KPI label="Live algos" value={`${liveCount}`} icon={TrendingUp} />
        </div>
      </section>

      {/* Top Performer */}
      {top && (
        <section className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft to-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">Top performer</div>
              <div className="font-display text-lg font-bold">{top.name}</div>
              <div className="text-xs text-muted-foreground">{top.type}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-primary">+{top.pnlPct.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">+₹{top.pnl.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </section>
      )}

      {/* Deployed Strategies */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Deployed strategies</h2>
          <Link to="/strategies" className="text-xs font-semibold text-primary">Browse more →</Link>
        </div>

        {DEPLOYMENTS.map((d) => (
          <div key={d.id} className="rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold">{d.name}</h3>
                  <ModeBadge mode={d.mode} />
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{d.type}</p>
              </div>
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
                {d.mode === "stopped" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              <Cell label="PnL" value={
                <span className={d.pnl > 0 ? "text-primary" : d.pnl < 0 ? "text-destructive" : ""}>
                  {d.pnl > 0 ? "+" : ""}₹{(d.pnl / 1000).toFixed(1)}k
                </span>
              } sub={`${d.pnlPct >= 0 ? "+" : ""}${d.pnlPct}%`} subPositive={d.pnlPct >= 0} />
              <Cell label="Trades" value={d.trades} />
              <Cell label="Win" value={`${d.winRate}%`} />
              <Cell label="Capital" value={`₹${(d.capital / 100000).toFixed(1)}L`} />
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Deployed {d.deployedAt}</span>
              <button className="inline-flex items-center gap-0.5 font-semibold text-primary">
                Details <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <Link
        to="/strategies"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" /> Deploy a new algo
      </Link>
    </div>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  const map = {
    live:    { label: "LIVE",     cls: "bg-primary text-primary-foreground" },
    forward: { label: "FORWARD",  cls: "bg-secondary text-secondary-foreground border border-border" },
    stopped: { label: "STOPPED",  cls: "bg-muted text-muted-foreground" },
  } as const;
  const m = map[mode];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${m.cls}`}>{m.label}</span>;
}

function KPI({ label, value, positive, icon: Icon }: { label: string; value: string; positive?: boolean; icon: any }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className={`text-sm font-bold ${positive === false ? "text-destructive" : positive === true ? "text-primary" : ""}`}>{value}</div>
      </div>
    </div>
  );
}

function Cell({ label, value, sub, subPositive }: { label: string; value: React.ReactNode; sub?: string; subPositive?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-bold">{value}</div>
      {sub && <div className={`text-[10px] font-medium ${subPositive ? "text-primary" : "text-destructive"}`}>{sub}</div>}
    </div>
  );
}
