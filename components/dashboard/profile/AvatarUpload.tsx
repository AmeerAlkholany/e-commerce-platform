"use client";

import React, { useState, useRef } from "react";
import { Camera, Trash2, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentUrl?: string | null;
  name: string;
  onUploadSuccess: (url: string) => void;
  onRemoveSuccess: () => void;
}

import { ConfirmDialog } from "./ConfirmDialog";

export function AvatarUpload({ currentUrl, name, onUploadSuccess, onRemoveSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "??";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File exceeds 2MB limit");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      onUploadSuccess(data.avatar_url);
      toast.success("Identity visual updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const performRemove = async () => {
    try {
      setUploading(true);
      const res = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove avatar");

      onRemoveSuccess();
      toast.success("Visual identity cleared");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setShowConfirm(true);
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={performRemove}
        title="Remove Visual Identity?"
        description="This will purge your profile avatar from the global CDN and revert to system initials."
        confirmText="Confirm Removal"
      />
      <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <div className={cn(
          "size-40 rounded-full border-4 border-luxe-surface flex items-center justify-center overflow-hidden bg-luxe-surface-container-high transition-all duration-500 shadow-2xl",
          uploading && "opacity-50 grayscale"
        )}>
          {currentUrl ? (
            <img src={currentUrl} alt={name} className="size-full object-cover" />
          ) : (
            <span className="text-4xl font-black text-luxe-on-surface-variant/40 tracking-tighter italic uppercase">
              {getInitials(name)}
            </span>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <Loader2 className="size-8 text-luxe-primary animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-1 right-1 size-10 bg-luxe-primary text-luxe-on-primary rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-10 border-4 border-luxe-surface group-hover:rotate-12"
          title="Update visual identity"
        >
          <Camera className="size-5" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{name}</h3>
        <p className="text-[10px] font-bold text-luxe-on-surface-variant tracking-[0.2em] uppercase">Verified Account Portfolio</p>
        
        {currentUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
            className="text-[10px] h-8 font-black text-red-400/60 hover:text-red-400 hover:bg-red-400/10 uppercase tracking-widest mt-2"
          >
            <Trash2 className="size-3.5 mr-2" /> Remove Image
          </Button>
        )}
      </div>
    </div>
    </>
  );
}
