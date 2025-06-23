import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import WaveBackground from "@/components/waveBackground";
import { Toaster } from "sonner";
import { BadgeAlert, BadgeCheck, BadgeInfo, Check, CheckCheck, CheckCircle, CheckCircle2, Croissant } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Surf the Wave of AI",
  description:
    "Surfer is your intelligent AI companion for work, research, and creativity. Ask anything, explore insights, and unlock new possibilities — all in one sleek, fast interface.",
  keywords: [
    "AI assistant",
    "Surfer AI",
    "Chatbot",
    "Next.js AI",
    "GPT interface",
    "AI productivity",
    "AI for research",
    "intelligent search",
    "creative AI tools",
    "Surfer app",
  ],
  authors: [{ name: "Surfer AI Team", url: "https://surfer.ai" }],
  creator: "Surfer AI",
  openGraph: {
    title: "Surfer — Surf the Wave of AI Innovation",
    description:
      "Fast. Smart. Beautiful. Meet Surfer, your AI-powered assistant for next-gen productivity.",
    url: "https://surfer.ai",
    siteName: "Surfer",
    images: [
      {
        url: "https://surfer.ai/og-image.jpg", // Replace with your OG image
        width: 1200,
        height: 630,
        alt: "Surfer AI OpenGraph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surfer — Your AI Copilot",
    description:
      "Surfer is an intuitive AI assistant for creators, students, and professionals.",
    images: ["https://surfer.ai/twitter-card.jpg"], // Replace as needed
    creator: "@surferai", // If you have a Twitter/X handle
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} bg-white ${geistMono.variable} antialiased`}
      >
        <Toaster

          icons={{ info: <BadgeInfo />, success: <BadgeCheck />,warning:<BadgeAlert/> }}
          position="top-right"
        />
        {children}
      </body>
    </html>
  );
}
