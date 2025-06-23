"use client";

import { motion } from "framer-motion";

interface WaveBackgroundProps {
  className?: string;
  opacity?: number;
}

export default function WaveBackground({
  className = "",
  opacity = 0.6,
}: WaveBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Sky-400 Gradient */}
          <linearGradient
            id="wave-gradient-1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={opacity} />
            <stop
              offset="50%"
              stopColor="#38bdf8"
              stopOpacity={opacity * 0.8}
            />
            <stop
              offset="100%"
              stopColor="#38bdf8"
              stopOpacity={opacity * 0.6}
            />
          </linearGradient>

          {/* Sky-500 Gradient */}
          <linearGradient
            id="wave-gradient-2"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={opacity * 0.8} />
            <stop
              offset="50%"
              stopColor="#0ea5e9"
              stopOpacity={opacity * 0.6}
            />
            <stop
              offset="100%"
              stopColor="#0ea5e9"
              stopOpacity={opacity * 0.4}
            />
          </linearGradient>

          {/* Sky-600 Gradient */}
          <linearGradient
            id="wave-gradient-3"
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0284c7" stopOpacity={opacity * 0.7} />
            <stop
              offset="50%"
              stopColor="#0284c7"
              stopOpacity={opacity * 0.5}
            />
            <stop
              offset="100%"
              stopColor="#0284c7"
              stopOpacity={opacity * 0.3}
            />
          </linearGradient>
        </defs>

        {/* Three Animated Wave Paths */}
        <motion.path
          d="M0,350 C300,250 600,450 900,350 C1050,300 1150,400 1200,350 L1200,800 L0,800 Z"
          fill="url(#wave-gradient-1)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        <motion.path
          d="M0,450 C300,350 600,550 900,450 C1050,400 1150,500 1200,450 L1200,800 L0,800 Z"
          fill="url(#wave-gradient-2)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
        />

        <motion.path
          d="M0,550 C300,450 600,650 900,550 C1050,500 1150,600 1200,550 L1200,800 L0,800 Z"
          fill="url(#wave-gradient-3)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: 0.6, ease: "easeInOut" }}
        />

        {/* Enhanced Floating Elements - More Balls */}
        <motion.circle
          cx="150"
          cy="180"
          r="3"
          fill="#38bdf8"
          opacity={opacity * 2}
          animate={{
            y: [0, -20, 0],
            opacity: [opacity * 2, opacity * 4, opacity * 2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="280"
          cy="120"
          r="2"
          fill="#38bdf8"
          opacity={opacity * 1.8}
          animate={{
            y: [0, -15, 0],
            opacity: [opacity * 1.8, opacity * 3.5, opacity * 1.8],
          }}
          transition={{
            duration: 3.5,
            delay: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="420"
          cy="200"
          r="4"
          fill="#0ea5e9"
          opacity={opacity * 1.5}
          animate={{
            y: [0, -25, 0],
            opacity: [opacity * 1.5, opacity * 3, opacity * 1.5],
          }}
          transition={{
            duration: 4,
            delay: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="580"
          cy="160"
          r="2.5"
          fill="#0ea5e9"
          opacity={opacity * 2}
          animate={{
            y: [0, -18, 0],
            opacity: [opacity * 2, opacity * 3.8, opacity * 2],
          }}
          transition={{
            duration: 3.2,
            delay: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="720"
          cy="140"
          r="3.5"
          fill="#0284c7"
          opacity={opacity * 1.7}
          animate={{
            y: [0, -22, 0],
            opacity: [opacity * 1.7, opacity * 3.2, opacity * 1.7],
          }}
          transition={{
            duration: 3.8,
            delay: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="850"
          cy="190"
          r="2"
          fill="#0284c7"
          opacity={opacity * 2.2}
          animate={{
            y: [0, -16, 0],
            opacity: [opacity * 2.2, opacity * 4, opacity * 2.2],
          }}
          transition={{
            duration: 3.6,
            delay: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="980"
          cy="170"
          r="3"
          fill="#0284c7"
          opacity={opacity * 1.8}
          animate={{
            y: [0, -20, 0],
            opacity: [opacity * 1.8, opacity * 3.5, opacity * 1.8],
          }}
          transition={{
            duration: 4.2,
            delay: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="1100"
          cy="220"
          r="2.5"
          fill="#38bdf8"
          opacity={opacity * 2}
          animate={{
            y: [0, -18, 0],
            opacity: [opacity * 2, opacity * 3.8, opacity * 2],
          }}
          transition={{
            duration: 3.4,
            delay: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Additional floating elements in different areas */}
        <motion.circle
          cx="320"
          cy="280"
          r="1.5"
          fill="#38bdf8"
          opacity={opacity * 1.5}
          animate={{
            y: [0, -12, 0],
            opacity: [opacity * 1.5, opacity * 3, opacity * 1.5],
          }}
          transition={{
            duration: 2.8,
            delay: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="650"
          cy="250"
          r="2.8"
          fill="#0ea5e9"
          opacity={opacity * 1.9}
          animate={{
            y: [0, -19, 0],
            opacity: [opacity * 1.9, opacity * 3.6, opacity * 1.9],
          }}
          transition={{
            duration: 3.7,
            delay: 0.3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="480"
          cy="300"
          r="1.8"
          fill="#0284c7"
          opacity={opacity * 2.1}
          animate={{
            y: [0, -14, 0],
            opacity: [opacity * 2.1, opacity * 3.9, opacity * 2.1],
          }}
          transition={{
            duration: 3.1,
            delay: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="780"
          cy="280"
          r="2.2"
          fill="#38bdf8"
          opacity={opacity * 1.6}
          animate={{
            y: [0, -17, 0],
            opacity: [opacity * 1.6, opacity * 3.1, opacity * 1.6],
          }}
          transition={{
            duration: 3.9,
            delay: 2.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
