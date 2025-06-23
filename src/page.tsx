"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import WaveBackground from "@/components/waveBackground";
import Navigation from "@/components/navigation";
import PremiumSearchBar from "@/components/searchBar";
import InteractiveAIPlayground from "@/components/playground";
import Footer from "@/components/footer";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("msg") || searchParams.get("message");

  useEffect(() => {
    if (urlQuery) {
      toast.info("Already Logged In..!");
    }
    if (typeof window !== "undefined" && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("msg");
      url.searchParams.delete("message");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, [urlQuery]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Activate wave animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaveActive(true);
      setTimeout(() => setIsWaveActive(false), 3000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Redirect to dashboard with search query
    window.location.href = `/dashboard/ai?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-full bg-white relative overflow-visible">
      <WaveBackground opacity={0.2} />
      <Navigation />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-sky-200 via-sky-400 to-sky-600 bg-clip-text text-transparent">
                  Surf the <span className="italic">Wave</span>
                </span>
                <br />
                <span className="text-gray-800">of AI Innovation</span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <PremiumSearchBar onSearch={handleSearch} />
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-200 via-sky-400 to-sky-600 bg-clip-text text-transparent mb-6">
              Ready to Surf the AI Wave?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-transparent  bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent px-1 py-5 text-xl shadow-none"
                >
                  Try Surfer Playground
                  <ArrowDown className="h-6 w-6 text-sky-500 animate-bounce" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="pb-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveAIPlayground />
        </div>
      </section>
      <Footer />
    </div>
  );
}
