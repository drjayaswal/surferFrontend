"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  MessageSquare,
  Users,
  Briefcase,
  Code,
  Zap,
  CheckCircle,
  Bot,
  Calendar,
  Coffee,
  ArrowRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LoginNavigation from "@/components/loginNavigation";
import WaveBackground from "@/components/waveBackground";

interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  inquiryType: string;
  urgency: string;
}

interface AIResponse {
  suggestion: string;
  estimatedResponse: string;
  relevantTeam: string;
  priority: "low" | "medium" | "high";
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "",
    urgency: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI-powered form analysis
  useEffect(() => {
    if (formData.message.length > 50 && formData.inquiryType) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const response = generateAIResponse(formData);
        setAiResponse(response);
        setIsAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setAiResponse(null);
    }
  }, [formData]);

  const generateAIResponse = (data: FormData): AIResponse => {
    const responses = {
      sales: {
        suggestion:
          "I can help you explore our enterprise solutions and pricing options.",
        estimatedResponse: "2-4 hours",
        relevantTeam: "Sales Team",
        priority: "high" as const,
      },
      support: {
        suggestion:
          "I'll route this to our technical support team for immediate assistance.",
        estimatedResponse: "1-2 hours",
        relevantTeam: "Support Team",
        priority: "high" as const,
      },
      partnership: {
        suggestion:
          "Our partnerships team will review your proposal and get back to you.",
        estimatedResponse: "1-2 business days",
        relevantTeam: "Partnerships",
        priority: "medium" as const,
      },
      general: {
        suggestion:
          "I'll make sure your inquiry reaches the right team member.",
        estimatedResponse: "4-8 hours",
        relevantTeam: "General Inquiries",
        priority: "medium" as const,
      },
    };

    return (
      responses[data.inquiryType as keyof typeof responses] || responses.general
    );
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const inquiryTypes = [
    {
      value: "sales",
      label: "Sales & Pricing",
      icon: <Briefcase className="h-4 w-4" />,
      description: "Product demos, pricing, and enterprise solutions",
    },
    {
      value: "support",
      label: "Technical Support",
      icon: <Code className="h-4 w-4" />,
      description: "Bug reports, integration help, and troubleshooting",
    },
    {
      value: "partnership",
      label: "Partnerships",
      icon: <Users className="h-4 w-4" />,
      description: "Business partnerships and collaboration opportunities",
    },
    {
      value: "general",
      label: "General Inquiry",
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Questions, feedback, and other inquiries",
    },
  ];

  const contactMethods = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Us",
      description: "Get in touch via email",
      value: "hello@surfer.ai",
      action: "mailto:hello@surfer.ai",
      gradient: "from-sky-300 to-sky-500",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call Us",
      description: "Speak with our team",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
      gradient: "from-emerald-300 to-emerald-500",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Visit Us",
      description: "Our headquarters",
      value: "San Francisco, CA",
      action: "#",
      gradient: "from-pink-300 to-pink-500",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Business Hours",
      description: "We're here to help",
      value: "Mon-Fri, 9AM-6PM PST",
      action: "#",
      gradient: "from-red-300 to-red-500",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Head of Sales",
      specialty: "Enterprise Solutions",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "online",
      rating: 4.9,
    },
    {
      name: "Mike Rodriguez",
      role: "Technical Lead",
      specialty: "API Integration",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "online",
      rating: 4.8,
    },
    {
      name: "Emma Thompson",
      role: "Customer Success",
      specialty: "Onboarding & Training",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "away",
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 z-0">
        <WaveBackground opacity={0.1} />
      </div>
      <LoginNavigation />
      {/* Hero Section */}

      <section className="relative pb-10 pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-sky-200 via-sky-400 to-sky-600 bg-clip-text text-transparent leading-tight">
                Let's Start a Conversation
              </h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 lg:p-10 bg-white/30 backdrop-blur-sm border-0 shadow-2xl shadow-blue-500/10 rounded-2xl">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sky-400 rounded-xl flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-sky-400">
                          Send us a Message
                        </h2>
                      </div>
                      <p className="text-gray-600 text-base">
                        Fill out the form below and our AI will analyze your
                        inquiry to route it to the perfect team member.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Full Name *
                            </Label>
                            <Input
                              id="name"
                              placeholder="Enter your full name"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              className="h-12 border-0 shadow-none focus-visible:bg-sky-700/5 focus-visible:ring-0 rounded-xl"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@company.com"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="h-12 border-0 shadow-none focus-visible:bg-sky-700/5 focus-visible:ring-0 rounded-xl"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="company"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Company
                            </Label>
                            <Input
                              id="company"
                              placeholder="Your company name"
                              value={formData.company}
                              onChange={(e) =>
                                handleInputChange("company", e.target.value)
                              }
                              className="h-12 border-0 shadow-none focus-visible:bg-sky-700/5 focus-visible:ring-0 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="inquiryType"
                              className="text-sm font-semibold text-gray-700"
                            >
                              What can we help you with? *
                            </Label>
                            <Select
                              value={formData.inquiryType}
                              onValueChange={(value) =>
                                handleInputChange("inquiryType", value)
                              }
                            >
                              <SelectTrigger className="h-12 border-0 shadow-none focus-visible:ring-0 rounded-xl">
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                {inquiryTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                    className="rounded-lg"
                                  >
                                    <div className="flex items-start space-x-3 py-1">
                                      <div className="mt-0.5">{type.icon}</div>
                                      <div>
                                        <div className="font-medium">
                                          {type.label}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {type.description}
                                        </div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Message Section */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="subject"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Subject *
                          </Label>
                          <Input
                            id="subject"
                            placeholder="Brief description of your inquiry"
                            value={formData.subject}
                            onChange={(e) =>
                              handleInputChange("subject", e.target.value)
                            }
                            className="h-12 border-0 shadow-none focus-visible:bg-sky-700/5 focus-visible:ring-0 rounded-xl"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="message"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Message *
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us more about your needs, questions, or how we can help you succeed..."
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            className="min-h-32 resize-none h-12 border-0 shadow-none focus-visible:bg-sky-700/5 focus-visible:ring-0 rounded-xl"
                            required
                          />
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">
                              {formData.message.length} characters
                            </span>
                            {formData.message.length > 50 && (
                              <span className="text-blue-600 font-medium flex items-center space-x-1">
                                <Sparkles className="h-3 w-3" />
                                <span>AI analyzing...</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI Analysis Results */}
                      <AnimatePresence>
                        {(isAnalyzing || aiResponse) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 p-6 rounded-2xl border border-blue-100"
                          >
                            {isAnalyzing ? (
                              <div className="flex items-center justify-center space-x-3 py-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-white animate-pulse" />
                                </div>
                                <div className="text-gray-700 font-medium">
                                  AI is analyzing your message...
                                </div>
                              </div>
                            ) : (
                              aiResponse && (
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center">
                                      <Bot className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900">
                                        AI Analysis Complete
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Your message has been analyzed and
                                        categorized
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="bg-white/80 p-4 rounded-xl border border-white/50">
                                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                        Routing To
                                      </div>
                                      <div className="font-bold text-gray-900">
                                        {aiResponse.relevantTeam}
                                      </div>
                                    </div>
                                    <div className="bg-white/80 p-4 rounded-xl border border-white/50">
                                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                        Response Time
                                      </div>
                                      <div className="font-bold text-gray-900">
                                        {aiResponse.estimatedResponse}
                                      </div>
                                    </div>
                                    <div className="bg-white/80 p-4 rounded-xl border border-white/50">
                                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                        Priority Level
                                      </div>
                                      <Badge
                                        className={cn(
                                          "font-bold",
                                          aiResponse.priority === "high"
                                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                                            : aiResponse.priority === "medium"
                                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                            : "bg-green-100 text-green-700 hover:bg-green-100"
                                        )}
                                      >
                                        {aiResponse.priority.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="bg-white/80 p-4 rounded-xl border border-white/50">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                      AI Suggestion
                                    </div>
                                    <p className="text-gray-700 italic">
                                      "{aiResponse.suggestion}"
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          !formData.name ||
                          !formData.email ||
                          !formData.message
                        }
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-xl text-base shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Zap className="h-5 w-5 mr-2 animate-spin" />
                            Sending Your Message...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold text-gray-900">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 text-lg max-w-md mx-auto">
                        Thank you for reaching out. Our AI has analyzed your
                        message and routed it to the right team.
                        {aiResponse &&
                          ` You can expect a response within ${aiResponse.estimatedResponse}.`}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          company: "",
                          subject: "",
                          message: "",
                          inquiryType: "",
                          urgency: "medium",
                        });
                        setAiResponse(null);
                      }}
                      variant="outline"
                      className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Methods */}
            <Card className="p-6 bg-white/30 backdrop-blur-sm border-0 shadow-xl shadow-blue-500/5 rounded-2xl">
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={index}
                    href={method.action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-100"
                  >
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${method.gradient} text-white group-hover:scale-110 transition-transform duration-200`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {method.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {method.description}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {method.value}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </motion.a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
