"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
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
import {
  useGetEmployeesQuery,
  useGetManagersQuery,
} from "@/lib/api/employeesApi";
import { Employee } from "@/types/employee";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";

interface SearchableEmployeeSelectProps {
  value?: Employee | null;
  onSelect: (employee: Employee | null) => void;
  roleFilter?: string[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function SearchableEmployeeSelect({
  value,
  onSelect,
  roleFilter,
  placeholder = "Select employee...",
  error,
  disabled = false,
}: SearchableEmployeeSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Check if we're filtering for manager-type roles
  const isManagerFilter = roleFilter?.some((r) =>
    ["manager", "admin", "super_admin"].includes(r)
  );

  // Use managers endpoint for manager roles, otherwise use general employees endpoint
  const { data: managersData, isFetching: isFetchingManagers } =
    useGetManagersQuery(undefined, { skip: !open || !isManagerFilter });

  const { data: employeesData, isFetching: isFetchingEmployees } =
    useGetEmployeesQuery(
      {
        search: debouncedSearch || undefined,
        limit: 20,
        employmentStatus: "Active",
      },
      { skip: !open || isManagerFilter }
    );

  const isFetching = isFetchingManagers || isFetchingEmployees;

  // Filter employees based on search term (client-side for managers endpoint)
  const employees = useMemo(() => {
    if (isManagerFilter) {
      const managers = managersData || [];
      if (!searchTerm) {
        return managers;
      }
      const lowerSearch = searchTerm.toLowerCase();
      return managers.filter(
        (emp) =>
          emp.firstName?.toLowerCase().includes(lowerSearch) ||
          emp.lastName?.toLowerCase().includes(lowerSearch) ||
          emp.name?.toLowerCase().includes(lowerSearch) ||
          emp.email?.toLowerCase().includes(lowerSearch)
      );
    }
    return employeesData?.data || [];
  }, [isManagerFilter, managersData, employeesData, searchTerm]);

  const handleSelect = (employee: Employee) => {
    onSelect(employee);
    setOpen(false);
    setSearchTerm("");
  };

  const getDisplayName = (employee: Employee) => {
    return employee.name || `${employee.firstName} ${employee.lastName}`;
  };

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between bg-background font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            {value ? (
              <div className="flex items-center gap-2 truncate">
                <Avatar className="h-5 w-5 shrink-0">
                  <AvatarImage
                    src={getCloudFrontUrl(value.avatarKey) || undefined}
                    alt={getDisplayName(value)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-[10px] font-medium">
                    {value.firstName?.[0]}
                    {value.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{getDisplayName(value)}</span>
                <span className="text-xs text-muted-foreground truncate">
                  ({value.position})
                </span>
              </div>
            ) : (
              placeholder
            )}
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
              ) : employees.length === 0 ? (
                <CommandEmpty>No employees found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {employees.map((employee) => (
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
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
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
                            value?.id === employee.id
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
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
