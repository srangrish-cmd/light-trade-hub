import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Pencil, Bot, Link2 } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const indices = [
  { name: "SENSEX", value: "77,679.06", change: "765.56", pct: "1.00%", up: true },
  { name: "Nifty 50", value: "24,233.95", change: "236.40", pct: "0.99%", up: true },
  { name: "Nifty Bank", value: "55,397.25", change: "533.90", pct: "0.97%", up: true },
];

const optionChain = [
  { name: "NIFTY 50", ex: "NSE" },
  { name: "SENSEX", ex: "BSE" },
  { name: "BANKNIFTY", ex: "NSE" },
];

const gainers = [
  { name: "VALOR ESTATE LIMITED", ex: "NSE", code: "DBREALTY", price: "123.94", pct: "19.66%" },
  { name: "DR. LAL PATH LABS LTD.", ex: "NSE", code: "LALPATHLAB", price: "1,617.90", pct: "18.04%" },
  { name: "TATA MOTORS LTD.", ex: "NSE", code: "TATAMOTORS", price: "742.10", pct: "12.45%" },
];

function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 space-y-6">
      {/* Market today */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground">MARKET TODAY</h2>
          <button className="text-muted-foreground"><Pencil className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {indices.map((i) => (
            <div key={i.name} className="rounded-xl border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">{i.name}</div>
              <div className="mt-1 text-sm font-semibold">{i.value}</div>
              <div className="text-xs font-medium text-primary">{i.change} ({i.pct})</div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section>
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground">PORTFOLIO</h2>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-sm text-muted-foreground">Your holdings</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="font-display text-3xl font-bold">₹41.30</div>
            <div className="text-sm font-semibold text-primary">1.99 (5.06%)</div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">0 Open Positions</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* ALGOS — replaces Mutual Funds */}
      <section>
        <Link
          to="/strategies"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-[var(--shadow-card)]"
        >
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold">Introducing Algos</h3>
            <p className="mt-1 text-sm text-muted-foreground">Learn, test and deploy automated trading strategies — built for everyone.</p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background">
              Explore Algos <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="hidden sm:flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-soft">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <div className="flex sm:hidden h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-soft">
            <Bot className="h-8 w-8 text-primary" />
          </div>
        </Link>
      </section>

      {/* Option chain */}
      <section>
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground">OPTION CHAIN</h2>
        <div className="grid grid-cols-3 gap-3">
          {optionChain.map((o) => (
            <button key={o.name} className="rounded-xl border border-border bg-card p-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{o.name}</span>
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">{o.ex}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Market movers */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground">MARKET MOVERS</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">Nifty 500</span>
        </div>
        <div className="mb-3 flex gap-5 border-b border-border text-sm">
          <button className="border-b-2 border-primary pb-2 font-semibold">Top Gainers</button>
          <button className="pb-2 text-muted-foreground">Top Losers</button>
          <button className="pb-2 text-muted-foreground">Most active volume</button>
        </div>
        <div className="space-y-1">
          {gainers.map((g) => (
            <div key={g.name} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
                  {g.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{g.name} <span className="text-[10px] text-muted-foreground">{g.ex}</span></div>
                  <div className="text-xs text-muted-foreground">{g.code}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{g.price}</div>
                <div className="text-xs font-medium text-primary">({g.pct})</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
