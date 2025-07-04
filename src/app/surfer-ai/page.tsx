"use client";

import { connectionStore } from "@/stores/connectionStore";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  MessageCircle,
  Code,
  Send,
  Mic,
  EarIcon,
  SendHorizonal,
  Waves,
  Search,
  Loader2,
  Upload,
  FileLock,
  FileCheck2,
  Eye,
  File,
  CircleX,
} from "lucide-react";
import { cn, openFileInNewTab, toBase64 } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import LoginNavigation from "@/components/loginNavigation";
import { apiClient } from "@/lib/api";
import { useHydration } from "@/hooks/useHydration";
import { userStore } from "@/stores/userStore";
import { toast } from "sonner";
import { AttachmentFile } from "@/types/app.types";
import Toolbar from "@/components/ui/toolbar";
import Folders from "@/components/ui/folder";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    recognition?: any;
  }
}

export default function DashboardHome() {
  useHydration();

  const user = userStore((s) => s.user);
  const loading = userStore((s) => s.loading);
  const setUser = userStore((s) => s.setUser);
  const authChecked = userStore((s) => s.authChecked);
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const connections = connectionStore((s) => s.connections);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasProcessedUrlQuery, setHasProcessedUrlQuery] = useState(false);
  const connectionsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [attachments, setAttachments] = useState<
    { file: File; display: AttachmentFile }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const urlQuery = searchParams.get("q") || searchParams.get("query");
    if (urlQuery && !hasProcessedUrlQuery) {
      setPrompt(urlQuery);
      setHasProcessedUrlQuery(true);
      handleSendMessage(urlQuery);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("q");
      newUrl.searchParams.delete("query");
      router.replace(newUrl.pathname, { scroll: false });
    }
  }, [searchParams, hasProcessedUrlQuery, router]);

  const examples = [
    {
      title: "Write a to-do list an ideal day",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Generate an reply a to a job offer",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      title: "Summarize big bang thoery !",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      title: "How does AI actually work...?",
      icon: <Code className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    connectionsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [connections]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSendMessage();
      if (e.key === "Escape") setPrompt("");
      if (e.altKey && e.key === "m") toggleVoiceRecognition();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSendMessage = useCallback(
    async (queryText?: string) => {
      const messageText = queryText || prompt;
      if (!messageText.trim()) return;
      if (isListening) stopVoiceRecognition();

      setPrompt("");
      setIsLoading(true);
      setTimeout(() => inputRef.current?.focus(), 0);

      try {
        const rawFiles = attachments.map((a) => a.file); // ✅ Send only File[] to backend

        const response = await apiClient.sendConnection({
          prompt: messageText,
          attachments: rawFiles,
        });

        if (response.success && response.data) {
          connectionStore.getState().setConnections([
            ...connectionStore.getState().connections,
            {
              ...response.data,
              prompt: {
                ...response.data.prompt,
                attachments: attachments.map((a) => a.display),
              },
            },
          ]);
          setAttachments([]); // Clear after sending
        } else {
          console.warn("Message not sent successfully");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, isListening, attachments]
  );
  const handleUploadAttachments = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputFiles = e.target.files;
    if (!inputFiles || inputFiles.length === 0) return;

    const files = Array.from(inputFiles);
    if (files.length > 2) {
      toast.error("Maximum 2 attachments allowed!");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`"${file.name}" exceeds 2MB size limit`);
        return;
      }
    }

    const toastId = toast.loading("Uploading attachments...");

    try {
      const mapped = await Promise.all(
        files.map(async (file) => {
          const fakeId = `ATTACH-${Date.now()}-${file.name}`;
          const localUrl = URL.createObjectURL(file);

          const display: AttachmentFile = {
            id: fakeId,
            name: file.name,
            mime: file.type,
            url: localUrl,
            size: file.size,
            created_at: new Date(),
          };

          return { file, display };
        })
      );

      setAttachments((prev) => [...prev, ...mapped]);
      toast.success("Attachments uploaded successfully");
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Upload failed. Please try again.");
      console.error(error);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-sky-500" />
        <p className="ml-2 text-sm text-gray-600">Authenticating...</p>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const toggleVoiceRecognition = () => {
    if (!isListening) startVoiceRecognition();
    else stopVoiceRecognition();
  };
  const clearAttachments = () => {
    setAttachments([]);
  };
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported.");
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((res) => (res as SpeechRecognitionResult)[0].transcript)
        .join("");
      setPrompt(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    window.recognition = recognition;
  };

  const stopVoiceRecognition = () => {
    window.recognition?.stop();
    setIsListening(false);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
    >
      <div className="flex flex-col min-h-screen bg-white text-gray-800 relative rounded-xl">
        <div className="mt-10">
          <LoginNavigation />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-6 pb-40"
          >
            <div className="w-full mx-auto">
              {connections.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-full py-12">
                  <div className="w-30 h-30 mb-8">
                    <Image
                      src="/Surf.png"
                      width={200}
                      height={200}
                      alt="surf-logo"
                    />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4 text-center">
                    {getGreeting()},{" "}
                    <span className="bg-gradient-to-tr from-sky-400 via-sky-500 to-sky-800 bg-clip-text text-transparent font-bold animate-gradient-x text-shadow-lg">
                      Surfer
                    </span>
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-medium text-gray-600 text-center mb-12">
                    What's on your mind?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                    {examples.map((example, index) => (
                      <Card
                        key={index}
                        className="p-4 cursor-pointer transition-all group bg-white border-gray-200 rounded-xl hover:bg-sky-100 hover:border-sky-500 shadow-none border-0"
                        onClick={() => handleExampleClick(example.title)}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="mt-1 text-black group-hover:text-sky-500 group-hover:scale-110 transition-all duration-300">
                            {example.icon}
                          </div>
                          <p className="text-md text-black group-hover:text-sky-600 group-hover:font-medium transition-all duration-300">
                            {example.title}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1 w-full max-w-8xl mx-auto">
                  {connections.map((conn) => {
                    const userContent = conn.prompt.content || "[No content]";
                    const aiContent = conn.answer.content;
                    const time = new Date(conn.created_at);

                    return (
                      <div key={conn.id} className="space-y-4 px-5">
                        <div className="flex justify-end">
                          <div className="flex gap-3 flex-row-reverse max-w-[85%]">
                            <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                              <AvatarFallback className="text-lg font-medium p-[6px] bg-black/10 text-black/60">
                                <User />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex flex-col items-end">
                              <Card className="p-3 bg-black/1 text-gray-900 border-0 shadow-none rounded-xl whitespace-pre-wrap">
                                <p className="text-md leading-relaxed">
                                  {userContent}
                                </p>
                                {Array.isArray(conn.prompt.attachments) &&
                                  conn.prompt.attachments.length > 0 && (
                                    <div className="flex -m-5 flex-wrap">
                                      <Folders
                                        size={0.5}
                                        items={conn.prompt.attachments as any}
                                        onItemClick={(index) =>
                                          window.open(
                                            (
                                              conn.prompt.attachments?.[
                                                index
                                              ] as any
                                            )?.url,
                                            "_blank"
                                          )
                                        }
                                      />
                                    </div>
                                  )}{" "}
                                <span className="text-xs text-gray-500 block">
                                  {formatTime(time)}
                                </span>
                              </Card>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-start">
                          <div className="flex gap-3 flex-row max-w-[85%]">
                            <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
                              <Image
                                src="/Surf.png"
                                width={40}
                                height={40}
                                alt="surf-logo"
                              />{" "}
                            </Avatar>
                            <div className="flex-1 flex flex-col items-start">
                              <Card className="p-3 bg-sky-900/1 text-sky-700 border-0 shadow-none rounded-xl whitespace-pre-wrap">
                                <p className="text-md leading-relaxed">
                                  {aiContent}
                                </p>
                                <span className="text-xs text-sky-700 block">
                                  {formatTime(time)}
                                </span>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex items-center gap-3 px-5 py-5 animate-fade-in">
                      <Image
                        src="/Surf.png"
                        width={40}
                        height={40}
                        alt="surf-logo"
                      />
                      <div className="relative px-4 pl-2 -mr-4 bg-transparent text-sky-600 rounded-xl shadow-none max-w-[200px]">
                        <div className="flex items-center gap-1 justify-center h-5">
                          <span className="h-2 w-2 bg-sky-600 rounded-full animate-bounce delay-600" />
                          <span className="h-2 w-2 bg-sky-600 rounded-full animate-bounce delay-400" />
                          <span className="h-2 w-2 bg-sky-600 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}{" "}
                  <div ref={connectionsEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Sticky Input Area */}
          <div className="fixed min-w-400 rounded-4xl bottom-5 mx-5 z-10 shadow-lg">
            <Card className="rounded-4xl pt-4 pb-2 pr-2 pl-1 gap-1 bg-white/50 backdrop-blur-sm border-0 shadow-none">
              <div className="relative">
                <Input
                  ref={inputRef}
                  placeholder="Got Ideas? Questions? Let’s explore...."
                  autoFocus
                  className="min-h-[50px] pr-24 pl-15 pb-[9px] border-none shadow-none focus-visible:ring-0 text-gray-800 text-xl placeholder:text-sky-700 placeholder:text-xl file:text-xl md:text-xl"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setPrompt("");
                    } else if (e.key.toLowerCase() === "v" && e.shiftKey) {
                      e.preventDefault();
                      toggleVoiceRecognition();
                    }
                  }}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pb-1 text-sky-700">
                  <Search className="h-7 w-7" />
                </div>
                <div className="absolute right-28 top-1/2 -translate-y-1/2 flex gap-2 bg-sky-500/20 p-1 rounded-2xl shadow-inner backdrop-blur-md">
                  <Button
                    className="h-10 w-10 rounded-xl bg-sky-400 hover:bg-sky-500 text-white hover:scale-110 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleUploadAttachments}
                  />
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 bg-sky-100 p-1 rounded-2xl shadow-inner backdrop-blur-md">
                  <Button
                    className="h-10 w-10 rounded-xl bg-sky-400 hover:bg-sky-500 text-white hover:scale-110 transition-all cursor-pointer"
                    onClick={toggleVoiceRecognition}
                  >
                    {isListening ? (
                      <EarIcon className="h-6 w-6 animate-pulse" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!prompt.trim() || isLoading}
                    className={cn(
                      "h-10 w-10 rounded-xl text-white bg-sky-500 hover:bg-sky-600 hover:scale-110 active:scale-105 transition-all cursor-pointer",
                      (!prompt.trim() || isLoading) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {prompt === "" ? (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <SendHorizonal className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="ready"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                        >
                          <Send className="h-5 w-5 -rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </div>
            </Card>
            {attachments.length > 0 && (
              <div className="fixed bottom-29 right-6 z-20 max-w-sm w-full p-4 rounded-xl bg-white/50 backdrop-blur-lg  transition-all animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700 tracking-wide">
                    Attached Files
                  </h4>
                  <span className="text-sm text-gray-500 flex gap-5 items-center">
                    {attachments.length} file{attachments.length > 1 ? "s" : ""}
                    <Button
                      onClick={clearAttachments}
                      className="bg-transparent text-red-500 shadow-none hover:bg-red-600/10 rounded-full cursor-pointer"
                    >
                      <CircleX />
                    </Button>
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-md bg-transparent transition-colors group"
                    >
                      <div className="flex items-center gap-2 w-3/4 truncate">
                        <div className="h-6 w-6 rounded-md bg-transparent text-sky-400 text-xs flex items-center justify-center font-semibold">
                          <File />
                        </div>
                        <p className="text-sm text-gray-800 truncate">
                          {file.display.name}
                        </p>
                      </div>
                      <a
                        href={file.display.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 underline hover:text-sky-500 transition-colors cursor-pointer"
                      >
                        <Eye />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}{" "}
          </div>
        </div>
        <span className="block text-[10px] text-sky-700 px-3 rounded-md text-center">
          This AI is not a substitute for professional advice. Use discretion
          and verify all outputs
        </span>{" "}
      </div>
    </motion.div>
  );
}
