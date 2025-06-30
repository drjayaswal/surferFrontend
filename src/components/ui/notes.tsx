"use client";
import {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
} from "@/components/ui/morphing-popover";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { userStore } from "@/stores/userStore";

export function Morphe() {
  const uniqueId = useId();
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const user = userStore((s) => s.user);
  const loading = userStore((s) => s.loading);
  const setUser = userStore((s) => s.setUser);

  const closeMenu = () => {
    setNote("");
    setIsOpen(false);
  };

  const handleUploadNotes = async () => {
    const toastId = toast.loading("Creating Note...");
    try {
      const response = await apiClient.uploadNote({ content: note });
      if (response.success) {
        const surferRaw = localStorage.getItem("surfer");
        if (surferRaw) {
          const surfer = JSON.parse(surferRaw);
          surfer.state.user.notes = [
            ...(surfer.state.user.notes || []),
            response.data,
          ];
          localStorage.setItem("surfer", JSON.stringify(surfer));
        }
        if (user) {
          setUser({
            ...user,
            notes: [...(user.notes || []), response.data],
          });
        }
        toast.dismiss(toastId);
        toast.success("Note Added!");
      } else {
        toast.error(response.message || "Failed to upload note");
        toast.dismiss(toastId);
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };
  return (
    <MorphingPopover
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.3,
      }}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <MorphingPopoverTrigger className="flex h-9 items-center rounded-xl shadow-none border-0 bg-sky-500/10 px-3 text-sky-500 ">
        <motion.span
          layoutId={`popover-label-${uniqueId}`}
          className="text-sm cursor-pointer"
        >
          Add Note
        </motion.span>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent className="rounded-xl bg-white border-2 border-sky-500/50 p-0 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)]">
        <div className="h-[200px] w-[364px]">
          <form
            className="flex h-full flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleUploadNotes();
            }}
          >
            <motion.span
              layoutId={`popover-label-${uniqueId}`}
              aria-hidden="true"
              style={{
                opacity: note ? 0 : 1,
              }}
              className="absolute top-3 left-4 text-sm text-zinc-500 select-none"
            >
              Add Note
            </motion.span>
            <textarea
              className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-hidden"
              autoFocus
              onChange={(e) => setNote(e.target.value)}
            />
            <div key="close" className="flex justify-between py-3 pr-4 pl-2">
              <button
                type="button"
                className="flex items-center rounded-lg bg-white px-2 py-1 text-sm text-zinc-950 hover:bg-sky-100 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
                onClick={closeMenu}
                aria-label="Close popover"
              >
                <ArrowLeftIcon
                  size={16}
                  className="text-sky-500 cursor-pointer"
                />
              </button>
              <button
                className="relative ml-1 flex h-8 shrink-0 scale-100 appearance-none items-center justify-center rounded-lg bg-transparent px-2 text-sm text-sky-500 transition-colors select-none hover:bg-sky-100 hover:text-sky-500 focus-visible:ring-0 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
                type="submit"
                aria-label="Submit note"
                onClick={() => {
                  closeMenu();
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}
