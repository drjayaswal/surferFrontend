"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, inputValue: string) => {
    if (inputValue.length > 1) {
      // Handle paste
      const pastedValue = inputValue.slice(0, length);
      onChange(pastedValue);

      // Focus the last filled input or the last input
      const nextIndex = Math.min(pastedValue.length - 1, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input
    const newValue = value.split("");
    newValue[index] = inputValue;

    // Remove empty slots at the end
    while (newValue.length > 0 && newValue[newValue.length - 1] === "") {
      newValue.pop();
    }

    onChange(newValue.join(""));

    // Move to next input if current is filled
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold rounded-xl border-2",
            "focus-visible:border-sky-500 focus-visible:ring-0",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            value[index] && "border-sky-500 bg-sky-50"
          )}
        />
      ))}
    </div>
  );
}
