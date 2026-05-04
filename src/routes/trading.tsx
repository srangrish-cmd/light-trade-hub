import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Pause, Play, Square, TrendingUp, Plus, Rocket, FlaskConical, ArrowDownRight, ArrowUpRight, ShieldAlert, Target, Clock, Info } from "lucide-react";

export const Route = createFileRoute("/trading")({ component: Trading });

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
  { id: "1", name: "Momentum Breakout", type: "Trending • Option Buying", mode: "live", pnl: 4250, pnlPct: 4.25, trades: 12, winRate: 67, capital: 100000, deployedAt: "2d ago" },
  { id: "2", name: "Pullback Pro", type: "Trending • Option Buying", mode: "forward", pnl: 1820, pnlPct: 1.21, trades: 8, winRate: 62, capital: 150000, deployedAt: "5d ago" },
  { id: "3", name: "Trend Continuation", type: "Trending • Option Buying", mode: "live", pnl: -640, pnlPct: -0.32, trades: 5, winRate: 40, capital: 200000, deployedAt: "1d ago" },
  { id: "4", name: "Iron Condor", type: "Non-Trending • Option Selling", mode: "stopped", pnl: 0, pnlPct: 0, trades: 0, winRate: 0, capital: 250000, deployedAt: "—" },
];

function Trading() {
  const [filter, setFilter] = useState<"all" | Mode>("all");
  const list = filter === "all" ? DEPLOYMENTS : DEPLOYMENTS.filter((d) => d.mode === filter);

  const totalPnl = DEPLOYMENTS.reduce((s, d) => s + d.pnl, 0);
  const liveCount = DEPLOYMENTS.filter((d) => d.mode === "live").length;
  const forwardCount = DEPLOYMENTS.filter((d) => d.mode === "forward").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Trading</h1>
        <p className="text-sm text-muted-foreground">Live & forward-tested deployments of your algos</p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="text-sm text-muted-foreground">Total P&L (today)</div>
        <div className={`mt-1 font-display text-3xl font-bold ${totalPnl >= 0 ? "text-primary" : "text-destructive"}`}>
          {totalPnl >= 0 ? "+" : ""}₹{totalPnl.toLocaleString("en-IN")}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <Stat label="Live" value={liveCount} icon={Rocket} />
          <Stat label="Forward Test" value={forwardCount} icon={FlaskConical} />
          <Stat label="Stopped" value={DEPLOYMENTS.length - liveCount - forwardCount} icon={Square} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {(["all", "live", "forward", "stopped"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "live" ? "Live" : f === "forward" ? "Forward Test" : "Stopped"}
          </button>
        ))}
      </div>

      {/* Deployments */}
      <div className="space-y-3">
        {list.map((d) => (
          <div key={d.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold">{d.name}</h3>
                  <ModeBadge mode={d.mode} />
                </div>
                <p className="text-xs text-muted-foreground">{d.type}</p>
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
                {d.mode === "stopped" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <div className="text-xs text-muted-foreground">P&L</div>
                <div className={`text-sm font-bold ${d.pnl > 0 ? "text-primary" : d.pnl < 0 ? "text-destructive" : ""}`}>
                  {d.pnl > 0 ? "+" : ""}₹{d.pnl.toLocaleString("en-IN")}
                  <span className="ml-1 text-xs font-medium">({d.pnlPct >= 0 ? "+" : ""}{d.pnlPct}%)</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Trades</div>
                <div className="text-sm font-semibold">{d.trades}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
                <div className="text-sm font-semibold">{d.winRate}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Capital</div>
                <div className="text-sm font-semibold">₹{d.capital.toLocaleString("en-IN")}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Deployed {d.deployedAt}</span>
              <button className="font-semibold text-primary">View details →</button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
            <div className="mt-3 font-semibold">No deployments here</div>
            <p className="text-sm text-muted-foreground">Try a different filter or deploy a new algo.</p>
          </div>
        )}
      </div>

      <Link
        to="/strategies"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" /> Deploy a new algo
      </Link>
    </div>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  const map = {
    live: { label: "LIVE", cls: "bg-primary text-primary-foreground" },
    forward: { label: "FORWARD", cls: "bg-secondary text-secondary-foreground border border-border" },
    stopped: { label: "STOPPED", cls: "bg-muted text-muted-foreground" },
  } as const;
  const m = map[mode];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${m.cls}`}>{m.label}</span>;
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}
