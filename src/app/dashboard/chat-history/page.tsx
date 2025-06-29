"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  Clock,
  MoreHorizontal,
  Star,
  Trash2,
  Download,
  Share2,
  ArrowRight,
  Bot,
  User,
  Sparkles,
  MessageCircleQuestion,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  startTime: Date;
  lastActivity: Date;
  category?: string;
  isFavorite?: boolean;
  messageCount: number;
}

type TimeFilter = "today" | "yesterday" | "lastWeek" | "lastMonth" | "overall";

export default function ChatHistoryPage() {
  const filters: TimeFilter[] = [
    "today",
    "yesterday",
    "lastWeek",
    "lastMonth",
    "overall",
  ];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("overall");

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<TimeFilter, HTMLButtonElement | null>>({
    today: null,
    yesterday: null,
    lastWeek: null,
    lastMonth: null,
    overall: null,
  });
  const [bgStyle, setBgStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const activeButton = buttonRefs.current[timeFilter];
    const container = containerRef.current;

    if (activeButton && container) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setBgStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    }
  }, [timeFilter]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "messages">(
    "recent"
  );

  // Sample chat history data
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "React Hooks Implementation",
      startTime: new Date(2025, 5, 11, 9, 30),
      lastActivity: new Date(2025, 5, 11, 10, 15),
      category: "Development",
      isFavorite: true,
      messageCount: 12,
      messages: [
        {
          id: "1-1",
          role: "user",
          content: "How do I implement useState in React?",
          timestamp: new Date(2025, 5, 11, 9, 30),
        },
        {
          id: "1-2",
          role: "assistant",
          content:
            "useState is a React Hook that lets you add state to functional components. Here's how to use it:\n\n```jsx\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```",
          timestamp: new Date(2025, 5, 11, 9, 31),
        },
        {
          id: "1-3",
          role: "user",
          content: "What about useEffect?",
          timestamp: new Date(2025, 5, 11, 9, 35),
        },
        {
          id: "1-4",
          role: "assistant",
          content:
            "useEffect is used for side effects in functional components. It's similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined.",
          timestamp: new Date(2025, 5, 11, 9, 36),
        },
      ],
    },
    {
      id: "2",
      title: "API Design Best Practices",
      startTime: new Date(2025, 5, 10, 14, 15),
      lastActivity: new Date(2025, 5, 10, 15, 30),
      category: "Backend",
      messageCount: 8,
      messages: [
        {
          id: "2-1",
          role: "user",
          content: "What are the best practices for REST API design?",
          timestamp: new Date(2025, 5, 10, 14, 15),
        },
        {
          id: "2-2",
          role: "assistant",
          content:
            "Here are key REST API design best practices:\n\n1. Use proper HTTP methods (GET, POST, PUT, DELETE)\n2. Use meaningful resource names\n3. Implement proper status codes\n4. Version your APIs\n5. Use consistent naming conventions",
          timestamp: new Date(2025, 5, 10, 14, 16),
        },
      ],
    },
    {
      id: "3",
      title: "Machine Learning Basics",
      startTime: new Date(2025, 5, 9, 11, 45),
      lastActivity: new Date(2025, 5, 9, 12, 30),
      category: "AI/ML",
      isFavorite: true,
      messageCount: 15,
      messages: [
        {
          id: "3-1",
          role: "user",
          content: "Can you explain supervised vs unsupervised learning?",
          timestamp: new Date(2025, 5, 9, 11, 45),
        },
        {
          id: "3-2",
          role: "assistant",
          content:
            "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.",
          timestamp: new Date(2025, 5, 9, 11, 46),
        },
      ],
    },
    {
      id: "4",
      title: "Database Optimization",
      startTime: new Date(2025, 5, 8, 16, 20),
      lastActivity: new Date(2025, 5, 8, 17, 10),
      category: "Database",
      messageCount: 6,
      messages: [
        {
          id: "4-1",
          role: "user",
          content: "How can I optimize my database queries?",
          timestamp: new Date(2025, 5, 8, 16, 20),
        },
        {
          id: "4-2",
          role: "assistant",
          content:
            "Database optimization techniques include proper indexing, query optimization, and database normalization.",
          timestamp: new Date(2025, 5, 8, 16, 21),
        },
      ],
    },
    {
      id: "5",
      title: "UI/UX Design Principles",
      startTime: new Date(2025, 5, 7, 10, 10),
      lastActivity: new Date(2025, 5, 7, 11, 0),
      category: "Design",
      messageCount: 10,
      messages: [
        {
          id: "5-1",
          role: "user",
          content: "What are the fundamental principles of good UI design?",
          timestamp: new Date(2025, 5, 7, 10, 10),
        },
        {
          id: "5-2",
          role: "assistant",
          content:
            "Good UI design follows principles like consistency, clarity, feedback, and accessibility.",
          timestamp: new Date(2025, 5, 7, 10, 11),
        },
      ],
    },
    {
      id: "6",
      title: "Cloud Computing Overview",
      startTime: new Date(2025, 5, 6, 13, 30),
      lastActivity: new Date(2025, 5, 6, 14, 15),
      category: "Cloud",
      messageCount: 7,
      messages: [
        {
          id: "6-1",
          role: "user",
          content: "What are the benefits of cloud computing?",
          timestamp: new Date(2025, 5, 6, 13, 30),
        },
        {
          id: "6-2",
          role: "assistant",
          content:
            "Cloud computing offers scalability, cost-effectiveness, and accessibility.",
          timestamp: new Date(2025, 5, 6, 13, 31),
        },
      ],
    },
  ]);

  const getFilteredSessions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let filtered = chatSessions.filter((session) => {
      const sessionDate = new Date(
        session.lastActivity.getFullYear(),
        session.lastActivity.getMonth(),
        session.lastActivity.getDate()
      );

      switch (timeFilter) {
        case "today":
          return sessionDate.getTime() === today.getTime();
        case "yesterday":
          return sessionDate.getTime() === yesterday.getTime();
        case "lastWeek":
          return session.lastActivity >= lastWeek;
        case "lastMonth":
          return session.lastActivity >= lastMonth;
        case "overall":
        default:
          return true;
      }
    });

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.messages.some((message) =>
            message.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.lastActivity.getTime() - a.lastActivity.getTime();
        case "oldest":
          return a.lastActivity.getTime() - b.lastActivity.getTime();
        case "messages":
          return b.messageCount - a.messageCount;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleSessionClick = (session: ChatSession) => {
    setSelectedSession(session);
    setShowSessionDialog(true);
  };

  const handleToggleFavorite = (sessionId: string) => {
    console.log(`Toggle favorite for session ${sessionId}`);
  };

  const handleDeleteSession = (sessionId: string) => {
    console.log(`Delete session ${sessionId}`);
  };

  const handleExportSession = (session: ChatSession) => {
    console.log(`Export session ${session.title}`);
  };

  const getCategoryColor = (category?: string) => {
    const colors = {
      Development: "bg-blue-100 text-blue-700 border-blue-200",
      Backend: "bg-green-100 text-green-700 border-green-200",
      "AI/ML": "bg-purple-100 text-purple-700 border-purple-200",
      Database: "bg-orange-100 text-orange-700 border-orange-200",
      Design: "bg-pink-100 text-pink-700 border-pink-200",
      Cloud: "bg-sky-100 text-sky-700 border-sky-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getTimeFilterLabel = (filter: TimeFilter) => {
    const labels = {
      today: "Today",
      yesterday: "Yesterday",
      lastWeek: "Last Week",
      lastMonth: "Last Month",
      overall: "All Time",
    };
    return labels[filter];
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredSessions = getFilteredSessions();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-sky-600 px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-sky-700 mb-1">
              Chat History
            </h1>
            <p className="text-sm text-sky-600/70">
              view and manage your AI interactions
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                ref={containerRef}
                className="relative inline-flex rounded-lg bg-white p-1"
              >
                {/* Sliding background */}
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute z-0 top-0 h-full rounded-full bg-sky-500 shadow-md"
                  style={{
                    width: bgStyle.width,
                    left: bgStyle.left,
                  }}
                />

                {/* Buttons */}
                <div className="relative z-10 flex gap-0">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      ref={(el) => {
                        buttonRefs.current[filter] = el;
                      }}
                      onClick={() => setTimeFilter(filter)}
                      className={cn(
                        "relative z-10 px-4 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none",
                        timeFilter === filter
                          ? "text-white"
                          : "text-sky-600 hover:text-sky-700"
                      )}
                    >
                      {getTimeFilterLabel(filter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-scroll p-6">
        {filteredSessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-sky-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No conversations found
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              {searchQuery
                ? "No conversations match your search criteria. Try a different search term."
                : `No conversations found for ${getTimeFilterLabel(
                    timeFilter
                  ).toLowerCase()}.`}
            </p>
            <Button
              className="gap-2 bg-sky-600 rounded-3xl hover:bg-sky-700 text-white"
              asChild
            >
              <Link href={"//surfer-ai"}>
                <Waves className="h-4 w-4" />
                Start SURFing
              </Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 py-2 border-b-[1.3px] border-b-sky-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-sky-700 mb-1">
                Interactions ({filteredSessions.length})
              </h2>
              <h2 className="text-lg font-medium text-sky-700 mb-1">
                Messages (
                {filteredSessions.reduce(
                  (total, session) => total + session.messageCount,
                  0
                )}
                )
              </h2>
            </div>

            <div className="grid gap-4">
              {filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className="shadow-none p-2 hover:shadow-lg rounded-4xl transition-all duration-200 cursor-pointer group border-transparent hover:bg-white"
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="pr-4 flex items-center justify-between gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center shadow-none">
                        <MessageCircleQuestion className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Message preview */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate group-hover:text-sky-600 transition-colors text-base">
                        {session.messages[0]?.content.slice(0, 70) ||
                          "No messages"}
                        {session.messages[0]?.content.length > 70 ? "..." : ""}
                      </h3>
                    </div>

                    {/* Info badges */}
                    <div className="flex items-center gap-4 text-sm font-medium group-hover:text-sky-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatRelativeTime(session.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Session Detail Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-sky-500" />
              {selectedSession?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedSession?.messageCount} messages • Started{" "}
              {selectedSession?.startTime.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gradient-to-b from-sky-50/30 to-white rounded-lg border border-sky-100">
              {selectedSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mt-1 shadow-sm">
                      <AvatarImage src="/Surf.png" />
                      <AvatarFallback className="bg-sky-100 text-sky-600 font-semibold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl p-4 shadow-sm",
                      message.role === "assistant"
                        ? "bg-white border border-sky-100"
                        : "bg-sky-500 text-white ml-auto"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <div
                      className={cn(
                        "text-xs mt-2",
                        message.role === "assistant"
                          ? "text-sky-500"
                          : "text-sky-100"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 mt-1 shadow-sm">
                      <AvatarImage src="/Surf.png" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-sky-100 pt-4 flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleFavorite(selectedSession?.id || "")}
                className="border-sky-200 text-sky-600 hover:bg-sky-50"
              >
                <Star className="h-4 w-4 mr-2" />
                {selectedSession?.isFavorite ? "Unfavorite" : "Favorite"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportSession(selectedSession!)}
                className="border-sky-200 text-sky-600 hover:bg-sky-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <Button className="gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-md">
              <MessageSquare className="h-4 w-4" />
              Continue Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
