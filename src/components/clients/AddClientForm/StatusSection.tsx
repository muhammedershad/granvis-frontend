import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateClientFormData } from "@/lib/validations/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSectionProps {
  register: UseFormRegister<CreateClientFormData>;
  errors: FieldErrors<CreateClientFormData>;
  statusValue: string;
  priorityValue: string;
  architecturalStyleValue: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onArchitecturalStyleChange: (value: string) => void;
}

export function StatusSection({
  register,
  errors: _errors,
  statusValue,
  priorityValue,
  architecturalStyleValue,
  onStatusChange,
  onPriorityChange,
  onArchitecturalStyleChange,
}: StatusSectionProps) {
  return (
    <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Client Status
        </Label>
        <Select
          value={statusValue}
          onValueChange={(v) => onStatusChange(v as any)}
        >
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Potential Lead">Potential Lead</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Priority Rank
        </Label>
        <Select
          value={priorityValue}
          onValueChange={(v) => onPriorityChange(v as any)}
        >
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2 space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Architectural Interest
        </Label>
        <Select
          value={architecturalStyleValue}
          onValueChange={onArchitecturalStyleChange}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Style Profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Modern">Modern</SelectItem>
            <SelectItem value="Contemporary">Contemporary</SelectItem>
            <SelectItem value="Traditional">Traditional</SelectItem>
            <SelectItem value="Industrial">Industrial</SelectItem>
            <SelectItem value="Scandinavian">Scandinavian</SelectItem>
            <SelectItem value="Minimalist">Minimalist</SelectItem>
            <SelectItem value="Mediterranean">Mediterranean</SelectItem>
            <SelectItem value="Sustainable">Sustainable/Green</SelectItem>
            <SelectItem value="Art Deco">Art Deco</SelectItem>
            <SelectItem value="Colonial">Colonial</SelectItem>
            <SelectItem value="Craftsman">Craftsman</SelectItem>
            <SelectItem value="Victorian">Victorian</SelectItem>
            <SelectItem value="Mid-Century Modern">
              Mid-Century Modern
            </SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {architecturalStyleValue === "Other" && (
        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Please Specify Architectural Style
          </Label>
          <Input
            {...register("architecturalStyleOther")}
            placeholder="Enter custom architectural style"
            className="h-10"
          />
        </div>
      )}
    </div>
  );
}
