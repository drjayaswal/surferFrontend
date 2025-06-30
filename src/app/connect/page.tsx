"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  Briefcase,
  Code,
  Handshake,
} from "lucide-react";
import LoginNavigation from "@/components/loginNavigation";
import Footer from "@/components/footer";
import ReportIssueForm from "@/components/report-form";

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
      avatar: "/Surf.png",
      status: "online",
      rating: 4.9,
    },
    {
      name: "Mike Rodriguez",
      role: "Technical Lead",
      specialty: "API Integration",
      avatar: "/Surf.png",
      status: "online",
      rating: 4.8,
    },
    {
      name: "Emma Thompson",
      role: "Customer Success",
      specialty: "Onboarding & Training",
      avatar: "/S",
      status: "away",
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen relative z-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <LoginNavigation />
      {/* Hero Section */}

      <header className="text-center pt-20 pb-15">
        <div className="inline-flex items-center justify-center p-3 bg-sky-500/15 rounded-full mb-6 border-0 shadow-none">
          <Handshake className="h-10 w-10 sm:h-12 sm:w-12 text-sky-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
            Want to Connect ?
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-xl text-sky-500/90 max-w-3xl mx-auto leading-relaxed">
          Got a feedback, tell a story, or just want to say hi? <br />
          We’d love to hear from you.
        </p>
      </header>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ReportIssueForm type="connect" />
      </div>
      <Footer />
    </div>
  );
}
