import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCommunicationIcon, mockCommunications } from "./utils";

export function CommunicationsTabContent() {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-blue-500/[0.02] dark:from-cyan-400/[0.05] dark:to-blue-400/[0.05]"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Communication History
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {mockCommunications.map((comm) => (
          <div
            key={comm.id}
            className="p-4 border border-border/50 rounded-lg bg-background/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  {getCommunicationIcon(comm.type)}
                </div>
                <div>
                  <h4 className="text-foreground">{comm.subject}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {comm.type} • {new Date(comm.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  comm.status === "completed"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                }
              >
                {comm.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-11">
              {comm.notes}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
