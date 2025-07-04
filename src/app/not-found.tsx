"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import LoginNavigation from "@/components/loginNavigation";

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
      {/* Text content */}
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
        </p>{" "}
      </motion.div>
      {/* Decorative waves */}
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
      <footer className="absolute bottom-0 left-0 right-0 z-20 w-full px-6 py-2 text-sm text-sky-700 bg-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>© 2025 Surfer AI</span>
          <span className="hidden sm:inline-block">• All rights reserved</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.486 2 12.012c0 4.424 2.865 8.176 6.839 9.504.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.34-3.37-1.34-.454-1.156-1.11-1.464-1.11-1.464-.909-.621.069-.609.069-.609 1.004.071 1.532 1.032 1.532 1.032.893 1.532 2.341 1.09 2.91.833.092-.647.35-1.091.636-1.342-2.22-.255-4.555-1.113-4.555-4.954 0-1.094.39-1.987 1.029-2.686-.103-.254-.446-1.278.098-2.663 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.91-1.295 2.748-1.025 2.748-1.025.546 1.385.202 2.409.1 2.663.64.699 1.027 1.592 1.027 2.686 0 3.852-2.338 4.695-4.566 4.945.36.309.678.92.678 1.854 0 1.338-.012 2.418-.012 2.747 0 .268.18.58.688.481A10.015 10.015 0 0022 12.012C22 6.486 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.3c-1 0-1.7-.7-1.7-1.6s.7-1.7 1.7-1.7 1.6.8 1.6 1.7-.7 1.6-1.6 1.6zm13.5 11.3h-3v-5.5c0-1.3-.5-2.2-1.6-2.2-.9 0-1.3.6-1.5 1.2-.1.3-.1.8-.1 1.3v5.2h-3s.1-8.5 0-10h3v1.4c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1v6z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
