import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CreateClientFormData } from "@/lib/validations/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X as XIcon } from "lucide-react";

interface NotesSectionProps {
  register: UseFormRegister<CreateClientFormData>;
  errors: FieldErrors<CreateClientFormData>;
  tagsList: string[];
  setValue: UseFormSetValue<CreateClientFormData>;
  onTagsChange: (tags: string[]) => void;
}

export function NotesSection({
  register,
  errors: _errors,
  tagsList,
  setValue,
  onTagsChange,
}: NotesSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      const newTag = input.value.trim();
      if (newTag && !tagsList.includes(newTag)) {
        const updatedTags = [...tagsList, newTag];
        onTagsChange(updatedTags);
        setValue("tags", updatedTags.join(", "));
        input.value = "";
      }
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tagsList.filter((t) => t !== tag);
    onTagsChange(updatedTags);
    setValue("tags", updatedTags.join(", "));
  };

  return (
    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Internal Notes
        </Label>
        <Textarea
          {...register("notes")}
          placeholder="Enter strategic details or client preferences..."
          className="min-h-[120px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Search Tags
        </Label>
        <Input
          placeholder="Type a tag and press Enter"
          className="h-10"
          onKeyDown={handleKeyDown}
        />
        {tagsList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted/50 rounded-lg border border-border">
            {tagsList.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-md text-sm font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input type="hidden" {...register("tags")} />
      </div>
    </div>
  );
}
