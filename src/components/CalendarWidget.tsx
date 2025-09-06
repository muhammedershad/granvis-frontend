import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

const todayDate = new Date();
const meetings = [
  {
    id: 1,
    title: "Villa Rosewood Review",
    time: "09:00 AM",
    duration: "1h",
    attendees: 4,
    type: "review",
    location: "Conference Room A"
  },
  {
    id: 2,
    title: "Client Presentation - Mall Project",
    time: "11:30 AM",
    duration: "2h",
    attendees: 8,
    type: "presentation",
    location: "Main Hall"
  },
  {
    id: 3,
    title: "Interior Design Sync",
    time: "02:00 PM",
    duration: "45m",
    attendees: 3,
    type: "sync",
    location: "Design Studio"
  },
  {
    id: 4,
    title: "Weekly Team Standup",
    time: "04:00 PM",
    duration: "30m",
    attendees: 12,
    type: "standup",
    location: "Virtual"
  }
];

const upcomingDeadlines = [
  { project: "Ocean View Villa", deadline: "2 days", priority: "high" },
  { project: "Downtown Commercial", deadline: "5 days", priority: "medium" },
  { project: "Garden Landscape", deadline: "1 week", priority: "low" }
];

export function CalendarWidget() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      {/* Light theme gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-indigo-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      
      {/* Neon glow effect - only in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground">Today's Schedule</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{todayDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center space-x-4 p-4 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg shadow-gray-100/50 dark:shadow-black/20 hover:shadow-xl hover:bg-white/80 dark:hover:bg-white/10 dark:hover:shadow-black/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className={`w-3 h-8 rounded-full ${
                  meeting.type === 'review' ? 'bg-purple-500' :
                  meeting.type === 'presentation' ? 'bg-blue-500' :
                  meeting.type === 'sync' ? 'bg-cyan-500' :
                  'bg-green-500'
                } shadow-lg`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-foreground truncate">{meeting.title}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{meeting.time}</span>
                    <span>({meeting.duration})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{meeting.attendees}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{meeting.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/40 dark:border-border pt-4">
          <h4 className="text-foreground mb-4">Upcoming Deadlines</h4>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg shadow-gray-100/50 dark:shadow-black/20">
                <div>
                  <p className="text-sm text-foreground">{deadline.project}</p>
                  <p className="text-xs text-muted-foreground">Due in {deadline.deadline}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${
                    deadline.priority === 'high' ? 'bg-red-100/80 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30' :
                    deadline.priority === 'medium' ? 'bg-yellow-100/80 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30' :
                    'bg-green-100/80 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30'
                  } shadow-sm`}
                >
                  {deadline.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}