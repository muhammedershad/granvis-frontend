"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { cn } from "@/components/ui/utils";

export interface SelectedFile {
  id: string;
  file: File;
  preview?: string; // object URL for images
}

function isImageFile(type: string) {
  return type.startsWith("image/");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// --- Full upload area for dialogs ---

interface FileUploadAreaProps {
  files: SelectedFile[];
  onChange: (files: SelectedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  compact?: boolean;
}

export function FileUploadArea({
  files,
  onChange,
  maxFiles = 10,
  maxSizeMB = 10,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.zip,.rar",
  compact = false,
}: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: SelectedFile[] = [];
      const maxBytes = maxSizeMB * 1024 * 1024;

      for (let i = 0; i < fileList.length; i++) {
        if (files.length + newFiles.length >= maxFiles) {
          break;
        }
        const file = fileList[i];
        if (file.size > maxBytes) {
          continue;
        }
        const selected: SelectedFile = {
          id: `file-${Date.now()}-${i}`,
          file,
          preview: isImageFile(file.type)
            ? URL.createObjectURL(file)
            : undefined,
        };
        newFiles.push(selected);
      }

      if (newFiles.length > 0) {
        onChange([...files, ...newFiles]);
      }
    },
    [files, onChange, maxFiles, maxSizeMB]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      onChange(files.filter((f) => f.id !== fileId));
    },
    [files, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl transition-colors cursor-pointer",
          "border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40",
          "bg-white/30 dark:bg-white/5",
          compact ? "p-3" : "p-4"
        )}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
        <div
          className={cn(
            "flex items-center gap-3 text-muted-foreground",
            compact ? "flex-row" : "flex-col text-center"
          )}
        >
          <Paperclip
            className={cn("text-purple-400", compact ? "h-4 w-4" : "h-6 w-6")}
          />
          <div>
            <p className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
              {compact ? "Attach files" : "Drop files here or click to browse"}
            </p>
            {!compact && (
              <p className="text-xs mt-0.5">
                Images, PDFs, Docs, CAD files up to {maxSizeMB}MB (max{" "}
                {maxFiles})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f) => (
            <FilePreviewChip key={f.id} file={f} onRemove={removeFile} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Compact attach button for comments ---

interface AttachButtonProps {
  onFiles: (files: SelectedFile[]) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function AttachButton({
  onFiles,
  accept = "image/*,.pdf,.doc,.docx",
  maxSizeMB = 10,
}: AttachButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    const selected: SelectedFile[] = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (file.size > maxBytes) {
        continue;
      }
      selected.push({
        id: `file-${Date.now()}-${i}`,
        file,
        preview: isImageFile(file.type) ? URL.createObjectURL(file) : undefined,
      });
    }

    if (selected.length > 0) {
      onFiles(selected);
    }
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-purple-500"
        onClick={() => inputRef.current?.click()}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </>
  );
}

// --- File preview chip ---

function FilePreviewChip({
  file,
  onRemove,
}: {
  file: SelectedFile;
  onRemove: (id: string) => void;
}) {
  const isImage = isImageFile(file.file.type);

  return (
    <div className="relative group flex items-center gap-2 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10 p-1.5 pr-7 max-w-[200px]">
      {isImage && file.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.preview}
          alt={file.file.name}
          className="h-8 w-8 rounded object-cover shrink-0"
        />
      ) : (
        <div className="h-8 w-8 rounded bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-foreground truncate">
          {file.file.name}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {formatFileSize(file.file.size)}
        </p>
      </div>
      <button
        type="button"
        className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file.id);
        }}
      >
        <X className="h-2.5 w-2.5 text-red-600 dark:text-red-400" />
      </button>
    </div>
  );
}

// --- Display existing attachments (read-only) ---

interface AttachmentListProps {
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  compact?: boolean;
}

export function AttachmentList({
  attachments,
  compact = false,
}: AttachmentListProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", compact && "mt-1.5")}>
      {attachments.map((att) => {
        const isImage = isImageFile(att.type);
        return (
          <a
            key={att.id}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10 p-1.5 max-w-[200px] hover:border-purple-300 dark:hover:border-purple-500/30 transition-colors"
          >
            {isImage ? (
              <ImageIcon className="h-4 w-4 text-purple-500 shrink-0" />
            ) : (
              <FileText className="h-4 w-4 text-purple-500 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">
                {att.name}
              </p>
              {!compact && (
                <p className="text-[10px] text-muted-foreground">
                  {formatFileSize(att.size)}
                </p>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
