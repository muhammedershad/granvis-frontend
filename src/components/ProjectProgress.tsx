import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Building, Home, Palette, Trees, Clock, DollarSign } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Ocean View Villa",
    type: "villa",
    progress: 78,
    status: "On Track",
    budget: "$2.4M",
    deadline: "Dec 2024",
    icon: Home,
    color: "purple"
  },
  {
    id: 2,
    name: "Downtown Commercial Hub",
    type: "commercial",
    progress: 45,
    status: "In Progress",
    budget: "$8.2M",
    deadline: "Mar 2025",
    icon: Building,
    color: "blue"
  },
  {
    id: 3,
    name: "Modern Apartment Interior",
    type: "interior",
    progress: 92,
    status: "Near Completion",
    budget: "$650K",
    deadline: "Nov 2024",
    icon: Palette,
    color: "cyan"
  },
  {
    id: 4,
    name: "Botanical Garden Design",
    type: "landscape",
    progress: 34,
    status: "Planning",
    budget: "$1.8M",
    deadline: "Jun 2025",
    icon: Trees,
    color: "green"
  }
];

export function ProjectProgress() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "In Progress": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Near Completion": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Planning": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case "villa": return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "commercial": return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "interior": return "bg-gradient-to-r from-cyan-500 to-cyan-600";
      case "landscape": return "bg-gradient-to-r from-green-500 to-green-600";
      default: return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-black/20 border-white/10 p-6 relative overflow-hidden">
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-green-500/5"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white/90">Active Projects</h3>
          <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
            {projects.length} Projects
          </Badge>
        </div>

        <div className="space-y-6">
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <div key={project.id} className="p-5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                      project.color === 'purple' ? 'from-purple-500 to-purple-600' :
                      project.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      project.color === 'cyan' ? 'from-cyan-500 to-cyan-600' :
                      'from-green-500 to-green-600'
                    } flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white/90">{project.name}</h4>
                      <p className="text-sm text-white/60 capitalize">{project.type} Project</p>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">Progress</span>
                    <span className="text-sm text-white/90">{project.progress}%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={project.progress} 
                      className="h-2 bg-white/10"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(project.type)} transition-all duration-500 shadow-lg`}
                      style={{ width: `${project.progress}%`, boxShadow: `0 0 10px ${project.color}50` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-white/60">
                    <DollarSign className="w-4 h-4" />
                    <span>{project.budget}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>{project.deadline}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90">Overall Progress</p>
              <p className="text-sm text-white/60">All active projects</p>
            </div>
            <div className="text-right">
              <p className="text-2xl text-white/90">62%</p>
              <p className="text-sm text-purple-400">↗ +8% this month</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}