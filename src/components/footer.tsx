"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  ChevronUp,
} from "lucide-react";

export interface AIParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [particles, setParticles] = useState<AIParticle[]>([]);
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: AIParticle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 2 + 0.5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speed * 0.1) % 100,
          opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.4,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      title: "AI Solutions",
      icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5" />,
      links: [
        { name: "Neural Networks", href: "#" },
        { name: "Machine Learning", href: "#" },
        { name: "Natural Language", href: "#" },
        { name: "Computer Vision", href: "#" },
        { name: "Predictive Analytics", href: "#" },
      ],
    },
    {
      title: "Platform",
      icon: <Zap className="h-4 w-4 sm:h-5 sm:w-5" />,
      links: [
        { name: "API Documentation", href: "#" },
        { name: "SDKs & Tools", href: "#" },
        { name: "Integrations", href: "#" },
        { name: "Pricing Plans", href: "#" },
        { name: "Enterprise", href: "#" },
      ],
    },
    {
      title: "Resources",
      icon: <Globe className="h-4 w-4 sm:h-5 sm:w-5" />,
      links: [
        { name: "AI Research", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Whitepapers", href: "#" },
        { name: "Webinars", href: "#" },
        { name: "Community", href: "#" },
      ],
    },
    {
      title: "Support",
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />,
      links: [
        { name: "Help Center", href: "#" },
        { name: "AI Assistant", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "System Status", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <Github className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />,
      href: "https://github.com/drjayaswal",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />,
      href: "https://linkedin.com/in/drjayaswal",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-transparent via-sky-400 to-sky-600 text-white overflow-hidden pt-6 sm:pt-8 md:pt-10">
      {/* AI Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-sky-200 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [
                particle.opacity,
                particle.opacity * 1.5,
                particle.opacity,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-10 md:pt-16 pb-6 sm:pb-8">
          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSection(section.title)}
                onMouseLeave={() => setHoveredSection(null)}
                className="space-y-2 sm:space-y-3 text-center md:text-left max-sm:border-b max-sm:pb-4"
              >
                <ul className="space-y-1.5 sm:space-y-2 flex flex-col items-center md:items-start">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + linkIndex * 0.05 }}
                      className="items-center"
                    >
                      <Link
                        href={link.href}
                        className="group flex items-center justify-center md:justify-between text-white/95 hover:text-white transition-all duration-200 text-sm sm:text-base leading-relaxed py-0.5"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200 leading-relaxed">
                          {link.name}
                        </span>
                        <ArrowRight className="ml-5 h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col space-y-4 sm:space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6 text-white/90 text-sm sm:text-base order-2 md:order-1">
              <p className="text-center md:text-left">
                &copy; 2025 SURFER. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                <Link
                  href="#"
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end space-y-3 sm:space-y-0 sm:space-x-4 order-1 md:order-2">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
              <div className="text-xs sm:text-sm text-white text-center sm:text-left">
                Powered by AI & Built with{" "}
                <span className="text-base sm:text-lg">🩷</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 animate-bounce text-sky-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
