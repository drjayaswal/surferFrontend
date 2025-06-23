"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface SiriWaveProps {
  isWaveMode: boolean;
  colors?: string[];
  height?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  waveCount?: number;
  style?: "bars" | "smooth" | "hybrid";
  responsive?: boolean;
}

const SiriWave: React.FC<SiriWaveProps> = ({
  isWaveMode,
  colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"],
  height = 30,
  amplitude = 15,
  frequency = 0.02,
  speed = 1,
  waveCount = 4,
  style = "hybrid",
  responsive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>(0);
  const [containerWidth, setContainerWidth] = useState(800);
  const [currentAmplitude, setCurrentAmplitude] = useState(0);
  const timeRef = useRef(0);

  // Memoized wave configuration for performance
  const waveConfig = useMemo(
    () =>
      Array.from({ length: waveCount }, (_, i) => ({
        id: `wave-${i}`,
        frequency: frequency + i * 0.003,
        speed: speed + i * 0.2,
        phaseOffset: i * 60,
        opacity: 0.4 + i * 0.15,
        strokeWidth: 2 - i * 0.3,
      })),
    [waveCount, frequency, speed]
  );

  // Optimized resize handler with debouncing
  const handleResize = useCallback(() => {
    if (containerRef.current && responsive) {
      const newWidth = containerRef.current.offsetWidth;
      if (Math.abs(newWidth - containerWidth) > 10) {
        setContainerWidth(newWidth);
      }
    }
  }, [containerWidth, responsive]);

  // Smooth amplitude transition
  useEffect(() => {
    const targetAmplitude = isWaveMode ? amplitude : 1;
    const duration = 500; // ms
    const startTime = Date.now();
    const startAmplitude = currentAmplitude;

    const animateAmplitude = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      const newAmplitude =
        startAmplitude + (targetAmplitude - startAmplitude) * easeProgress;

      setCurrentAmplitude(newAmplitude);

      if (progress < 1) {
        requestAnimationFrame(animateAmplitude);
      }
    };

    animateAmplitude();
  }, [isWaveMode, amplitude, currentAmplitude]);

  // Optimized wave generation function
  const generateWavePath = useCallback(
    (waveIndex: number, time: number): string => {
      const config = waveConfig[waveIndex];
      if (!config) return "";

      const points: string[] = [];
      const centerY = height / 2;
      const step = Math.max(2, containerWidth / 200); // Adaptive step size

      for (let x = 0; x <= containerWidth; x += step) {
        const normalizedX = x / containerWidth;
        const waveY =
          centerY +
          Math.sin(
            (normalizedX * Math.PI * 8 +
              time * config.speed +
              config.phaseOffset) *
              config.frequency
          ) *
            currentAmplitude *
            (0.5 + 0.5 * Math.sin(normalizedX * Math.PI)); // Fade at edges

        points.push(`${x},${waveY}`);
      }

      return `M${points.join(" L")}`;
    },
    [waveConfig, height, containerWidth, currentAmplitude]
  );

  // Main animation loop with performance optimization
  const animate = useCallback(() => {
    if (!svgRef.current) return;

    timeRef.current += 0.02;

    // Batch DOM updates
    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path, index) => {
      const d = generateWavePath(index, timeRef.current);
      if (d !== path.getAttribute("d")) {
        path.setAttribute("d", d);
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [generateWavePath]);

  // Initialize and cleanup animation
  useEffect(() => {
    if (isWaveMode || currentAmplitude > 0.1) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isWaveMode, currentAmplitude]);

  // Resize observer for responsive behavior
  useEffect(() => {
    if (!responsive) return;

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      handleResize(); // Initial size
    }

    return () => resizeObserver.disconnect();
  }, [handleResize, responsive]);

  // Render different styles
  const renderWaveContent = () => {
    switch (style) {
      case "bars":
        return (
          <motion.div
            className="flex gap-1 w-full justify-center items-end px-2"
            animate={isWaveMode ? "active" : "idle"}
            variants={{
              active: {
                transition: {
                  staggerChildren: 0.03,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                },
              },
              idle: {},
            }}
          >
            {Array.from({ length: Math.floor(containerWidth / 8) }).map(
              (_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full flex-shrink-0"
                  style={{
                    background: `linear-gradient(to top, ${
                      colors[i % colors.length]
                    }, ${colors[(i + 1) % colors.length]})`,
                  }}
                  variants={{
                    active: {
                      height: [2, Math.random() * (height - 4) + 4, 2],
                      opacity: [0.3, 0.8, 0.3],
                      transition: {
                        duration: 0.8 + Math.random() * 0.4,
                        ease: "easeInOut",
                      },
                    },
                    idle: {
                      height: 2,
                      opacity: 0.3,
                    },
                  }}
                />
              )
            )}
          </motion.div>
        );

      case "smooth":
        return (
          <svg
            ref={svgRef}
            width="100%"
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
            preserveAspectRatio="none"
            className="absolute inset-0"
          >
            <defs>
              {colors.map((color, i) => (
                <linearGradient
                  key={i}
                  id={`gradient-${i}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                  <stop offset="50%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                </linearGradient>
              ))}
            </defs>
            {waveConfig.map((config, i) => (
              <path
                key={config.id}
                stroke={`url(#gradient-${i % colors.length})`}
                strokeWidth={config.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={config.opacity}
              />
            ))}
          </svg>
        );

      case "hybrid":
      default:
        return (
          <div className="relative w-full h-full flex items-center">
            {/* Background bars */}
            <motion.div
              className="absolute inset-0 flex gap-1 justify-center items-end px-2"
              animate={isWaveMode ? "active" : "idle"}
              variants={{
                active: {
                  transition: {
                    staggerChildren: 0.05,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  },
                },
                idle: {},
              }}
            >
              {Array.from({ length: Math.floor(containerWidth / 12) }).map(
                (_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full flex-shrink-0 opacity-30"
                    style={{
                      background: colors[i % colors.length],
                    }}
                    variants={{
                      active: {
                        height: [1, Math.random() * (height / 2) + 2, 1],
                        transition: {
                          duration: 1 + Math.random() * 0.5,
                          ease: "easeInOut",
                        },
                      },
                      idle: {
                        height: 1,
                      },
                    }}
                  />
                )
              )}
            </motion.div>

            {/* Foreground smooth waves */}
            <svg
              ref={svgRef}
              width="100%"
              height={height}
              viewBox={`0 0 ${containerWidth} ${height}`}
              preserveAspectRatio="none"
              className="absolute inset-0"
            >
              <defs>
                {colors.map((color, i) => (
                  <linearGradient
                    key={i}
                    id={`hybrid-gradient-${i}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity="0" />
                    <stop offset="25%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="75%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              {waveConfig.slice(0, 2).map((config, i) => (
                <path
                  key={config.id}
                  stroke={`url(#hybrid-gradient-${i % colors.length})`}
                  strokeWidth={config.strokeWidth + 1}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={config.opacity + 0.2}
                />
              ))}
            </svg>
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: `${height}px`,
        minHeight: `${height}px`,
      }}
      aria-hidden="true"
    >
      {renderWaveContent()}
    </div>
  );
};

export default SiriWave;
