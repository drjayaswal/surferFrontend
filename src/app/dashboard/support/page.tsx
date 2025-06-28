"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {

  Settings,
  HelpCircle,
  Shield,
  PlayCircle,
  FileText,
  Mail,
  CheckCircle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm here to help you with any questions about Surfer AI. What can I assist you with today?",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [helpfulFAQs, setHelpfulFAQs] = useState<Record<string, boolean>>({});
  const [unhelpfulFAQs, setUnhelpfulFAQs] = useState<Record<string, boolean>>(
    {}
  );
  const chatEndRef = useRef<HTMLDivElement>(null);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I get started with Surfer AI?",
      answer:
        "Getting started is easy! Simply sign up for an account, choose your plan, and start chatting with our AI assistant. You can access the chat interface from your dashboard.",
      category: "Getting Started",
      tags: ["setup", "account", "basics"],
      helpful: 45,
    },
    {
      id: "2",
      question: "What are tokens and how are they used?",
      answer:
        "Tokens are units of text that our AI processes. Each word or punctuation mark typically counts as one token. Your plan includes a certain number of tokens per month.",
      category: "Billing",
      tags: ["tokens", "usage", "billing"],
      helpful: 38,
    },
    {
      id: "3",
      question: "How can I improve my AI responses?",
      answer:
        "To get better responses, be specific in your questions, provide context, and use clear language. You can also use system prompts to guide the AI's behavior.",
      category: "Usage Tips",
      tags: ["optimization", "prompts", "quality"],
      helpful: 52,
    },
    {
      id: "4",
      question: "Is my data secure and private?",
      answer:
        "Yes, we take security seriously. All conversations are encrypted, and we don't use your data to train our models. You can delete your data at any time.",
      category: "Privacy & Security",
      tags: ["security", "privacy", "data"],
      helpful: 67,
    },
    {
      id: "5",
      question: "Can I integrate Surfer AI with other tools?",
      answer:
        "Yes! We offer API access and integrations with popular tools like Slack, Discord, and more. Check our integrations page for the full list.",
      category: "Integrations",
      tags: ["api", "integrations", "tools"],
      helpful: 29,
    },
    {
      id: "6",
      question: "What should I do if I'm experiencing slow responses?",
      answer:
        "Slow responses can be due to high server load or complex queries. Try simplifying your request or check our status page for any ongoing issues.",
      category: "Troubleshooting",
      tags: ["performance", "speed", "issues"],
      helpful: 33,
    },
  ];

  const categories = [
    {
      id: "all",
      name: "All Categories",
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      id: "getting-started",
      name: "Getting Started",
      icon: <PlayCircle className="h-4 w-4" />,
    },
    { id: "billing", name: "Billing", icon: <FileText className="h-4 w-4" /> },
    {
      id: "usage-tips",
      name: "Usage Tips",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      id: "privacy-security",
      name: "Privacy & Security",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "integrations",
      name: "Integrations",
      icon: <PlayCircle className="h-4 w-4" />,
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" ||
      faq.category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "") ===
        selectedCategory;

    return matchesCategory;
  });

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your question. Let me help you with that...",
        "That's a great question! Here's what I recommend...",
        "Based on our documentation, here's the solution...",
        "I can help you with that. Let me walk you through the steps...",
      ];

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responses[Math.floor(Math.random() * responses.length)] +
          " For more detailed information, please check our FAQ section or contact our support team.",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    if (isHelpful) {
      setHelpfulFAQs((prev) => ({ ...prev, [faqId]: true }));
      setUnhelpfulFAQs((prev) => ({ ...prev, [faqId]: false }));
    } else {
      setUnhelpfulFAQs((prev) => ({ ...prev, [faqId]: true }));
      setHelpfulFAQs((prev) => ({ ...prev, [faqId]: false }));
    }
  };

  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChat]);

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-4 pb-3 flex border-b-sky-600 border-b items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sky-700 mb-1">
            Support Center
          </h1>
          <p className="text-sm text-sky-600/70">
            Find answers, tutorials, and support
          </p>
        </div>

      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-none overflow-hidden">
              <CardContent>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sky-50 transition-colors",
                        selectedCategory === category.id &&
                          "bg-sky-50 text-sky-700 border-r-2 border-l-2 border-sky-600"
                      )}
                    >
                      {category.icon}
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 border-0 shadow-md rounded-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-800">
                  Need Help?
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Can’t find what you’re looking for? Contact our support team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-sky-700/10 text-sky-600 border-0 hover:bg-gradient-to-r from-sky-200 via-sky-300 to-sky-400 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-none overflow-hidden">
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-sky-800">
                    Frequently Asked Questions
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-sky-50 text-sky-700 border-sky-200"
                  >
                    {filteredFAQs.length} articles
                  </Badge>
                </div>

                {filteredFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-0 rounded-4xl px-6 shadow-none hover:shadow-md transition-all"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                            <span className="font-medium text-sky-900">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-8">
                          <p className="text-gray-700 mb-4">{faq.answer}</p>
                          <div className="flex items-center justify-between px-2">
                            <div className="flex gap-2 flex-wrap">
                              {faq.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-sky-50 text-sky-700 border-sky-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Was this helpful?</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "h-8 w-8 p-0",
                                    helpfulFAQs[faq.id] &&
                                      "bg-green-100 text-green-600"
                                  )}
                                  onClick={() => handleFeedback(faq.id, true)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "h-8 w-8 p-0",
                                    unhelpfulFAQs[faq.id] &&
                                      "bg-red-100 text-red-600"
                                  )}
                                  onClick={() => handleFeedback(faq.id, false)}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{faq.helpful} helpful</span>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 rounded-lg">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We couldn't find any FAQs. Browse by other categories.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
