import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function DashboardCardsLoader() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-4">
              <div className="h-3 w-32 animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/40" />

              <div className="flex items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-8 w-24 animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/40" />
                  <div className="h-3 w-28 animate-pulse rounded-md bg-slate-200/40 dark:bg-slate-700/30" />
                </div>
                <div className="h-10 w-10 animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/40" />
              </div>

              <div className="mt-2 h-3 w-40 animate-pulse rounded-md bg-slate-200/40 dark:bg-slate-700/30" />
            </div>
            {/* subtle shimmer bar at bottom to match shadcn aesthetic */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/0 to-white/5 dark:from-transparent dark:to-black/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardCardsError() {
  return (
    <Alert variant="destructive" className="col-span-4 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>There was an error loading the dashboard data.</p>
      </AlertDescription>
    </Alert>
  );
}
