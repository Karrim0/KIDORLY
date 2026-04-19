
"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Copy, Check, ImageIcon, Loader2, Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  filename: string | null;
  createdAt: string;
}

export default function MediaPage() {
  const t = useTranslations("admin");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "kidorly");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          setMedia((prev) => [
            {
              id: data.id,
              url: data.url,
              publicId: data.publicId,
              filename: file.name,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(id: string) {
    setDeleting(id);

    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("mediaManager")}</h1>

      <div className="bg-white rounded-2xl border p-8 text-center mb-8">
        <div className="max-w-sm mx-auto">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-semibold mb-1">{t("uploadImages")}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {t("uploadImagesDesc")}
          </p>

          <label className="cursor-pointer">
            <Button asChild disabled={uploading}>
              <span>
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Upload className="h-4 w-4 me-2" />
                )}
                {uploading ? t("uploading") : t("chooseFiles")}
              </span>
            </Button>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : media.length > 0 ? (
        <div>
          <h2 className="font-semibold text-lg mb-4">
            {t("uploadedImages")} ({media.length})
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border overflow-hidden group"
              >
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={item.url}
                    alt={item.filename || ""}
                    fill
                    className="object-cover"
                    sizes="250px"
                  />

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="absolute top-2 end-2 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="p-3">
                  {item.filename && (
                    <p className="text-xs text-muted-foreground truncate mb-1.5">
                      {item.filename}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Input value={item.url} readOnly className="text-xs font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => copyUrl(item.url)}
                    >
                      {copied === item.url ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          {t("uploadPrompt")}
        </p>
      )}
    </div>
  );
}