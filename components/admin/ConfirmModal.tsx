"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm Action",
  cancelText = "Cancel",
  variant = "danger"
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-luxe-surface border border-white/5 rounded-[32px] overflow-hidden shadow-2xl pointer-events-auto shadow-black/50"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center",
                    variant === "danger" ? "bg-luxe-error/10 text-luxe-error" :
                      variant === "warning" ? "bg-luxe-tertiary/10 text-luxe-tertiary" :
                        "bg-luxe-primary/10 text-luxe-primary"
                  )}>
                    <AlertTriangle className="size-6" />
                  </div>
                  <button
                    onClick={onClose}
                    className="size-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-luxe-on-surface-variant transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">
                  {title}
                </h3>
                <p className="text-sm text-luxe-on-surface-variant leading-relaxed">
                  {description}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-12 border-white/5 bg-transparent rounded-2xl font-black text-[10px] uppercase tracking-widest"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={cn(
                      "flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest",
                      variant === "danger" ? "bg-luxe-error text-white hover:bg-luxe-error/90" :
                        variant === "warning" ? "bg-luxe-tertiary text-black hover:bg-luxe-tertiary/90" :
                          "bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90"
                    )}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
