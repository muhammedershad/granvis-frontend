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
    <Card className="backdrop-blur-xl bg-black/20 border-white/10 p-6 relative overflow-hidden">
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white/90">Budget & Hours Overview</h3>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30">
              <span className="text-sm text-cyan-300">2024</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#ffffff80', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#ffffff80', fontSize: 12 }}
              />
              <Legend 
                wrapperStyle={{ color: '#fff', fontSize: '14px' }}
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
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <p className="text-sm text-white/60">Total Budget</p>
            <p className="text-xl text-white/90">$543K</p>
            <p className="text-sm text-purple-400">6 months</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
            <p className="text-sm text-white/60">Total Spent</p>
            <p className="text-xl text-white/90">$500K</p>
            <p className="text-sm text-cyan-400">92% used</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
            <p className="text-sm text-white/60">Total Hours</p>
            <p className="text-xl text-white/90">2,140h</p>
            <p className="text-sm text-blue-400">6 months</p>
          </div>
        </div>
      </div>
    </Card>
  );
}