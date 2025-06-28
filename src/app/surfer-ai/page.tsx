"use client";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import LoginNavigation from "@/components/loginNavigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    recognition?: any;
  }
}

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSendMessage();
      if (e.key === "Escape") setPrompt("");
      if (e.altKey && e.key === "m") toggleVoiceRecognition();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handleSendMessage = useCallback(
    async (queryText?: string) => {
      const messageText = queryText || prompt;
      if (!messageText.trim()) return;
      if (isListening) stopVoiceRecognition();

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setPrompt("");
      setIsLoading(true);
      setTimeout(() => inputRef.current?.focus(), 0);

      try {
        await new Promise((r) => setTimeout(r, 1500));
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

  const generateMockResponse = (text: string) => {
    const responses = [
      "I understand you're asking about this topic. Let me provide some insights...",
      "That's an interesting question! Here's what I know about it...",
      "Based on my knowledge, I can tell you that...",
      "I'd be happy to help with that. Here's some information...",
      "Great question! Let me explain how this works...",
    ];
    return `${
      responses[Math.floor(Math.random() * responses.length)]
    } This is a simulated response to your query: "${text}".`;
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
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
            {messages.length === 0 ? (
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
                            "text-lg font-medium p-[6px]",
                            isUser
                              ? "bg-black text-white"
                              : "bg-sky-500 text-white"
                          )}
                        >
                          {isUser ? <User /> : <Waves />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "flex-1 min-w-0 max-w-[80%] sm:max-w-[75%] md:max-w-[65%]",
                          isUser && "items-end flex flex-col"
                        )}
                      >
                        <Card
                          className={cn(
                            "p-3 gap-4 transition-all shadow-none border-0 break-words whitespace-pre-wrap",
                            isUser
                              ? "bg-black/5 text-gray-800"
                              : "bg-sky-600/10 text-sky-600"
                          )}
                        >
                          <p className="text-md leading-relaxed m-0">
                            {message.content}
                          </p>
                          <span
                            className={cn(
                              "text-md",
                              isUser ? "text-black" : "text-sky-600"
                            )}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                        </Card>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex gap-3 items-center">
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="text-md font-medium p-[6px] bg-sky-500/10 text-sky-500">
                        <Waves />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-md text-sky-600 animate-pulse">
                      typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Sticky Input Area */}
        <div className="fixed min-w-400 rounded-4xl bottom-5 mx-5 z-10 shadow-none">
          <Card className="rounded-4xl pt-4 pb-2 pr-2 pl-1 gap-1 bg-sky-50/70 backdrop-blur-sm border-0 shadow-none">
            <div className="relative">
              <Input
                ref={inputRef}
                placeholder="Write a query or click the mic..."
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
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 bg-sky-500/20 p-1 rounded-2xl shadow-inner backdrop-blur-md">
                <Button
                  className="h-10 w-10 rounded-xl bg-sky-500 hover:bg-sky-700 text-white hover:scale-110 transition-all"
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
                    "h-10 w-10 rounded-xl text-white bg-sky-500 hover:scale-110 active:scale-105 transition-all",
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
        </div>
      </div>
    </div>
  );
}
