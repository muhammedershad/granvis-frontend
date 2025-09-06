import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Card } from "./ui/card";

const budgetData = [
  { month: 'Jan', budget: 85000, hours: 320, spent: 78000 },
  { month: 'Feb', budget: 92000, hours: 380, spent: 85000 },
  { month: 'Mar', budget: 78000, hours: 290, spent: 72000 },
  { month: 'Apr', budget: 105000, hours: 420, spent: 95000 },
  { month: 'May', budget: 88000, hours: 350, spent: 82000 },
  { month: 'Jun', budget: 95000, hours: 380, spent: 88000 },
];

export function BudgetChart() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      {/* Light theme gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/80 via-blue-50/60 to-indigo-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      
      {/* Neon glow effect - only in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground">Budget & Hours Overview</h3>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-200/50 dark:shadow-cyan-500/20">
              <span className="text-sm text-cyan-600 dark:text-cyan-300">2024</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Legend 
                wrapperStyle={{ color: 'hsl(var(--foreground))', fontSize: '14px' }}
              />
              <Bar 
                dataKey="budget" 
                fill="#8B5CF6" 
                name="Budget ($)"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                dataKey="spent" 
                fill="#06B6D4" 
                name="Spent ($)"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100/80 to-purple-50/60 dark:from-purple-500/10 dark:to-purple-500/5 border border-purple-200/50 dark:border-purple-500/20 shadow-lg shadow-purple-100/50 dark:shadow-purple-500/10">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-xl text-foreground">$543K</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">6 months</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-100/80 to-cyan-50/60 dark:from-cyan-500/10 dark:to-cyan-500/5 border border-cyan-200/50 dark:border-cyan-500/20 shadow-lg shadow-cyan-100/50 dark:shadow-cyan-500/10">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-xl text-foreground">$500K</p>
            <p className="text-sm text-cyan-600 dark:text-cyan-400">92% used</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-100/80 to-blue-50/60 dark:from-blue-500/10 dark:to-blue-500/5 border border-blue-200/50 dark:border-blue-500/20 shadow-lg shadow-blue-100/50 dark:shadow-blue-500/10">
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-xl text-foreground">2,140h</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">6 months</p>
          </div>
        </div>
      </div>
    </Card>
  );
}