import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card } from "./ui/card";

const projectData = [
  { name: 'Villa Projects', value: 35, color: '#8B5CF6' },
  { name: 'Commercial', value: 25, color: '#3B82F6' },
  { name: 'Interior Design', value: 20, color: '#06B6D4' },
  { name: 'Landscape', value: 20, color: '#10B981' },
];

export function ProjectOverview() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      {/* Light theme gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      
      {/* Neon glow effect - only in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground">Project Overview</h3>
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20">
            <span className="text-sm text-purple-600 dark:text-purple-300">84 Active</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ color: 'hsl(var(--foreground))', fontSize: '14px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {projectData.map((project, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg shadow-gray-100/50 dark:shadow-black/20 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300">
              <div 
                className="w-3 h-3 rounded-full shadow-lg"
                style={{ backgroundColor: project.color, boxShadow: `0 0 10px ${project.color}50` }}
              ></div>
              <div>
                <p className="text-sm text-foreground">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}