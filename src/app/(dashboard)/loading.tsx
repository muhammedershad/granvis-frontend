import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
