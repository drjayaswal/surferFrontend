import { Lock, Hourglass } from "lucide-react";
import { cn } from "@/lib/utils"; // optional utility if you're using classnames smartly

export default function UpcomingBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
        className
      )}
    >
      <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl px-6 py-4 text-center space-y-2 max-w-xs mx-auto animate-in fade-in zoom-in">
        <div className="inline-flex items-center gap-2 text-sky-600 text-sm font-semibold uppercase tracking-wide">
          <Hourglass className="w-4 h-4 animate-pulse" />
          Coming Soon
        </div>
        <div className="flex items-center justify-center text-gray-800 text-base font-medium">
          <Lock className="w-5 h-5 mr-2 text-gray-500" />
          This page is currently restricted.
        </div>
        <p className="text-sm text-gray-600">
          We’re building this feature
        </p>
      </div>
    </div>
  );
}
