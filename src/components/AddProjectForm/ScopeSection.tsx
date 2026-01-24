import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { ProjectFormData } from "./schemas";

interface ScopeSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  teamList: string[];
  setTeamList: (list: string[]) => void;
}

export function ScopeSection({
  register,
  errors,
  setValue,
  teamList,
  setTeamList,
}: ScopeSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-3">
        <Label
          htmlFor="requirements"
          className="text-xs font-medium text-muted-foreground"
        >
          Client Requirements *
        </Label>
        <Textarea
          id="requirements"
          {...register("requirements")}
          placeholder="List key requirements and deliverables..."
          className="bg-background min-h-[100px]"
        />
        {errors.requirements && (
          <p className="text-[10px] text-red-500">
            {errors.requirements.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="projectManager"
            className="text-xs font-medium text-muted-foreground"
          >
            Project Manager *
          </Label>
          <Input
            id="projectManager"
            {...register("projectManager")}
            placeholder="Lead Architect / Manager"
            className="bg-background"
          />
          {errors.projectManager && (
            <p className="text-[10px] text-red-500">
              {errors.projectManager.message}
            </p>
          )}
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="currentPhase"
            className="text-xs font-medium text-muted-foreground"
          >
            Current Phase
          </Label>
          <Input
            id="currentPhase"
            {...register("currentPhase")}
            placeholder="e.g. Initial Design"
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground">
          Team Members
        </Label>
        <Input
          placeholder="Add member and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const input = e.currentTarget;
              const newMember = input.value.trim();
              if (newMember && !teamList.includes(newMember)) {
                const updatedTeam = [...teamList, newMember];
                setTeamList(updatedTeam);
                setValue("teamMembers", updatedTeam.join(", "));
                input.value = "";
              }
            }
          }}
          className="bg-background"
        />
        {teamList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {teamList.map((member, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {member}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    const updatedTeam = teamList.filter((t) => t !== member);
                    setTeamList(updatedTeam);
                    setValue("teamMembers", updatedTeam.join(", "));
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
        <input type="hidden" {...register("teamMembers")} />
      </div>
    </div>
  );
}
