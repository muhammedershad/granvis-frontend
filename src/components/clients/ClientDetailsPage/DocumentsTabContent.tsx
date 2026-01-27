import { FileText, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DocumentsTabContent() {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Documents & Files
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-foreground mb-2">No Documents Uploaded</h3>
          <p className="text-muted-foreground mb-4">
            Upload contracts, proposals, and other client documents.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
