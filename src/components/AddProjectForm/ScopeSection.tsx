import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ProjectFormData } from "./schemas";
import { SearchableEmployeeSelect } from "./SearchableEmployeeSelect";
import { MultiSelectEmployee } from "./MultiSelectEmployee";
import { Employee } from "@/types/employee";

interface ScopeSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  selectedManager: Employee | null;
  onManagerSelect: (manager: Employee | null) => void;
  selectedTeamMembers: Employee[];
  onTeamMembersChange: (members: Employee[]) => void;
}

export function ScopeSection({
  register,
  errors,
  setValue,
  selectedManager,
  onManagerSelect,
  selectedTeamMembers,
  onTeamMembersChange,
}: ScopeSectionProps) {
  const handleManagerSelect = (manager: Employee | null) => {
    onManagerSelect(manager);
    if (manager) {
      const displayName =
        manager.name || `${manager.firstName} ${manager.lastName}`;
      setValue("projectManager", displayName);
      setValue("managerId", manager.id);
    } else {
      setValue("projectManager", "");
      setValue("managerId", "");
    }
  };

  const handleTeamMembersChange = (members: Employee[]) => {
    onTeamMembersChange(members);
    const names = members
      .map((m) => m.name || `${m.firstName} ${m.lastName}`)
      .join(", ");
    setValue("teamMembers", names);
    setValue(
      "teamMemberIds",
      members.map((m) => m.id)
    );
  };

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
          className="bg-background h-[120px] max-h-[120px] overflow-y-auto resize-none"
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
          <SearchableEmployeeSelect
            value={selectedManager}
            onSelect={handleManagerSelect}
            roleFilter={["manager", "admin", "super_admin"]}
            placeholder="Select project manager"
            error={errors.projectManager?.message}
          />
          <input type="hidden" {...register("projectManager")} />
          <input type="hidden" {...register("managerId")} />
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
        <MultiSelectEmployee
          selectedEmployees={selectedTeamMembers}
          onSelectionChange={handleTeamMembersChange}
          excludeIds={selectedManager ? [selectedManager.id] : []}
          placeholder="Search and select team members"
        />
        <input type="hidden" {...register("teamMembers")} />
      </div>
    </div>
  );
}
