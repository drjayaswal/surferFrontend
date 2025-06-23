"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import clsx from "clsx";

export default function SidebarToggleButton({
  className,
}: {
  className?: string;
}) {
  const { open: isOpen = false } = useSidebar();

  return (
    <div
      className={clsx(
        "fixed top-[8px] z-50 transition-all duration-300 ",
        isOpen ? "left-[220px]" : "left-[20px] top-[20px]"
      )}
    >
      <SidebarTrigger
        className={cn(
          isOpen
            ? "text-sky-600 hover:bg-sky-600 bg-sky-600/20 stroke-2.5 hover:text-white  rounded-none rounded-bl-[12px] rounded-tr-[12px] shadow-none py-3 backdrop-blur-sm border-0"
            : "text-white bg-sky-600 stroke-2.5 hover:bg-sky-600 hover:text-white  rounded-full shadow-none py-3 animate-spin",
          className
        )}
      />
    </div>
  );
}
