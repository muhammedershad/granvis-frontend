import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Search, UserPlus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";
import { Client } from "../../types/client";
import { ProjectFormData } from "./schemas";

interface ClientSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  clients: Client[];
  selectedClient: Client | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClientSelect: (client: Client) => void;
  onAddClientClick: () => void;
}

export function ClientSection({
  register,
  errors,
  setValue: _setValue,
  clients,
  selectedClient,
  searchTerm,
  onSearchChange,
  onClientSelect,
  onAddClientClick,
}: ClientSectionProps) {
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-medium text-muted-foreground">
          Lead Client
        </Label>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-blue-600 h-auto p-0"
          onClick={onAddClientClick}
        >
          <UserPlus className="mr-1 h-3 w-3" />
          New Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search clients by name, company, or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => onClientSelect(client)}
            className={cn(
              "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
              selectedClient?.id === client.id
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                : "border-border hover:border-blue-300"
            )}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={`https://avatar.vercel.sh/${client.name}`} />
                <AvatarFallback className="text-xs">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{client.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {client.companyName}
                </p>
                <div className="flex gap-1 mt-1">
                  {client.status === "Active" && (
                    <Badge variant="outline" className="text-[9px] h-4 px-1">
                      Active
                    </Badge>
                  )}
                  {client.priority && (
                    <Badge variant="secondary" className="text-[9px] h-4 px-1">
                      {client.priority}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedClient && (
        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <div className="text-xs text-muted-foreground">Selected Client</div>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedClient.name}`}
              />
              <AvatarFallback>
                {selectedClient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedClient.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedClient.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <input type="hidden" {...register("client")} />
      {errors.client && (
        <p className="text-[10px] text-red-500">{errors.client.message}</p>
      )}
    </div>
  );
}
