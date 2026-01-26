"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetEmployeesQuery } from "@/lib/api/employeesApi";
import { Employee } from "@/types/employee";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";

interface MultiSelectEmployeeProps {
  selectedEmployees: Employee[];
  onSelectionChange: (employees: Employee[]) => void;
  excludeIds?: string[];
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelectEmployee({
  selectedEmployees,
  onSelectionChange,
  excludeIds = [],
  placeholder = "Select team members...",
  disabled = false,
}: MultiSelectEmployeeProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const { data: employeesData, isFetching } = useGetEmployeesQuery(
    {
      search: debouncedSearch || undefined,
      limit: 20,
      employmentStatus: "Active",
    },
    {
      skip: !open,
    }
  );

  const employees = employeesData?.data || [];

  // Filter out already selected employees and excluded IDs
  const selectedIds = selectedEmployees.map((e) => e.id);
  const allExcludedIds = [...selectedIds, ...excludeIds];
  const availableEmployees = employees.filter(
    (e) => !allExcludedIds.includes(e.id)
  );

  const handleSelect = (employee: Employee) => {
    const newSelection = [...selectedEmployees, employee];
    onSelectionChange(newSelection);
    setSearchTerm("");
  };

  const handleRemove = (employeeId: string) => {
    const newSelection = selectedEmployees.filter((e) => e.id !== employeeId);
    onSelectionChange(newSelection);
  };

  const getDisplayName = (employee: Employee) => {
    return employee.name || `${employee.firstName} ${employee.lastName}`;
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between bg-background font-normal",
              !selectedEmployees.length && "text-muted-foreground"
            )}
          >
            {selectedEmployees.length > 0
              ? `${selectedEmployees.length} member${selectedEmployees.length > 1 ? "s" : ""} selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search employees..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isFetching ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              ) : availableEmployees.length === 0 ? (
                <CommandEmpty>
                  {employees.length === 0
                    ? "No employees found."
                    : "All matching employees already selected."}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {availableEmployees.map((employee) => (
                    <CommandItem
                      key={employee.id}
                      value={employee.id}
                      onSelect={() => handleSelect(employee)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage
                            src={
                              getCloudFrontUrl(employee.avatarKey) || undefined
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
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            selectedIds.includes(employee.id)
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

      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmployees.map((employee) => (
            <Badge key={employee.id} variant="secondary" className="gap-1 pr-1">
              <span className="truncate max-w-[150px]">
                {getDisplayName(employee)}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500 shrink-0"
                onClick={() => handleRemove(employee.id)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
