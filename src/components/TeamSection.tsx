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
    <Card className="backdrop-blur-xl bg-black/20 border-white/10 p-6 relative overflow-hidden">
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white/90">Team Overview</h3>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            5 Members
          </Badge>
        </div>

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-white/20">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                    member.status === 'online' ? 'bg-green-500' :
                    member.status === 'away' ? 'bg-yellow-500' :
                    'bg-red-500'
                  } shadow-lg`}></div>
                </div>
                
                <div>
                  <p className="text-white/90">{member.name}</p>
                  <p className="text-sm text-white/60">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-white/5 text-white/70 border-white/20">
                  {member.specialty}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-white/90">{member.hours}</p>
                  <p className="text-xs text-white/60">this week</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90">Total Team Hours</p>
              <p className="text-sm text-white/60">This week</p>
            </div>
            <div className="text-right">
              <p className="text-2xl text-white/90">188h</p>
              <p className="text-sm text-green-400">↗ +12% vs last week</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}