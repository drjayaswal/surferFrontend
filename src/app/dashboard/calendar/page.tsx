"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Search,
  CalendarIcon,
  Clock,
  Send,
  Mic,
  MicOff,
  Loader2,
  Sparkles,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Morphe } from "@/components/ui/notes";

interface SearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  response?: string;
  category?: string;
}

interface DayData {
  date: Date;
  queries: SearchQuery[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Sample data - in a real app, this would come from your backend
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

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = getDaysInMonth(currentDate);

  const getCategoryColor = (category?: string) => {
    const colors = {
      Development: "bg-blue-100 text-blue-700 border-blue-200",
      Management: "bg-green-100 text-green-700 border-green-200",
      "AI/ML": "bg-purple-100 text-purple-700 border-purple-200",
      Database: "bg-orange-100 text-orange-700 border-orange-200",
      Design: "bg-pink-100 text-pink-700 border-pink-200",
      Cloud: "bg-sky-100 text-sky-700 border-sky-200",
      Security: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const filteredQueries = selectedDay?.queries.filter((query) =>
    query.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

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
                  "min-h-[108px] p-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                  dayData.isCurrentMonth ? "bg-white" : "-z-10",
                  dayData.isToday && "ring-0 ring-sky-500 bg-sky-50",
                  dayData.queries.length > 0 && "border-sky-200 bg-sky-50/50"
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
                        dayData.isToday && "text-sky-700 font-semibold"
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
                            className="h-8 w-8 p-0 text-gray-500 hover:text-sky-700 hover:bg-sky-600/10 cursor-grab active:cursor-grabbing"
                          >
                            <Eye className="h-4 w-4" />
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
          <div className="absolute bottom-40 left-[47vw]">
            <Morphe />
          </div>
        </div>
      </div>

      {/* Day Details Dialog */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-sky-500" />
              {selectedDay?.date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
            <DialogDescription>
              {selectedDay?.queries.length
                ? `${selectedDay?.queries.length} search queries on this day`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedDay && selectedDay.queries.length > 0 && (
            <>
              {/* Queries List */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {filteredQueries?.map((query) => (
                  <Card
                    key={query.id}
                    className="p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-gray-800 truncate">
                        {query.query.slice(0, 25)}
                        {query.query.length > 25 && "..."}
                      </h3>
                      <div className="flex justify-center text-sm items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {query.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredQueries?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No queries match your search</p>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedDay && selectedDay.queries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No search queries on this day</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
