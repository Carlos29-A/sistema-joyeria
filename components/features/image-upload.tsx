"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Upload, X, ImagePlus, Check, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  onChange: (images: UploadedImage[]) => void;
  error?: string;
  value?: UploadedImage[];
}

export function ImageUpload({ onChange, error, value = [] }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploading(true);
      const newImages: UploadedImage[] = [];
      const total = files.length;

      for (let i = 0; i < total; i++) {
        const file = files[i];
        setUploadProgress(Math.round(((i + 1) / total) * 100));

        try {
          const formData = new FormData();
          formData.append("file", file);

          const result = await api.post<{ url: string; publicId: string }>("/api/upload", formData);
          newImages.push({ url: result.url, publicId: result.publicId });
        } catch (err) {
          console.error("Error al subir imagen:", err);
        }
      }

      setUploading(false);
      setUploadProgress(0);
      onChange([...value, ...newImages]);
    },
    [onChange, value]
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = value.filter((_, i) => i !== index);
      onChange(newImages);
    },
    [onChange, value]
  );

  return (
    <div className="w-full">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!uploading) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed",
          "border-zinc-200 bg-zinc-50 p-8 transition-all cursor-pointer",
          "hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-sm",
          uploading && "pointer-events-none opacity-60",
          error && "border-red-300 bg-red-50/50"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <div className="w-full max-w-xs">
              <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-2 text-center text-xs text-zinc-500">
                Subiendo imágenes... {uploadProgress}%
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full bg-emerald-100 p-3">
              <ImagePlus className="h-6 w-6 text-emerald-700" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-700">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                JPG, PNG, WEBP. Máx. 10MB cada una.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-1">
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Seleccionar archivos
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((img, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <img src={img.url} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-zinc-500 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-white hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                  <Check className="h-3 w-3" />
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
