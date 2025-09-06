import { useState } from "react";
import { Calendar, Clock, Target, Users, DollarSign, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "paused" | "completed";
  type: "brand-awareness" | "lead-generation" | "social-media" | "content-marketing";
  targetAudience: string[];
  goals: string[];
  progress: number;
  spent: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q1 Brand Awareness Campaign",
    description: "Comprehensive brand awareness campaign targeting luxury residential market",
    budget: 50000,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "active",
    type: "brand-awareness",
    targetAudience: ["High-income families", "Real estate investors", "Luxury home buyers"],
    goals: ["Increase brand recognition by 25%", "Generate 500 new leads", "Improve website traffic by 40%"],
    progress: 65,
    spent: 32500
  },
  {
    id: "2",
    name: "Digital Lead Generation",
    description: "Multi-channel digital campaign focusing on lead generation for commercial projects",
    budget: 35000,
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    status: "active",
    type: "lead-generation",
    targetAudience: ["Commercial developers", "Business owners", "Property managers"],
    goals: ["Generate 200 qualified leads", "Achieve 15% conversion rate", "ROI of 300%"],
    progress: 45,
    spent: 15750
  },
  {
    id: "3",
    name: "Social Media Expansion",
    description: "Expanding social media presence across LinkedIn, Instagram, and YouTube",
    budget: 25000,
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    status: "active",
    type: "social-media",
    targetAudience: ["Architecture enthusiasts", "Industry professionals", "Design lovers"],
    goals: ["Reach 100k followers", "Increase engagement by 50%", "Drive website traffic"],
    progress: 30,
    spent: 7500
  },
  {
    id: "4",
    name: "Content Marketing Initiative",
    description: "Creating valuable content to educate and attract potential clients",
    budget: 20000,
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    status: "planning",
    type: "content-marketing",
    targetAudience: ["Homeowners", "Architecture students", "Design professionals"],
    goals: ["Publish 50 high-quality articles", "Generate 1000 newsletter subscribers", "Improve SEO rankings"],
    progress: 10,
    spent: 2000
  }
];

export function CampaignPlanner() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "planning": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "brand-awareness": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "lead-generation": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "social-media": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "content-marketing": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl text-foreground">${totalBudget.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl text-foreground">${totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl text-foreground">{activeCampaigns}</p>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-cyan-50/50 dark:from-gray-900/50 dark:to-cyan-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Budget Utilization</p>
            <p className="text-2xl text-foreground">{((totalSpent / totalBudget) * 100).toFixed(0)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Campaign Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-foreground">Campaign Management</h2>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10 cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-foreground mb-2">{campaign.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {campaign.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <Badge className={getTypeColor(campaign.type)}>
                    {campaign.type.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Budget Progress</span>
                    <span className="text-foreground">
                      ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                </div>

                {/* Campaign Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Campaign Progress</span>
                    <span className="text-foreground">{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {campaign.startDate}
                  </div>
                  <div>→</div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {campaign.endDate}
                  </div>
                </div>

                {/* Goals Preview */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Primary Goals:</p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.goals.slice(0, 2).map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {goal.length > 30 ? goal.substring(0, 30) + "..." : goal}
                      </Badge>
                    ))}
                    {campaign.goals.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{campaign.goals.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Detail Modal would go here */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-foreground text-2xl">{selectedCampaign.name}</CardTitle>
                  <CardDescription className="mt-2">{selectedCampaign.description}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedCampaign(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Campaign Details would be expanded here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-foreground mb-3">Target Audience</h3>
                  <div className="space-y-2">
                    {selectedCampaign.targetAudience.map((audience, index) => (
                      <Badge key={index} variant="outline">{audience}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-foreground mb-3">Campaign Goals</h3>
                  <div className="space-y-2">
                    {selectedCampaign.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-foreground">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}