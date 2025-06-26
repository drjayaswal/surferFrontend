import Footer from "@/components/footer";
import LoginNavigation from "@/components/loginNavigation";
import ReportIssueForm from "@/components/report-form";
import WaveBackground from "@/components/waveBackground";
import {
  Bot,
  LifeBuoy,
  Sparkles,
  BrainCircuit,
  HelpCircleIcon,
  Info,
  HelpingHand,
} from "lucide-react";

export default function ReportIssuePage() {
  return (
    <div className="min-h-full relative z-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div>
        {/* Animated Wave Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <WaveBackground opacity={0.2} />
        </div>
        <div className="pb-20">
          <LoginNavigation />
        </div>
        {/* Hero Section */}
        <header className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center p-3 bg-sky-500/15 rounded-full mb-6 border-0 shadow-none">
            <HelpingHand className="h-10 w-10 sm:h-12 sm:w-12 text-sky-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
              Need any Help?
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-xl text-sky-500/90 max-w-3xl mx-auto leading-relaxed">
            Spotted a bug, have a brilliant feature idea, or experiencing a
            hiccup? <br /> Let us know! Our AI-driven system helps us prioritize
            and resolve issues faster.
          </p>
        </header>

        {/* Form Section */}
        <main>
          <ReportIssueForm type="help" />
        </main>

        <Footer />
      </div>
    </div>
  );
}
