"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  File,
  FileText,
  FileSpreadsheet,
  FileImage,
  FilePlus,
  MoreHorizontal,
  Search,
  FolderPlus,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  Filter,
  Download,
  Tag,
  Folder,
  Trash2,
  Paperclip,
  Files,
  XCircle,
  Eye,
  CheckSquare,
  Tally1,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import Folders from "@/components/ui/folder";
import { CorpusFile, FileStatus } from "@/types/app.types";
import Toolbar from "@/components/ui/toolbar";

export default function CorpusPage() {
  const [files, setFiles] = useState<CorpusFile[]>([
    // {
    //   id: "1",
    //   name: "company-handbook.pdf",
    //   type: "application/pdf",
    //   size: 2500000,
    //   uploadDate: new Date(2025, 5, 5),
    //   status: "ready",
    //   collection: "Company Docs",
    //   tags: ["handbook", "policies"],
    // },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false);
  const [showAddTagsDialog, setShowAddTagsDialog] = useState(false);
  const [showMoveToCollectionDialog, setShowMoveToCollectionDialog] =
    useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newTags, setNewTags] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [activeCollection, setActiveCollection] = useState<string>("All Files");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [collections, setCollections] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.tags &&
        file.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCollection =
      activeCollection === "All Files" || file.collection === activeCollection;

    return matchesSearch && matchesCollection;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileUpload = (uploadedFiles: File[]) => {
    // Create temporary file entries with uploading status
    const newFiles: CorpusFile[] = uploadedFiles.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      status: "uploading" as FileStatus,
      progress: 0,
      collection:
        activeCollection === "All Files" ? undefined : activeCollection,
    }));

    // Add files to state immediately
    setFiles((prev) => [...newFiles, ...prev]);

    // Simulate upload progress for each file
    newFiles.forEach((newFile) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random progress increment

        if (progress >= 100) {
          clearInterval(interval);

          // Update file status to processing
          setFiles((prev) =>
            prev.map((file) =>
              file.id === newFile.id
                ? { ...file, status: "processing", progress: 0 }
                : file
            )
          );

          // Simulate processing time
          setTimeout(() => {
            setFiles((prev) =>
              prev.map((file) =>
                file.id === newFile.id
                  ? { ...file, status: "ready", progress: undefined }
                  : file
              )
            );
          }, 2000 + Math.random() * 3000); // Random processing time
        } else {
          setFiles((prev) =>
            prev.map((file) =>
              file.id === newFile.id ? { ...file, progress } : file
            )
          );
        }
      }, 200);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(Array.from(e.target.files));
      // Reset the input value to allow uploading the same file again
      e.target.value = "";
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleCreateCollection = () => {
    if (
      newCollectionName.trim() &&
      !collections.includes(newCollectionName.trim())
    ) {
      setCollections((prev) => [...prev, newCollectionName.trim()]);
      setNewCollectionName("");
      setShowNewCollectionDialog(false);
    }
  };

  const handleAddTags = () => {
    if (selectedFileId && newTags.trim()) {
      const tagsArray = newTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      setFiles((prev) =>
        prev.map((file) =>
          file.id === selectedFileId
            ? { ...file, tags: [...(file.tags || []), ...tagsArray] }
            : file
        )
      );
      setNewTags("");
      setSelectedFileId(null);
      setShowAddTagsDialog(false);
    }
  };

  const handleMoveToCollection = () => {
    if (selectedFileId && selectedCollection) {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === selectedFileId
            ? {
                ...file,
                collection:
                  selectedCollection === "None"
                    ? undefined
                    : selectedCollection,
              }
            : file
        )
      );
      setSelectedFileId(null);
      setSelectedCollection("");
      setShowMoveToCollectionDialog(false);
    }
  };

  const handleRetryProcessing = (id: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, status: "processing", progress: 0 } : file
      )
    );

    // Simulate processing
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === id
            ? { ...file, status: "ready", progress: undefined }
            : file
        )
      );
    }, 3000);
  };

  const handleDownloadFile = (file: CorpusFile) => {
    // In a real app, this would download the actual file
    console.log(`Downloading ${file.name}`);
    alert(`Download functionality would be implemented here for ${file.name}`);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <FileText className="h-6 w-6 text-red-500" />;
    if (fileType.includes("spreadsheet") || fileType.includes("csv"))
      return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
    if (fileType.includes("image"))
      return <FileImage className="h-6 w-6 text-purple-500" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <FileText className="h-6 w-6 text-blue-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 text-sky-500 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "uploading":
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileCount = (collection: string) => {
    if (collection === "All Files") return files.length;
    return files.filter((file) => file.collection === collection).length;
  };

  return (
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
              variant="outline"
              size="sm"
              className="gap-2 bg-sky-600/10 hover:bg-sky-500 hover:text-white text-sky-600 border-0 shadow-none cursor-pointer"
              onClick={() => setShowNewCollectionDialog(true)}
            >
              <FolderPlus className="h-4 w-4" />
              New Collection
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-sky-500 hover:bg-sky-600 text-white border-0 hover:shadow-lg hover:scale-102 shadow-none cursor-pointer"
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
              onChange={handleFileInputChange}
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
                    rightIcon={<Tally1 className="h-10 w-10" />}
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
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {sortedFiles.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-sky-400 rounded-lg">
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
                  <h2 className="text-lg font-semibold text-gray-800">
                    {activeCollection} ({sortedFiles.length})
                  </h2>

                  <div className="flex flex-col gap-3">
                    {sortedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between gap-4 w-full p-3 px-5 rounded-full border-0 hover:border-sky-600 bg-white shadow-none hover:shadow-md transition"
                      >
                        {/* Left: Icon + Name + Status + Tags + Size */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* File Icon */}
                          <div className="flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>

                          {/* File Info */}
                          <div className="flex items-center gap-3 truncate flex-wrap">
                            {/* Name */}
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {file.name}
                            </h3>

                            {/* Status */}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              {getStatusIcon(file.status)}
                            </div>

                            {/* File Size */}
                            <span className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </span>

                            {/* Tags */}
                            {file.tags && file.tags.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                {file.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs bg-gray-100 text-gray-700"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-sky-700 hover:bg-sky-600/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="left"
                              className="text-[10px] text-sky-600 mr-2"
                            >
                              Preview
                            </TooltipContent>
                          </Tooltip>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 focus-visible:ring-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDownloadFile(file)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedFileId(file.id);
                                  setShowAddTagsDialog(true);
                                }}
                              >
                                <Tag className="h-4 w-4 mr-2" />
                                Add Tags
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedFileId(file.id);
                                  setShowMoveToCollectionDialog(true);
                                }}
                              >
                                <Folder className="h-4 w-4 mr-2" />
                                Move to Collection
                              </DropdownMenuItem>
                              {file.status === "error" && (
                                <DropdownMenuItem
                                  onClick={() => handleRetryProcessing(file.id)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Retry Processing
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
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
        {sortedFiles.length > 0 && (
          <div
            style={{ position: "relative" }}
            className="justify-center flex mr-150"
          >
            <Folders
              size={0.7}
              items={files}
              onItemClick={(index) => alert(`Clicked paper ${index + 1}`)}
            />{" "}
          </div>
        )}
      </div>

      {/* New Collection Dialog */}
      <Dialog
        open={showNewCollectionDialog}
        onOpenChange={setShowNewCollectionDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Collections help you organize your files for different AI
              contexts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateCollection();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewCollectionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim()}
            >
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tags Dialog */}
      <Dialog open={showAddTagsDialog} onOpenChange={setShowAddTagsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>
              Add tags to help categorize and search for this file. Separate
              multiple tags with commas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="tag1, tag2, tag3"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTags();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTagsDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTags} disabled={!newTags.trim()}>
              Add Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Collection Dialog */}
      <Dialog
        open={showMoveToCollectionDialog}
        onOpenChange={setShowMoveToCollectionDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move to Collection</DialogTitle>
            <DialogDescription>
              Select a collection to move this file to.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <option value="">Select a collection</option>
              <option value="None">No Collection</option>
              {collections
                .filter((c) => c !== "All Files")
                .map((collection) => (
                  <option key={collection} value={collection}>
                    {collection}
                  </option>
                ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMoveToCollectionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMoveToCollection}
              disabled={!selectedCollection}
            >
              Move File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
