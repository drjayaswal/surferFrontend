"use client";
import { AnimatePresence, motion } from "framer-motion";
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    recognition?: any;
  }
}

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  User,
  Mail,
  MessageCircle,
  Code,
  Send,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  EarIcon,
  SendHorizonal,
  CheckSquare,
  Waves,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import WaveBackground from "@/components/waveBackground";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function DashboardHome() {
  const [prompt, setPrompt] = useState("");
  const [copiedMap, setCopiedMap] = useState<{ [key: string]: boolean }>({});
  const [likedMap, setLikedMap] = useState<{ [key: string]: boolean }>({});
  const [dislikedMap, setDislikedMap] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [sharedMap, setSharedMap] = useState<{ [key: string]: boolean }>({});
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasProcessedUrlQuery, setHasProcessedUrlQuery] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle URL query parameters on component mount
  useEffect(() => {
    const urlQuery = searchParams.get("q") || searchParams.get("query");

    if (urlQuery && !hasProcessedUrlQuery) {
      setPrompt(urlQuery);
      setHasProcessedUrlQuery(true);

      handleSendMessage(urlQuery);
      // Clear the URL parameter after processing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("q");
      newUrl.searchParams.delete("query");
      router.replace(newUrl.pathname, { scroll: false });
      handleSendMessage(prompt);
    }
  }, [searchParams, hasProcessedUrlQuery, router]);

  const examples = [
    {
      title: "Write a to-do list for a personal project",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Generate an email to reply to a job offer",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      title: "Summarize this article in one paragraph",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      title: "How does AI actually work at backstage",
      icon: <Code className="h-5 w-5" />,
    },
  ];

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleSendMessage();
      }
      if (e.key === "Escape") {
        setPrompt("");
      }
      if (e.altKey && e.key === "m") {
        toggleVoiceRecognition();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!isListening) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  // Start voice recognition
  const startVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res) => (res as SpeechRecognitionResult)[0])
          .map((result) => result.transcript)
          .join("");

        setPrompt(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      (window as any).recognition = recognition;
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  // Stop voice recognition
  const stopVoiceRecognition = () => {
    if ((window as any).recognition) {
      (window as any).recognition.stop();
      setIsListening(false);
    }
  };

  // Enhanced handle sending a message with optional query parameter
  const handleSendMessage = useCallback(
    async (queryText?: string) => {
      const messageText = queryText || prompt;
      if (!messageText.trim()) return;

      if (isListening) {
        stopVoiceRecognition();
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setPrompt("");
      setIsLoading(true);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(messageText),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, isListening]
  );

  // Generate a mock response
  const generateMockResponse = (prompt: string): string => {
    const responses = [
      "I understand you're asking about this topic. Let me provide some insights...",
      "That's an interesting question! Here's what I know about it...",
      "Based on my knowledge, I can tell you that...",
      "I'd be happy to help with that. Here's some information...",
      "Great question! Let me explain how this works...",
    ];

    return (
      responses[Math.floor(Math.random() * responses.length)] +
      ' This is a simulated response to your query: "' +
      prompt +
      "\". In a real implementation, this would connect to an AI service like OpenAI's API."
    );
  };

  // Handle example click
  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 relative rounded-xl ">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <WaveBackground opacity={0.2} />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 pb-32"
        >
          <div className="w-full mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full py-12">
                {/* Logo and Branding */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-30 h-30">
                    <Image
                      src={"/Surf.png"}
                      width={200}
                      height={200}
                      alt="surf-logo"
                    />
                  </div>
                </div>

                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-800">
                    {getGreeting()},{" "}
                    <span className="bg-gradient-to-tr from-sky-400 via-sky-500 to-sky-800 bg-clip-text text-transparent font-bold animate-gradient-x text-shadow-lg">
                      Surfer
                    </span>
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-medium text-gray-600">
                    What's on your mind?
                  </h2>
                </div>
                <div className="w-full max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {examples.map((example, index) => (
                      <Card
                        key={index}
                        className="p-4 cursor-pointer transition-all group bg-white border-gray-200 rounded-xl hover:bg-sky-100 hover:border-sky-500 shadow-none border-0"
                        onClick={() => handleExampleClick(example.title)}
                      >
                        <div className="flex items-center justify-center gap-3">
                          {/* Icon with color and scale transition on hover */}
                          <div className="mt-1 text-black transition-all duration-300 group-hover:text-sky-500 group-hover:scale-110">
                            {example.icon}
                          </div>

                          {/* Title text with color transition on hover */}
                          <p className="text-sm text-black transition-all duration-300 group-hover:text-sky-600 group-hover:font-medium">
                            {example.title}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1 w-full max-w-8xl mx-auto">
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 group animate-in fade-in-0 slide-in-from-bottom-3 duration-300",
                        isUser && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                        <AvatarFallback
                          className={cn(
                            "text-xs font-medium p-[6px]",
                            isUser
                              ? " bg-black text-white"
                              : " bg-sky-500 text-white"
                          )}
                        >
                          {isUser ? <User /> : <Waves />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "flex-1 min-w-0 max-w-[80%] sm:max-w-[75%] md:max-w-[65%]",
                          isUser && "flex flex-col items-end"
                        )}
                      >
                        <Card
                          className={cn(
                            "p-3 flex flex-col gap-4 transition-all shadow-none border-0 duration-200 break-words whitespace-pre-wrap",
                            isUser
                              ? "bg-black/5 text-gray-800"
                              : "bg-sky-600/10 text-sky-600"
                          )}
                        >
                          <p className="text-sm leading-relaxed m-0">
                            {message.content}
                          </p>
                          <span
                            className={cn(
                              "text-xs",
                              isUser ? "text-black" : "text-sky-600"
                            )}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                        </Card>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-1 mt-2 transition-opacity duration-200 group-hover:opacity-100 opacity-0"
                        >
                          {/* Like Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLikedMap((prev) => ({
                                ...prev,
                                [message.id]: true,
                              }));
                              setTimeout(() => {
                                setLikedMap((prev) => ({
                                  ...prev,
                                  [message.id]: false,
                                }));
                              }, 2000);
                            }}
                            className={cn(
                              "h-7 w-7 p-0 transition-colors",
                              likedMap[message.id]
                                ? "bg-green-200 text-green-700 hover:bg-green-200 hover:text-green-700"
                                : "hover:bg-green-100 hover:text-green-600"
                            )}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>

                          {/* Dislike Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDislikedMap((prev) => ({
                                ...prev,
                                [message.id]: true,
                              }));
                              setTimeout(() => {
                                setDislikedMap((prev) => ({
                                  ...prev,
                                  [message.id]: false,
                                }));
                              }, 2000);
                            }}
                            className={cn(
                              "h-7 w-7 p-0 transition-colors",
                              dislikedMap[message.id]
                                ? "bg-red-200 text-red-700 hover:bg-red-200 hover:text-red-700"
                                : "hover:bg-red-100 hover:text-red-600"
                            )}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>

                          {/* Copy Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCopiedMap((prev) => ({
                                ...prev,
                                [message.id]: true,
                              }));
                              navigator.clipboard.writeText(message.content);
                              setTimeout(() => {
                                setCopiedMap((prev) => ({
                                  ...prev,
                                  [message.id]: false,
                                }));
                              }, 2000);
                            }}
                            className={cn(
                              "h-7 w-7 p-0 transition-colors",
                              copiedMap[message.id]
                                ? "bg-blue-200 text-blue-700 hover:bg-blue-200 hover:text-blue-700"
                                : "hover:bg-blue-100 hover:text-blue-600"
                            )}
                          >
                            {copiedMap[message.id] ? (
                              <CheckSquare className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>

                          {/* Share Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSharedMap((prev) => ({
                                ...prev,
                                [message.id]: true,
                              }));
                              setTimeout(() => {
                                setSharedMap((prev) => ({
                                  ...prev,
                                  [message.id]: false,
                                }));
                              }, 2000);
                              // Optional: trigger modal or logic
                            }}
                            className={cn(
                              "h-7 w-7 p-0 transition-colors",
                              sharedMap[message.id]
                                ? "bg-purple-200 text-purple-700 hover:bg-purple-200 hover:text-purple-700"
                                : "hover:bg-purple-100 hover:text-purple-600"
                            )}
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-3 items-center">
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="text-xs font-medium p-[6px] bg-sky-500/10 text-sky-500">
                        <Waves />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 max-w-[80%] sm:max-w-[75%] md:max-w-[65%]">
                      <span className="text-sm text-sky-600 animate-pulse">
                        typing...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Floating Input Area */}
        <div>
          <Card className="rounded-b-xl rounded-t-none pt-4 pb-2 pr-2 pl-1 gap-1 bg-transparent border-0">
            <div className="relative ">
              {/* Input */}
              <Input
                ref={inputRef}
                placeholder="Write a query or click on that mic button..."
                autoFocus
                className="min-h-[50px] max-h-[200px] resize-none pr-24 pl-12 pb-[9px] text-base border-none shadow-none focus-visible:ring-0 text-gray-800 placeholder:text-sky-700 m-0"
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

              {/* Sparkles Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pb-1 text-sky-700">
                <Search className="h-5 w-5" />
              </div>

              {/* Action Buttons */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 backdrop-blur-md bg-sky-500/20 p-1 rounded-2xl shadow-inner">
                {/* Voice Toggle Button */}
                <Button
                  className="h-10 w-10 rounded-xl bg-sky-500 hover:bg-sky-700 text-white hover:scale-110 hover:shadow-lg transition-all duration-300 ease-out active:scale-105"
                  onClick={toggleVoiceRecognition}
                >
                  {isListening ? (
                    <EarIcon className="h-6 w-6 animate-pulse text-white" />
                  ) : (
                    <Mic className="h-6 w-6 text-white" />
                  )}
                </Button>

                {/* Send Button */}
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!prompt.trim() || isLoading}
                  className={cn(
                    "h-10 w-10 p-0 rounded-xl transition-all duration-300 ease-out",
                    "text-white bg-sky-500 hover:scale-110 hover:shadow-lg active:scale-105",
                    (!prompt.trim() || isLoading) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {prompt == "" ? (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        <SendHorizonal className="h-5 w-5 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="ready"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                      >
                        <Send className="h-5 w-5 text-white -rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
