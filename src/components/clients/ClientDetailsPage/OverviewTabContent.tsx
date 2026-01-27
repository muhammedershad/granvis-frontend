import { Award, Building2, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/types/client";

interface OverviewTabProps {
  client: Client;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

export function OverviewTabContent({
  client,
  isEditing,
  onInputChange,
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
          <CardHeader className="relative pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Client Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Projects
              </span>
              <span className="font-medium">{client.projectsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Active Projects
              </span>
              <span className="font-medium">{client.activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Completed Projects
              </span>
              <span className="font-medium">{client.completedProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="font-medium">
                ${client.totalProjectValue?.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
          <CardHeader className="relative pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Client Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-wrap gap-2">
              {client.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Company Name
                </Label>
                <p className="text-foreground">{client.companyName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Company Type
                </Label>
                <p className="text-foreground">{client.companyType}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Industry
                </Label>
                <p className="text-foreground">{client.industry}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Priority
                </Label>
                <Badge variant="secondary">{client.priority}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Website</Label>
                <p className="text-foreground">
                  {client.website ? (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {client.website}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Source</Label>
                <p className="text-foreground">{client.source}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-blue-500/[0.02] dark:from-cyan-400/[0.05] dark:to-blue-400/[0.05]"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              Notes & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {isEditing ? (
              <Textarea
                value={client.notes}
                onChange={(e) => onInputChange("notes", e.target.value)}
                className="bg-background/50"
                rows={4}
                placeholder="Add notes about client preferences, requirements, etc."
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {client.notes}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
