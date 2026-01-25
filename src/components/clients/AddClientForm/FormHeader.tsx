import { Sparkles } from "lucide-react";

export function FormHeader() {
  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-white/5 dark:to-white/10 border border-indigo-100/50 dark:border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              New Client Intake
            </h2>
            <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">
              Lead Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
