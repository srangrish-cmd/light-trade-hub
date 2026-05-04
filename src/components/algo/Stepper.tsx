import { Check } from "lucide-react";

const STEPS = ["Algo Type", "Strategy", "Learn", "Quiz", "Complete", "Deploy"];

export function Stepper({ current }: { current: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary-soft"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </div>
                <span className={`hidden sm:block text-[11px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-1 sm:mx-2 h-0.5 flex-1 rounded-full ${i < current ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
