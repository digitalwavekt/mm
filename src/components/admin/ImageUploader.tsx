import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  /** Media library folder this image belongs to, e.g. "gallery", "hero". */
  folder: string;
  placeholder?: string;
};

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // keep in sync with server/lib/storage.ts

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result looks like "data:image/png;base64,AAAA..." — strip the prefix
      const result = reader.result as string;
      const base64 = result.slice(result.indexOf(",") + 1);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  value,
  onChange,
  folder,
  placeholder,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = trpc.media.upload.useMutation({
    onSuccess: (media) => {
      if (media?.fileUrl) onChange(media.fileUrl);
      toast.success("Image uploaded");
    },
    onError: (err) => {
      toast.error(err.message || "Upload failed");
    },
    onSettled: () => setUploading(false),
  });

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Image is too large. Max size is 8MB.");
      return;
    }
    setUploading(true);
    try {
      const dataBase64 = await readFileAsBase64(file);
      upload.mutate({
        fileName: file.name,
        mimeType: file.type,
        dataBase64,
        folder,
      });
    } catch {
      setUploading(false);
      toast.error("Couldn't read that file");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white/5">
            <img
              src={value}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 rounded-full p-0.5"
              aria-label="Remove image"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 shrink-0 rounded-lg border border-dashed border-white/15 bg-white/5" />
        )}

        <div className="flex-1 space-y-2">
          <input
            required={false}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "Paste an image URL, or upload →"}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>
      </div>
    </div>
  );
}
