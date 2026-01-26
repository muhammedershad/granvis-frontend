"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Crown, Loader2, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../ui/utils";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetEmployeesQuery,
  useGetManagersQuery,
} from "@/lib/api/employeesApi";
import { useUpdateProjectMutation } from "@/lib/api/projectsApi";
import { Employee } from "@/types/employee";
import type { Project } from "@/types/project";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";
import { toast } from "sonner";

interface EditTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSuccess?: () => void;
}

const getDisplayName = (employee: Employee) => {
  return employee.name || `${employee.firstName} ${employee.lastName}`;
};

export function EditTeamModal({
  open,
  onOpenChange,
  project,
  onSuccess,
}: EditTeamModalProps) {
  const [selectedManager, setSelectedManager] = useState<Employee | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Employee[]>([]);
  const [managerPopoverOpen, setManagerPopoverOpen] = useState(false);
  const [membersPopoverOpen, setMembersPopoverOpen] = useState(false);
  const [managerSearchTerm, setManagerSearchTerm] = useState("");
  const [membersSearchTerm, setMembersSearchTerm] = useState("");

  const debouncedMembersSearch = useDebounce(membersSearchTerm, 500);

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // Fetch managers for the manager dropdown
  const { data: managersData, isFetching: isFetchingManagers } =
    useGetManagersQuery(undefined, { skip: !managerPopoverOpen });

  // Fetch employees for the team members dropdown
  const { data: employeesData, isFetching: isFetchingEmployees } =
    useGetEmployeesQuery(
      {
        search: debouncedMembersSearch || undefined,
        limit: 20,
        employmentStatus: "Active",
      },
      { skip: !membersPopoverOpen }
    );

  // Fetch all employees to populate initial selection based on IDs
  const { data: allEmployeesData } = useGetEmployeesQuery(
    {
      limit: 100,
      employmentStatus: "Active",
    },
    { skip: !open }
  );

  // Initialize selections when modal opens
  useEffect(() => {
    if (open && allEmployeesData?.data) {
      // Find manager from employees list
      const manager = allEmployeesData.data.find(
        (e) => e.id === project.managerId
      );
      setSelectedManager(manager || null);

      // Find team members from employees list
      if (project.teamMemberIds && project.teamMemberIds.length > 0) {
        const members = allEmployeesData.data.filter((e) =>
          project.teamMemberIds?.includes(e.id)
        );
        setSelectedMembers(members);
      } else {
        setSelectedMembers([]);
      }
    }
  }, [open, allEmployeesData, project.managerId, project.teamMemberIds]);

  // Filter managers based on search
  const filteredManagers = useMemo(() => {
    const managers = managersData || [];
    if (!managerSearchTerm) {
      return managers;
    }
    const lowerSearch = managerSearchTerm.toLowerCase();
    return managers.filter(
      (emp) =>
        emp.firstName?.toLowerCase().includes(lowerSearch) ||
        emp.lastName?.toLowerCase().includes(lowerSearch) ||
        emp.name?.toLowerCase().includes(lowerSearch) ||
        emp.email?.toLowerCase().includes(lowerSearch)
    );
  }, [managersData, managerSearchTerm]);

  // Get available employees (exclude manager and already selected members)
  const availableEmployees = useMemo(() => {
    const employees = employeesData?.data || [];
    const excludeIds = [
      selectedManager?.id,
      ...selectedMembers.map((m) => m.id),
    ].filter(Boolean) as string[];
    return employees.filter((e) => !excludeIds.includes(e.id));
  }, [employeesData, selectedManager, selectedMembers]);

  const handleSelectManager = (employee: Employee) => {
    setSelectedManager(employee);
    setManagerPopoverOpen(false);
    setManagerSearchTerm("");
  };

  const handleSelectMember = (employee: Employee) => {
    setSelectedMembers((prev) => [...prev, employee]);
    setMembersSearchTerm("");
  };

  const handleRemoveMember = (employeeId: string) => {
    setSelectedMembers((prev) => prev.filter((e) => e.id !== employeeId));
  };

  const handleSave = async () => {
    if (!selectedManager) {
      toast.error("Please select a project manager");
      return;
    }

    try {
      await updateProject({
        id: project.id,
        data: {
          managerId: selectedManager.id,
          projectManager: getDisplayName(selectedManager),
          teamMemberIds: selectedMembers.map((m) => m.id),
          teamMembers: selectedMembers.map((m) => getDisplayName(m)),
        },
      }).unwrap();

      toast.success("Team updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update team");
      console.error("Failed to update team:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setManagerSearchTerm("");
    setMembersSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Edit Project Team
          </DialogTitle>
          <DialogDescription>
            Update the project manager and team members for this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Manager Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Crown className="h-4 w-4 text-amber-500" />
              Project Manager
            </Label>
            <Popover
              open={managerPopoverOpen}
              onOpenChange={setManagerPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={managerPopoverOpen}
                  className={cn(
                    "w-full justify-between bg-background font-normal",
                    !selectedManager && "text-muted-foreground"
                  )}
                >
                  {selectedManager ? (
                    <div className="flex items-center gap-2 truncate">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage
                          src={
                            getCloudFrontUrl(selectedManager.avatarKey) ||
                            undefined
                          }
                          alt={getDisplayName(selectedManager)}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-[10px] font-medium">
                          {selectedManager.firstName?.[0]}
                          {selectedManager.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">
                        {getDisplayName(selectedManager)}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        ({selectedManager.position})
                      </span>
                    </div>
                  ) : (
                    "Select project manager..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search managers..."
                    value={managerSearchTerm}
                    onValueChange={setManagerSearchTerm}
                  />
                  <CommandList>
                    {isFetchingManagers ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Loading...
                        </span>
                      </div>
                    ) : filteredManagers.length === 0 ? (
                      <CommandEmpty>No managers found.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredManagers.map((employee) => (
                          <CommandItem
                            key={employee.id}
                            value={employee.id}
                            onSelect={() => handleSelectManager(employee)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage
                                  src={
                                    getCloudFrontUrl(employee.avatarKey) ||
                                    undefined
                                  }
                                  alt={getDisplayName(employee)}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-xs font-medium">
                                  {employee.firstName?.[0]}
                                  {employee.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate">
                                  {getDisplayName(employee)}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {employee.position} • {employee.department}
                                </span>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  selectedManager?.id === employee.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          {/* Team Members Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-purple-500" />
              Team Members
            </Label>
            <Popover
              open={membersPopoverOpen}
              onOpenChange={setMembersPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={membersPopoverOpen}
                  className={cn(
                    "w-full justify-between bg-background font-normal",
                    !selectedMembers.length && "text-muted-foreground"
                  )}
                >
                  {selectedMembers.length > 0
                    ? `${selectedMembers.length} member${selectedMembers.length > 1 ? "s" : ""} selected`
                    : "Add team members..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search employees..."
                    value={membersSearchTerm}
                    onValueChange={setMembersSearchTerm}
                  />
                  <CommandList>
                    {isFetchingEmployees ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Searching...
                        </span>
                      </div>
                    ) : availableEmployees.length === 0 ? (
                      <CommandEmpty>
                        {(employeesData?.data || []).length === 0
                          ? "No employees found."
                          : "All matching employees already selected."}
                      </CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {availableEmployees.map((employee) => (
                          <CommandItem
                            key={employee.id}
                            value={employee.id}
                            onSelect={() => handleSelectMember(employee)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage
                                  src={
                                    getCloudFrontUrl(employee.avatarKey) ||
                                    undefined
                                  }
                                  alt={getDisplayName(employee)}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-xs font-medium">
                                  {employee.firstName?.[0]}
                                  {employee.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate">
                                  {getDisplayName(employee)}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {employee.position} • {employee.department}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Members List */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs text-muted-foreground">
                  Selected team members:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((employee) => (
                    <Badge
                      key={employee.id}
                      variant="secondary"
                      className="gap-1.5 pr-1 pl-1"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={
                            getCloudFrontUrl(employee.avatarKey) || undefined
                          }
                          alt={getDisplayName(employee)}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-[8px] font-medium">
                          {employee.firstName?.[0]}
                          {employee.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[120px]">
                        {getDisplayName(employee)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(employee.id)}
                        className="ml-1 hover:bg-muted rounded p-0.5"
                      >
                        <X className="h-3 w-3 cursor-pointer hover:text-red-500 shrink-0" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedMembers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No team members selected. Click above to add members.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
