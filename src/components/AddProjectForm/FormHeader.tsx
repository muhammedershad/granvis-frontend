import { Building2, Edit } from "lucide-react";

interface FormHeaderProps {
  mode?: "create" | "edit";
  projectName?: string;
}

export function FormHeader({ mode = "create", projectName }: FormHeaderProps) {
  const isEditMode = mode === "edit";

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-white/5 dark:to-white/10 border border-blue-100/50 dark:border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-400/10 dark:to-indigo-400/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl bg-gradient-to-br ${isEditMode ? "from-amber-500 to-orange-600 shadow-amber-500/20" : "from-blue-500 to-indigo-600 shadow-blue-500/20"} shadow-lg`}
          >
            {isEditMode ? (
              <Edit className="w-8 h-8 text-white" />
            ) : (
              <Building2 className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEditMode ? "Edit Project" : "New Project"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">
              {isEditMode && projectName
                ? `Editing: ${projectName}`
                : "Project Setup & Configuration"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
