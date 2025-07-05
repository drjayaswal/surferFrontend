"use client";

import { motion } from "framer-motion";
import LoginNavigation from "@/components/loginNavigation";
import SmallFooter from "@/components/smallFooter";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 via-sky-200 to-white text-gray-800 overflow-hidden px-6">
      <LoginNavigation />
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.07, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="absolute text-[22rem] font-extrabold text-sky-600 select-none pointer-events-none"
      >
        404
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-sky-700">
          Drifting in the wrong tide...
        </h2>
        <p className="text-lg mt-4 text-sky-600 max-w-md mx-auto">
          This page has sailed away or never existed
        </p>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{
            delay: 0.6 + 1 * 0.4,
            duration: 1.2,
            ease: "easeOut",
          }}
        >
          <svg
            className="w-full h-50"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,160L60,154.7C120,149,240,139,360,144C480,149,600,171,720,181.3C840,192,960,192,1080,181.3C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              className="text-sky-500"
            />
          </svg>
        </motion.div>
      </div>
      <SmallFooter />
    </div>
  );
}
