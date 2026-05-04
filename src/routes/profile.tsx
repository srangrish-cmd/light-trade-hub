import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Bell, Shield, CreditCard, HelpCircle, LogOut, Settings, BookOpen } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const sections = [
    {
      title: "Account",
      items: [
        { icon: Settings, label: "Account Settings" },
        { icon: CreditCard, label: "Broker & Funds" },
        { icon: Bell, label: "Notifications" },
        { icon: Shield, label: "Security" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: BookOpen, label: "Learning Center" },
        { icon: HelpCircle, label: "Help & Support" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-2xl font-bold text-primary">S</div>
        <div className="flex-1">
          <div className="font-display text-lg font-bold">Sahil Kumar</div>
          <div className="text-sm text-muted-foreground">sahil@example.com</div>
        </div>
        <button className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Edit</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Algos Deployed", value: "3" },
          { label: "Total Trades", value: "25" },
          { label: "Win Rate", value: "64%" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <div className="font-display text-xl font-bold text-primary">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {sections.map((sec) => (
        <div key={sec.title}>
          <h3 className="mb-2 px-1 text-xs font-semibold tracking-wider text-muted-foreground">{sec.title.toUpperCase()}</h3>
          <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {sec.items.map((it) => (
              <button key={it.label} className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted">
                <it.icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{it.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-destructive hover:bg-destructive/5">
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}
