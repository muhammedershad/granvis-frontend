import { AlertCircle, CheckCircle, Target, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function InsightsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-foreground">Positive Trends</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Collection rate improved by 3.6% this period</li>
              <li>• Payment cycle time reduced by 4 days on average</li>
              <li>• Enterprise segment showing 18% revenue growth</li>
              <li>• Dispute rate decreased significantly (-38.2%)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-orange-50/50 dark:from-gray-900/50 dark:to-orange-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-orange-500/5 dark:shadow-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-foreground">Areas for Attention</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Commercial projects have longer payment cycles</li>
              <li>• Small business segment needs payment follow-up</li>
              <li>• Q4 typically shows seasonal slowdown</li>
              <li>• 5.5% of invoices still become overdue</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="text-foreground">Recommendations</CardTitle>
          <CardDescription>
            Actionable insights to improve payment performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-foreground mb-3">Short-term Actions</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    Implement automated payment reminders for overdue invoices
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    Offer early payment discounts to improve cash flow
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    Review payment terms for commercial projects
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-3">Long-term Strategy</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    Develop client-specific payment strategies
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    Implement predictive analytics for payment forecasting
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    Expand enterprise client base for stable revenue
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
