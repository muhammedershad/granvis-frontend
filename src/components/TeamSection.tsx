import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Lead Architect",
    hours: "42h",
    status: "online",
    avatar: "",
    initials: "SC",
    specialty: "Residential"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Structural Engineer",
    hours: "38h",
    status: "online",
    avatar: "",
    initials: "MR",
    specialty: "Commercial"
  },
  {
    id: 3,
    name: "Elena Kozlov",
    role: "Interior Designer",
    hours: "35h",
    status: "away",
    avatar: "",
    initials: "EK",
    specialty: "Interior"
  },
  {
    id: 4,
    name: "James Mitchell",
    role: "Landscape Architect",
    hours: "29h",
    status: "online",
    avatar: "",
    initials: "JM",
    specialty: "Landscape"
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Project Manager",
    hours: "44h",
    status: "busy",
    avatar: "",
    initials: "PS",
    specialty: "Management"
  }
];

export function TeamSection() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      {/* Light theme gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      
      {/* Neon glow effect - only in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground">Team Overview</h3>
          <Badge variant="secondary" className="bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 shadow-lg shadow-blue-100/50 dark:shadow-blue-500/10">
            5 Members
          </Badge>
        </div>

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg shadow-gray-100/50 dark:shadow-black/20 hover:shadow-xl hover:bg-white/80 dark:hover:bg-white/10 dark:hover:shadow-black/30 transition-all duration-300 group">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-white/60 dark:border-white/20 shadow-lg shadow-gray-200/50 dark:shadow-black/30">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-background shadow-lg ${
                    member.status === 'online' ? 'bg-green-500' :
                    member.status === 'away' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                </div>
                
                <div>
                  <p className="text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-white/40 dark:bg-white/5 text-muted-foreground border-white/40 dark:border-border shadow-sm">
                  {member.specialty}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-foreground">{member.hours}</p>
                  <p className="text-xs text-muted-foreground">this week</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-100/80 to-blue-100/60 dark:from-purple-500/10 dark:to-blue-500/10 border border-purple-200/50 dark:border-purple-500/20 shadow-lg shadow-purple-100/50 dark:shadow-purple-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">Total Team Hours</p>
              <p className="text-sm text-muted-foreground">This week</p>
            </div>
            <div className="text-right">
              <p className="text-2xl text-foreground">188h</p>
              <p className="text-sm text-green-600 dark:text-green-400">↗ +12% vs last week</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}