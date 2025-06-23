"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  Calendar,
  Clock,
  Download,
  FileText,
  LineChartIcon,
  MessageSquare,
  PieChartIcon,
  RefreshCw,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageData {
  date: string;
  messages: number;
  tokens: number;
  conversations: number;
}

interface TopicData {
  name: string;
  value: number;
  color: string;
}

interface ModelUsageData {
  model: string;
  usage: number;
  color: string;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<
    "7days" | "30days" | "90days" | "year"
  >("30days");

  // Sample data - in a real app, this would come from your backend
  const usageData: UsageData[] = [
    { date: "Jun 1", messages: 45, tokens: 6200, conversations: 5 },
    { date: "Jun 2", messages: 52, tokens: 7100, conversations: 6 },
    { date: "Jun 3", messages: 38, tokens: 5400, conversations: 4 },
    { date: "Jun 4", messages: 65, tokens: 8900, conversations: 7 },
    { date: "Jun 5", messages: 48, tokens: 6700, conversations: 5 },
    { date: "Jun 6", messages: 70, tokens: 9500, conversations: 8 },
    { date: "Jun 7", messages: 55, tokens: 7600, conversations: 6 },
    { date: "Jun 8", messages: 60, tokens: 8200, conversations: 7 },
    { date: "Jun 9", messages: 42, tokens: 5800, conversations: 5 },
    { date: "Jun 10", messages: 58, tokens: 7900, conversations: 6 },
    { date: "Jun 11", messages: 75, tokens: 10200, conversations: 9 },
  ];

  const topicData: TopicData[] = [
    { name: "Development", value: 35, color: "#3b82f6" },
    { name: "Design", value: 20, color: "#ec4899" },
    { name: "Business", value: 15, color: "#10b981" },
    { name: "AI/ML", value: 12, color: "#8b5cf6" },
    { name: "Database", value: 10, color: "#f59e0b" },
    { name: "Other", value: 8, color: "#6b7280" },
  ];

  const modelUsageData: ModelUsageData[] = [
    { model: "GPT-4o", usage: 65, color: "#0ea5e9" },
    { model: "GPT-3.5", usage: 25, color: "#8b5cf6" },
    { model: "Claude", usage: 10, color: "#f43f5e" },
  ];

