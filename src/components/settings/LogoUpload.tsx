import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LogoUploadProps {
  logo: string;
  onChange: (base64: string) => void;
}

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function LogoUpload({ logo, onChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await resizeImage(file, 400);
      onChange(base64);
    } catch {
      // silently fail
    }
  }

  return (
    <div className="space-y-3">
      <Label>Company Logo</Label>
      <div className="flex items-center gap-4">
        {logo ? (
          <img
            src={logo}
            alt="Company logo"
            className="h-16 w-16 object-contain rounded border border-border"
          />
        ) : (
          <div className="h-16 w-16 rounded border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
            No logo
          </div>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            {logo ? "Change" : "Upload"}
          </Button>
          {logo && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              className="text-destructive"
            >
              Remove
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
