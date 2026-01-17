import { Sparkles } from "lucide-react";

export function AddEmployeeFormHeader() {
  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50/50 to-pink-50/50 dark:from-white/5 dark:to-white/10 border border-orange-100/50 dark:border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 dark:from-orange-400/10 dark:to-pink-400/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              New Team Member
            </h2>
            <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">
              Employee Onboarding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
