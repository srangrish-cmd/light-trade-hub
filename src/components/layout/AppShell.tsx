import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BarChart3, Activity, User, Search, Bell } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/strategies", label: "Strategies", icon: BarChart3 },
  { to: "/trading", label: "Trading", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">A</div>
            <span className="text-lg font-display font-bold tracking-tight">Algoo</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex text-sm font-medium">
            {TABS.map((t) => {
              const active = t.to === "/" ? path === "/" : path.startsWith(t.to);
              return (
                <Link key={t.to} to={t.to} className={active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
                  {t.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
              <Search className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary">S</div>
          </div>
        </div>
      </header>

      <main className="pb-24 md:pb-10">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {TABS.map((t) => {
            const active = t.to === "/" ? path === "/" : path.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
