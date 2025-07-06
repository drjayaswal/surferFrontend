"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Download,
  Trash2,
  Paperclip,
  Eye,
  Loader2,
} from "lucide-react";
import Folders from "@/components/ui/folder";
import { CorpusFile, User } from "@/types/app.types";
import Toolbar from "@/components/ui/toolbar";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { openFileInNewTab, toBase64 } from "@/lib/utils";
import { useHydration } from "@/hooks/useHydration";
import { userStore } from "@/stores/userStore";

export default function CorpusPage() {
  useHydration();

  const user = userStore((s) => s.user);
  const setUser = userStore((s) => s.setUser);
  const authChecked = userStore((s) => s.authChecked);

  const [files, setFiles] = useState<CorpusFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCorpusUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;
    if (!inputFiles || inputFiles.length === 0) return;

    const files = Array.from(inputFiles);
    if (files.length > 2) {
      toast.error("Maximum two corpuses files allowed!");
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    for (const file of files) {
      // if (!allowedTypes.includes(file.type)) {
      //   toast.error(`"${file.name}" is not a supported document format.`);
      //   return;
      // }
      if (file.size > maxSize) {
        toast.error(`"${file.name}" exceeds 2MB size limit.`);
        return;
      }
    }

    const toastId = toast.loading("Uploading corpuses...");

    try {
      const response = await apiClient.uploadCorpuses({ files });

      toast.dismiss(toastId);

      if (response.success && Array.isArray(response.data.corpusesFiles)) {
        const enrichedCorpusData = await Promise.all(
          files.map(async (file, i) => {
            const base64 = await toBase64(file);
            return {
              ...response.data.corpusesFiles[i],
              url: base64,
            };
          })
        );

        const updatedUser: User = {
          ...user!,
          corpuses: [...(user?.corpuses || []), ...enrichedCorpusData],
          activity_logs: [...user?.activity_logs!, response.data.newActivity],
        };
        setUser(updatedUser);

        const surferRaw = localStorage.getItem("surfer");
        const surfer = surferRaw ? JSON.parse(surferRaw) : null;

        if (surfer) {
          surfer.state.user.corpuses = updatedUser.corpuses;
          localStorage.setItem("surfer", JSON.stringify(surfer));
        }

        toast.success("Corpuses uploaded!");
      } else {
        toast.error(response.message || "Failed to upload corpuses");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Upload failed. Please try again.");
      console.error(error);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const stored = userStore.getState().user?.corpuses || [];
    setFiles(stored);
  }, []);

  useEffect(() => {
    const originalFiles = user?.corpuses || [];
    if (searchQuery.trim() === "") {
      setFiles(originalFiles);
    } else {
      const filtered = originalFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiles(filtered);
    }
  }, [searchQuery, user]);

  useEffect(() => {
    if (user?.corpuses?.length) {
      setFiles(user.corpuses);
    }
  }, [user]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-sky-500" />
        <p className="ml-2 text-sm text-gray-600">Authenticating...</p>
      </div>
    );
  }

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleDownloadFile = (file: CorpusFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name || "download";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
    >
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 pt-4 pb-3 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-sky-700 mb-1">
                Corpus Vault
              </h1>
              <p className="text-sm text-sky-600/70">
                view, upload and manage your contextual files.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="gap-2 bg-sky-400 hover:bg-sky-500 text-white border-0 hover:shadow-lg hover:scale-102 shadow-none cursor-pointer rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
                Upload Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleCorpusUpload}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Search and Filter Bar */}
              <div className="p-4 border-t border-sky-500">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Toolbar
                      icon={<Search className="h-8 w-8" />}
                      title="Search"
                      placeholder="Search for File Names, Tags or Extensions..."
                      value={searchQuery}
                      onChange={(value: string) => setSearchQuery(value)}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* File List */}
              <div
                className="px-8 pb-8 pt-2 flex-1 overflow-y-auto"
                // onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {files.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 pt-50 border-0">
                    <div style={{ position: "relative" }}>
                      <Folders size={0.5} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      No Files Uploaded
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-md">
                      {searchQuery
                        ? "No files match your search criteria. Try a different search term."
                        : "Upload files by clicking the button above or drag and drop files here."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between gap-4 w-full p-3 px-5 rounded-full border-0 hover:border-sky-600 bg-white shadow-none transition"
                        >
                          {/* Left: Icon + Name + Status + Tags + Size */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">{index + 1}</div>

                            {/* File Info */}
                            <div className="flex items-center gap-3 truncate flex-wrap">
                              {/* Name */}
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {file.id}
                              </h3>

                              {/* File Size */}
                              <span className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer text-gray-500 hover:text-sky-700 hover:bg-sky-600/10"
                              onClick={() => {
                                openFileInNewTab(file.url, file.mime);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 cursor-pointer text-gray-500 hover:text-gray-800 focus-visible:ring-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleDownloadFile(file)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                                  <span className="text-red-600">Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {files.length > 0 && (
          <div
            style={{ position: "relative", bottom: "0" }}
            className="justify-center flex mt-8"
          >
            <Folders
              size={0.7}
              items={files}
              onItemClick={(index) => {
                openFileInNewTab(files[index].url, files[index].mime);
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
