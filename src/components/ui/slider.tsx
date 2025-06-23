"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface CustomSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  trackColor?: string; // e.g., "bg-gray-300"
  rangeColor?: string; // e.g., "bg-sky-500"
  thumbColor?: string; // e.g., "bg-white border-sky-500"
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  trackColor = "bg-muted",
  rangeColor = "bg-sky-500",
  thumbColor = "bg-white border-sky-500",
  ...props
}: CustomSliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          trackColor,
          "relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 bg-sky-600/20"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            rangeColor,
            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            thumbColor,
            "ring-transparent block size-4 shrink-0 rounded-full border-0 shadow-sm transition-[color,box-shadow] hover:ring-4 bg-sky-500 focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