  const timeRangeOptions = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "year", label: "Last Year" },
  ];

  // Calculate total usage statistics
  const totalMessages = usageData.reduce((sum, day) => sum + day.messages, 0);
  const totalTokens = usageData.reduce((sum, day) => sum + day.tokens, 0);
  const totalConversations = usageData.reduce(
    (sum, day) => sum + day.conversations,
    0
  );
  const averageMessagesPerDay = Math.round(totalMessages / usageData.length);
  const averageTokensPerMessage = Math.round(totalTokens / totalMessages);

  // Calculate growth rates (sample data)
  const messageGrowth = 12.5; // percentage
  const tokenGrowth = 18.2;
  const conversationGrowth = 8.7;

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-sky-600 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-sky-700 mb-1">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-sky-600/70">
              Track your AI assistant usage and insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-sky-200 text-sky-600 hover:bg-sky-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-sky-200 text-sky-600 hover:bg-sky-50"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-sky-200 text-sky-600 hover:bg-sky-50"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-sky-600" />
            <div className="flex gap-2">
              {timeRangeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-sm transition-all duration-200",
                    timeRange === option.value
                      ? "bg-sky-600 text-white hover:bg-sky-700 shadow-md"
                      : "text-sky-600 border-sky-200 hover:bg-sky-50 hover:border-sky-300"
                  )}
                  onClick={() => setTimeRange(option.value as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-sky-600">Last updated:</span>
            <span className="text-sm font-medium text-gray-700">
              June 11, 2025, 10:45 AM
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-sky-100 bg-gradient-to-br from-white to-sky-50/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600/70 mb-1">
                    Total Messages
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {formatNumber(totalMessages)}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        messageGrowth > 0
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {messageGrowth > 0 ? "+" : ""}
                      {messageGrowth}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    vs. previous period
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-sky-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-sky-100">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">{averageMessagesPerDay}</span>{" "}
                  messages per day on average
                </p>
              </div>
            </Card>

            <Card className="p-6 border-sky-100 bg-gradient-to-br from-white to-sky-50/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600/70 mb-1">
                    Total Tokens
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {formatNumber(totalTokens)}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        tokenGrowth > 0
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {tokenGrowth > 0 ? "+" : ""}
                      {tokenGrowth}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    vs. previous period
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-sky-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-sky-100">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">{averageTokensPerMessage}</span>{" "}
                  tokens per message on average
                </p>
              </div>
            </Card>

            <Card className="p-6 border-sky-100 bg-gradient-to-br from-white to-sky-50/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600/70 mb-1">
                    Conversations
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {totalConversations}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        conversationGrowth > 0
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {conversationGrowth > 0 ? "+" : ""}
                      {conversationGrowth}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    vs. previous period
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-sky-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-sky-100">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">
                    {Math.round(totalMessages / totalConversations)}
                  </span>{" "}
                  messages per conversation
                </p>
              </div>
            </Card>

            <Card className="p-6 border-sky-100 bg-gradient-to-br from-white to-sky-50/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600/70 mb-1">
                    Average Response Time
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">1.2s</h3>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 text-xs font-medium"
                    >
                      -8.3%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    vs. previous period
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-sky-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-sky-100">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">98.7%</span> of responses under
                  2 seconds
                </p>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="usage" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-sky-100/50">
                <TabsTrigger
                  value="usage"
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Usage
                </TabsTrigger>
                <TabsTrigger
                  value="topics"
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                >
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Topics
                </TabsTrigger>
                <TabsTrigger
                  value="models"
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                >
                  <LineChartIcon className="h-4 w-4 mr-2" />
                  Models
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Chart Type:</span>
                <Select defaultValue="bar">
                  <SelectTrigger className="w-[140px] border-sky-200 text-sky-600 bg-sky-50/50">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="usage" className="mt-0">
              <Card className="p-6 border-sky-100">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Usage Over Time
                  </h3>
                  <p className="text-sm text-gray-500">
                    Messages and tokens used per day
                  </p>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={usageData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        cursor={{ fill: "rgba(236, 253, 245, 0.4)" }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="messages"
                        name="Messages"
                        fill="#0ea5e9"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="tokens"
                        name="Tokens"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="topics" className="mt-0">
              <Card className="p-6 border-sky-100">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Conversation Topics
                  </h3>
                  <p className="text-sm text-gray-500">
                    Distribution of conversation topics
                  </p>
                </div>
                <div className="h-[400px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={topicData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {topicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            `${value} conversations`,
                            "Count",
                          ]}
                          contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {topicData.map((topic) => (
                      <div key={topic.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: topic.color }}
                        />
                        <span className="text-sm text-gray-700">
                          {topic.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {topic.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="models" className="mt-0">
              <Card className="p-6 border-sky-100">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Model Usage
                  </h3>
                  <p className="text-sm text-gray-500">
                    Distribution of AI model usage
                  </p>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={usageData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        cursor={{ stroke: "#0ea5e9", strokeWidth: 1 }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="conversations"
                        name="GPT-4o"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{
                          r: 6,
                          stroke: "#0ea5e9",
                          strokeWidth: 2,
                          fill: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="messages"
                        name="GPT-3.5"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{
                          r: 6,
                          stroke: "#8b5cf6",
                          strokeWidth: 2,
                          fill: "#fff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 border-sky-100 bg-gradient-to-br from-white to-sky-50/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Usage Patterns
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sky-600 hover:bg-sky-50 h-8 px-2"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Time Analysis
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Most Active Day
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      Monday
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Most Active Time
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      10:00 AM - 12:00 PM
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Average Session Duration
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      18 minutes
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Messages per Session
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      8.3 messages
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: "55%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-sky-100 bg-gradient-to-br from-white to-sky-50/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Model Performance
                </h3>
                <Select defaultValue="gpt4o">
                  <SelectTrigger className="w-[140px] border-sky-200 text-sky-600 bg-sky-50/50 h-8">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt35">GPT-3.5</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {modelUsageData.map((model) => (
                    <div key={model.model} className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${model.color}20`,
                          color: model.color,
                        }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {model.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          {model.usage}% of usage
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-sky-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Average Response Time
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      1.2 seconds
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      User Satisfaction
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      92%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Accuracy Rating
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      89%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "89%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 border-sky-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Recent Activity
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-sky-200 text-sky-600 hover:bg-sky-50"
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 pb-4 border-b border-sky-100 last:border-0"
                >
                  <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-800 truncate">
                        {
                          [
                            "React Component Design",
                            "Database Optimization",
                            "API Authentication",
                            "UI/UX Principles",
                            "Performance Testing",
                          ][i - 1]
                        }
                      </h4>
                      <span className="text-xs text-gray-500">
                        {i * 2}h ago
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {
                        [
                          "Discussion about component architecture and state management",
                          "Query optimization and indexing strategies",
                          "OAuth2 implementation and security best practices",
                          "Design system consistency and accessibility guidelines",
                          "Load testing and performance benchmarking",
                        ][i - 1]
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 border-sky-100 bg-gradient-to-br from-white to-sky-50/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Recommendations
              </h3>
              <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200">
                AI Generated
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Try more complex prompts
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your conversations tend to be brief. Try more detailed
                    prompts to get more comprehensive responses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Explore GPT-4o capabilities
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    You're primarily using GPT-3.5. Try GPT-4o for more complex
                    tasks like code generation and analysis.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Use conversation history
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    You often start new conversations for related topics. Try
                    continuing existing threads for context.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
