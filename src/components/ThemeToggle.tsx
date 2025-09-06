import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-full bg-muted/50 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 border border-border transition-all duration-300 backdrop-blur-sm group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Background glow effect - only in dark mode */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      
      {/* Icon container with smooth transitions */}
      <div className="relative flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-yellow-400 transition-all duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 transition-all duration-300 rotate-0 scale-100" />
        )}
      </div>

      {/* Subtle ring effect on hover */}
      <div className="absolute inset-0 rounded-full ring-1 ring-border group-hover:ring-purple-500/30 dark:group-hover:ring-white/20 transition-all duration-300"></div>
    </Button>
  );
}