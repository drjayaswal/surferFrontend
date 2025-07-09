"use client";

import { motion } from "framer-motion";
import InteractiveAIPlayground from "@/components/playground";
import Footer from "@/components/footer";
import LoginNavigation from "@/components/loginNavigation";
import BlurText from "@/components/ui/TextAnimations/BlurText/BlurText";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden text-gray-800">
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
