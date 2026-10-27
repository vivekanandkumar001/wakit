import React, { useRef, useState } from 'react';
import { FileImage, UploadCloud, type LucideIcon } from 'lucide-react';
import { formatBytes } from '../lib/clientFiles';

interface UploadZoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  icon?: LucideIcon;
  title: string;
  hint: string;
  files?: File[];
  disabled?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  accept,
  multiple = false,
  onFiles,
  icon: Icon = FileImage,
  title,
  hint,
  files = [],
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = multiple ? Array.from(list) : [list[0]];
    onFiles(next);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(event.dataTransfer.files);
      }}
      className={`rounded-2xl border border-dashed transition-colors ${
        dragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50/80'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="group flex w-full flex-col items-center gap-2 px-4 py-6 text-center"
      >
        {files.length > 0 ? (
          <>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="max-w-full truncate text-sm font-semibold text-slate-900">
              {files.length === 1 ? files[0].name : `${files.length} files selected`}
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-700">
              {formatBytes(totalSize)} · click to change
            </span>
          </>
        ) : (
          <>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-emerald-600 ring-1 ring-slate-200 transition-transform group-hover:scale-105">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-slate-800">{title}</span>
            <span className="text-[11px] leading-relaxed text-slate-500">{hint}</span>
          </>
        )}
      </button>
    </div>
  );
};
