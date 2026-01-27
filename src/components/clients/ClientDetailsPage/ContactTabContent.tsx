import { MapPin, Settings, User, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/types/client";

interface ContactTabProps {
  client: Client;
  isEditing: boolean;
  onInputChange: (field: string, value: Client["address"] | string) => void;
}

export function ContactTabContent({
  client,
  isEditing,
  onInputChange,
}: ContactTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Primary Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <p className="text-foreground">{client.primaryContact?.name}</p>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <p className="text-foreground">{client.primaryContact?.title}</p>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-foreground">{client.primaryContact?.email}</p>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <p className="text-foreground">{client.primaryContact?.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Secondary Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <p className="text-foreground">{client.secondaryContact?.name}</p>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <p className="text-foreground">{client.secondaryContact?.title}</p>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-foreground">{client.secondaryContact?.email}</p>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <p className="text-foreground">{client.secondaryContact?.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label>Street Address</Label>
            {isEditing ? (
              <Textarea
                value={client.address.street}
                onChange={(e) =>
                  onInputChange("address", {
                    ...client.address,
                    street: e.target.value,
                  })
                }
                className="bg-background/50"
                rows={2}
              />
            ) : (
              <p className="text-foreground">{client.address.street}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <p className="text-foreground">{client.address.city}</p>
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <p className="text-foreground">{client.address.state}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ZIP Code</Label>
              <p className="text-foreground">{client.address.zipCode}</p>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <p className="text-foreground">{client.address.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-pink-500/[0.02] dark:from-purple-400/[0.05] dark:to-pink-400/[0.05]"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label>Source</Label>
            <p className="text-foreground">{client.source}</p>
          </div>
          <div className="space-y-2">
            <Label>Last Contact Date</Label>
            <p className="text-foreground">
              {client.lastContactDate
                ? new Date(client.lastContactDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Created By</Label>
            <p className="text-foreground">{client.createdBy}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
