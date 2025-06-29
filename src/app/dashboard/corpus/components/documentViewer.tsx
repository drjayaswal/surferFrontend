"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface DocumentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  file: {
    name: string;
    url: string;
    mime: string;
  } | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  open,
  onClose,
  file,
}) => {
  if (!file) return null;

  const isSupported =
    file.mime.includes("pdf") ||
    file.mime.includes("word") ||
    file.mime.includes("text") ||
    file.mime.includes("document");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "p-0 w-fit h-fit aspect-square overflow-visible",
          "bg-transparent shadow-none border-0"
        )}
      >
        <VisuallyHidden>
          <DialogTitle>{file.name}</DialogTitle>
        </VisuallyHidden>
        <div className="w-full h-full">
          {isSupported ? (
            <iframe
              src={file.url}
              title={file.name}
              className="w-full h-full border-none rounded-md"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-white text-sm px-4">
              Preview not supported for this document. Please download instead.
            </div>
          )}
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
};
