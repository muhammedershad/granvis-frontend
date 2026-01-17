import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ProjectFormData } from "./schemas";

interface LocationSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  tagsList: string[];
  setTagsList: (list: string[]) => void;
}

export function LocationSection({
  register,
  errors: _errors,
  setValue,
  tagsList,
  setTagsList,
}: LocationSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-3">
        <Label
          htmlFor="address"
          className="text-xs font-medium text-muted-foreground"
        >
          Address
        </Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="Street address of project site"
          className="bg-background"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="city"
            className="text-xs font-medium text-muted-foreground"
          >
            City
          </Label>
          <Input id="city" {...register("city")} className="bg-background" />
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="state"
            className="text-xs font-medium text-muted-foreground"
          >
            State
          </Label>
          <Input id="state" {...register("state")} className="bg-background" />
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="country"
            className="text-xs font-medium text-muted-foreground"
          >
            Country
          </Label>
          <Input
            id="country"
            {...register("country")}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground">
          Tags
        </Label>
        <Input
          placeholder="Add tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const input = e.currentTarget;
              const newTag = input.value.trim();
              if (newTag && !tagsList.includes(newTag)) {
                const updatedTags = [...tagsList, newTag];
                setTagsList(updatedTags);
                setValue("tags", updatedTags.join(", "));
                input.value = "";
              }
            }
          }}
          className="bg-background"
        />
        {tagsList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tagsList.map((tag, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    const updatedTags = tagsList.filter((t) => t !== tag);
                    setTagsList(updatedTags);
                    setValue("tags", updatedTags.join(", "));
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
        <input type="hidden" {...register("tags")} />
      </div>
    </div>
  );
}
