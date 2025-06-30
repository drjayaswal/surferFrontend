"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Eye,
  EyeClosed,
  EyeOff,
  MousePointerClickIcon,
  SearchCheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Morphe } from "@/components/ui/notes";
import { monthNames } from "@/lib/const";
import { useHydrateUser } from "@/hooks/useHydrateUser";
import { userStore } from "@/stores/userStore";
import { DayData, Note, SearchQuery } from "@/types/app.types";
import { NotesModal } from "./component/noteModal";


export default function CalendarPage() {
  useHydrateUser();

  const user = userStore((s) => s.user);
  const loading = userStore((s) => s.loading);
  const setUser = userStore((s) => s.setUser);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleToggle = () => setVisible((prev) => !prev);

  // Assuming Note type is defined elsewhere, or import it if needed
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (user?.notes) {
      setNotes(user.notes);
    }
  }, [user]);

  const [searchQueries] = useState<SearchQuery[]>([
    {
      id: "1",
      query: "How to implement React hooks?",
      timestamp: new Date(2025, 5, 10, 9, 30),
    },
    {
      id: "2",
      query: "Best practices for API design",
      timestamp: new Date(2025, 5, 10, 14, 15),
    },
    {
      id: "3",
      query: "Project management methodologies",
      timestamp: new Date(2025, 5, 9, 11, 45),
    },
    {
      id: "4",
      query: "Machine learning algorithms overview",
      timestamp: new Date(2025, 5, 8, 16, 20),
    },
    {
      id: "5",
      query: "Database optimization techniques",
      timestamp: new Date(2025, 5, 7, 10, 10),
    },
    {
      id: "63",
      query: "UI/UX design principles",
      timestamp: new Date(2025, 5, 6, 13, 30),
    },
    {
      id: "62",
      query: "UI/UX design principles",
      timestamp: new Date(2025, 5, 6, 13, 30),
    },
    {
      id: "61",
      query: "UI/UX design principles",
      timestamp: new Date(2025, 5, 6, 13, 30),
    },
    {
      id: "60",
      query: "UI/UX design principles",
      timestamp: new Date(2025, 5, 6, 13, 30),
    },
    {
      id: "6",
      query: "UI/UX design principles",
      timestamp: new Date(2025, 5, 6, 13, 30),
    },
    {
      id: "7",
      query: "Cloud computing benefits",
      timestamp: new Date(2025, 5, 5, 15, 45),
    },
    {
      id: "8",
      query: "Cybersecurity best practices",
      timestamp: new Date(2025, 5, 4, 12, 0),
    },
  ]);

  const getDaysInMonth = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: DayData[] = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate,
        queries: getQueriesForDate(prevDate),
        isToday: false,
        isCurrentMonth: false,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      days.push({
        date: currentDay,
        queries: getQueriesForDate(currentDay),
        isToday: isSameDay(currentDay, today),
        isCurrentMonth: true,
      });
    }

    // Add empty cells for days after the last day of the month
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        queries: getQueriesForDate(nextDate),
        isToday: false,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getQueriesForDate = (date: Date): SearchQuery[] => {
    return searchQueries.filter((query) => isSameDay(query.timestamp, date));
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (dayData: DayData) => {
    setSelectedDay(dayData);
    setShowDayDialog(true);
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Calendar Navigation */}
      <div className="border-b border-sky-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              className="bg-sky-700/10 text-sky-700 hover:bg-sky-700/20 hover:text-sky-700"
              size="icon"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4 scale-150" />
            </Button>
            <h2 className="text-lg font-semibold text-sky-700 ">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              className="bg-sky-700/10 text-sky-700 hover:bg-sky-700/20 hover:text-sky-700"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4 scale-150" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4 mt-5 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-1 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((dayData, index) => (
              <Card
                key={index}
                className={cn(
                  "min-h-[108px] p-2 cursor-pointer transition-all shadow-xs border-transparent border-2 duration-200",
                  dayData.isCurrentMonth ? "bg-white hover:shadow-md" : "-z-10",
                  dayData.isToday &&
                    "border-transparent bg-sky-500/50 shadow-xl hover:shadow-xl",
                  dayData.queries.length > 0 &&
                    "border-transparent hover:shadow-none shadow-none bg-sky-500/10"
                )}
                onClick={() => handleDayClick(dayData)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        dayData.isCurrentMonth
                          ? "text-gray-800"
                          : "text-gray-400",
                        dayData.isToday && "text-white font-semibold"
                      )}
                    >
                      {dayData.date.getDate()}
                    </span>
                    {dayData.queries.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-sky-500 hover:text-sky-700 hover:bg-sky-600/10 cursor-grab active:cursor-grabbing"
                          >
                            <SearchCheckIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="left"
                          className="text-[10px] text-sky-600 mr-2"
                        >
                          {dayData.queries.length}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="absolute bottom-40 left-[47vw] flex items-center justify-center gap-3">
            <Morphe />
            {notes.length > 0 && (
              <>
                <Button
                  className="hover:bg-sky-700 text-white bg-sky-500/70 px-3 hover:text-white cursor-pointer border-0 rounded-3xl"
                  onClick={() => setModalOpen(true)}
                >
                  View Notes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <NotesModal open={modalOpen} setOpen={setModalOpen} notes={notes} />

      {/* Day Details Dialog */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-hidden focus-visible:ring-0 flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-sky-500" />
              {selectedDay?.date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {selectedDay?.queries.length
                ? ` with ${selectedDay?.queries.length} searches`
                : " has no searches"}
              {selectedDay?.queries.length! > 0 && (
                <Button
                  className="absolute top-3.5 right-7 text-sm focus-visible:ring-0 bg-transparent text-sky-700 rounded-4xl hover:bg-transparent shadow-none hover:text-sky-700 select-none cursor-pointer"
                  onClick={handleToggle}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  {hovered ? (
                    <Eye className="size-7 transition-all duration-150" />
                  ) : (
                    <EyeClosed className="size-7 transition-all duration-150" />
                  )}
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
