"use client";

import React, { useRef, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolbarProps } from "@/types/app.types";

const transition = {
  type: "spring" as const,
  bounce: 0.1,
  duration: 1,
};

function Button({
  className,
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className: string;
  ariaLabel?: string;
}) {
  return (
    <button
      className={`relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-sky-600 transition-colors hover:text-sky-700 focus-visible:ring-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default function Toolbar({
  icon,
  rightIcon,
  title = "",
  placeholder = "Type here...",
  onChange,
  type = "text",
  name,
  onClick,
  className,
  disabled = false,
  autoFocus = false,
  value,
}: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig transition={transition}>
      <div ref={containerRef} className="bg-transparent rounded-4xl">
        <div className={`h-full w-full rounded-xl border-sky-950/10`}>
          <motion.div
            animate={{ width: isOpen ? "100%" : "44px" }}
            initial={false}
          >
            <div className="overflow-hidden p-1">
              {!isOpen ? (
                <div className="flex space-x-2">
                  <Button
                    className="text-sky-600"
                    onClick={() => setIsOpen(true)}
                    ariaLabel={title}
                  >
                    {icon}
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    className="text-sky-600"
                    onClick={() => setIsOpen(false)}
                    ariaLabel="Back"
                  >
                    <ArrowLeft className="text-sky-600 h-8 w-8 ml-1" />
                  </Button>
                  <div className="relative w-full">
                    <input
                      className={cn(
                        "h-9 w-full rounded-lg border-0 bg-transparent p-2 text-xl text-sky-900 placeholder-sky-600 focus:outline-none",
                        className
                      )}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onClick={onClick}
                      disabled={disabled}
                      autoFocus={autoFocus}
                    />
                    {rightIcon && (
                      <div className="absolute right-0 text-sky-600 top-4.5 -translate-y-1/2">
                        {rightIcon}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
