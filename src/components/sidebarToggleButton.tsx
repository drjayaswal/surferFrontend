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
        isOpen ? "left-[214.5px] top-[50vh]" : "-left-0.5 top-[50vh]"
      )}
    >
      <SidebarTrigger
        className={cn(
          isOpen
            ? "text-sky-600 hover:bg-sky-600 bg-sky-600/20 stroke-2.5 hover:text-white size-10 rounded-l-full shadow-none py-5"
            : "text-white bg-sky-600 stroke-2.5 hover:bg-sky-600 hover:text-white size-10 rounded-r-full shadow-none py-5",
          className
        )}
      />
    </div>
  );
}
