"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowDown, Shapes } from "lucide-react";
import WaveBackground from "@/components/waveBackground";
import PremiumSearchBar from "@/components/searchBar";
import InteractiveAIPlayground from "@/components/playground";
import Footer from "@/components/footer";
import LoginNavigation from "@/components/loginNavigation";
import BlurText from "@/components/ui/TextAnimations/BlurText/BlurText";

export default function Home() {
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("msg") || searchParams.get("message");

  useEffect(() => {
    if (urlQuery) {
      toast("Already Logged In..!");
      const url = new URL(window.location.href);
      url.searchParams.delete("msg");
      url.searchParams.delete("message");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [urlQuery]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaveActive(true);
      setTimeout(() => setIsWaveActive(false), 3000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    window.location.href = `/surfer-ai?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden text-gray-800">
      {/* AI-inspired wave background */}
      <WaveBackground opacity={0.2} />

      {/* Top Navigation */}
      <LoginNavigation />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[90vh] px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl w-full mx-auto text-center space-y-0 z-10">
          {/* Title with AI feel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <BlurText
              text="Welcome to Surfer Playground!"
              delay={150}
              animateBy="words"
              direction="top"
            //   onAnimationComplete={handleAnimationComplete}
              className="text-7xl"
            />
          </motion.div>

          {/* Playground */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            viewport={{ once: true }}
            className="pt-6"
          >
            <InteractiveAIPlayground />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
