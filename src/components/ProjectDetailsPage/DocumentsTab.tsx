import { FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function DocumentsTab() {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground">Project Documents</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/50 hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-foreground mb-2">No Documents Yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload project documents, drawings, and files to get started.
          </p>
          <Button
            variant="outline"
            className="bg-background/50 hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload First Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
