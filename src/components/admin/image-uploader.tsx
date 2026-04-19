"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function ImageUploader({ value, onChange, multiple = true, className }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "kidorly/products");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) newUrls.push(data.url);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    if (multiple) {
      onChange([...value, ...newUrls]);
    } else {
      onChange(newUrls.slice(0, 1));
    }

    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url) => (
            <div key={url} className="relative group h-24 w-24 rounded-xl overflow-hidden bg-gray-50 border">
              <Image src={url} alt="" fill className="object-cover" sizes="96px" />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-1 end-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <label className="cursor-pointer inline-block">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors",
          uploading && "pointer-events-none opacity-50"
        )}>
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {uploading ? "Uploading..." : multiple ? "Upload Images" : "Upload Image"}
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}
