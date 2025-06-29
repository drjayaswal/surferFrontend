"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  Download,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  Mail,
  Smartphone,
  Lock,
  Key,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Camera,
  Zap,
  Loader2,
  MessageCircleQuestion,
} from "lucide-react";
import { cn, toBase64 } from "@/lib/utils";
import { ActivityLog } from "@/types/app.types";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { userStore } from "@/stores/userStore";
import { useHydrateUser } from "@/hooks/useHydrateUser";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { usePathname, useRouter } from "next/navigation";

export default function SettingsPage() {
  useHydrateUser();

  const user = userStore((s) => s.user);
  const loading = userStore((s) => s.loading);
  const setUser = userStore((s) => s.setUser);
  const authChecked = userStore((s) => s.authChecked);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Surfer AI",
    siteDescription:
      "Your intelligent AI assistant for productivity and creativity",
    primaryColor: "#3B82F6",
    secondaryColor: "#0EA5E9",
    logo: "/Surf.png",
    favicon: "/favicon.ico",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    marketingEmails: false,
    usageAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    dataSharing: false,
    analyticsTracking: true,
    cookieConsent: true,
  });

  if (!user || loading || !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-sky-500" />
        <p className="ml-2 text-sm text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      toast.error("Please upload only one avatar");
      return;
    }

    const file = files[0];

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only images are allowed");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Avatar image must be under 2MB");
      return;
    }


    const toastId = toast.loading("Uploading Avatar...");
    try {
      const response = await apiClient.uploadProfilePic({ file });
      if (response.success) {
        const base64 = await toBase64(file);
        const surferRaw = localStorage.getItem("surfer");
        if (surferRaw) {
          const surfer = JSON.parse(surferRaw);
          surfer.state.user.avatar = base64;
          localStorage.setItem("surfer", JSON.stringify(surfer));
        }
        if (user) {
          setUser({ ...user, avatar: base64 });
        }
    
        toast.dismiss(toastId);
        toast.success("Avatar Uploaded!");
      } else {
        toast.error(response.message || "Failed to upload avatar");
        toast.dismiss(toastId);
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };

  const activityLogs: ActivityLog[] = [
    {
      id: "1",
      action: "Password Changed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      details: "Password was successfully updated",
      type: "success",
    },
    {
      id: "2",
      action: "API Key Generated",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      details: "New API key created for integration",
      type: "info",
    },
    {
      id: "3",
      action: "Login from New Device",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      details: "Login detected from Chrome on Windows",
      type: "warning",
    },
    {
      id: "4",
      action: "Subscription Upgraded",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      details: "Upgraded to Pro plan",
      type: "success",
    },
  ];

  const handleSave = () => {
    setUnsavedChanges(false);
    // Simulate save logic here
  };

  const handleExportData = () => {
    const data = {
      profile: user,
      settings: siteSettings,
      notifications,
      privacy,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "surfer-ai-settings.json";
    a.click();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  const handleDeleteData = async () => {
    localStorage.removeItem("surfer");
    toast("Your Account is Successfully Deleted!");
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-4 pb-3 flex border-b-sky-600 border-b items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sky-700 mb-1">
            Setting's Panel
          </h1>
          <p className="text-sm text-sky-600/70">
            view, upload and manage your contextual files.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="space-y-1">
                  {[
                    {
                      id: "profile",
                      label: "Profile",
                      icon: <User className="h-4 w-4" />,
                    },
                    {
                      id: "account",
                      label: "Account",
                      icon: <Settings className="h-4 w-4" />,
                    },
                    {
                      id: "notifications",
                      label: "Notifications",
                      icon: <Bell className="h-4 w-4" />,
                    },
                    {
                      id: "privacy",
                      label: "Privacy",
                      icon: <Shield className="h-4 w-4" />,
                    },
                    {
                      id: "activity",
                      label: "Activity",
                      icon: <Activity className="h-4 w-4" />,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:text-sky-700 transition-colors  cursor-pointer",
                        activeTab === item.id &&
                          "bg-sky-50 text-sky-700 border-r-2 border-l-2 border-sky-600"
                      )}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile settings.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-sky-700" />
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-6">
                      {/* Avatar Box */}
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-2 border-sky-700">
                          <AvatarImage
                            src={user.avatar || "/Surf.png"}
                            className="object-fill"
                          />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>

                        {/* Tooltip Icon (Outside Avatar) */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute -top-3 right-0 cursor-pointer">
                              <Info className="w-4 h-4 text-sky-700" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-[10px] bg-sky-100 text-sky-800 border-0 rounded-full p-2">
                            Avatar can only be uploaded once every 30 days
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Upload Button & Note */}
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="gap-2 hover:bg-[#0f67fe]/10 hover:text-sky-600 border-0 shadow-none cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                          Change Avatar
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          multiple
                          onChange={handleAvatarChange}
                        />
                        <p className="text-sm text-gray-500">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={user.name}
                          className="focus-visible:ring-0 focus-visible:border-sky-600"
                          onChange={(e) => {
                            setUser({
                              ...user,
                              name: e.target.value,
                            });
                            setUnsavedChanges(true);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          className="focus-visible:ring-0 focus-visible:border-sky-600"
                          onChange={(e) => {
                            setUser({
                              ...user,
                              email: e.target.value,
                            });
                            setUnsavedChanges(true);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Bio</Label>
                      <Textarea
                        id="bio"
                        value={user.bio}
                        className="focus-visible:ring-0 focus-visible:border-sky-600"
                        onChange={(e) => {
                          setUser({
                            ...user,
                            bio: e.target.value,
                          });
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Account Security</CardTitle>
                    <CardDescription>
                      Manage your password and security settings.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-sky-700" />

                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            className="focus-visible:ring-0 focus-visible:border-sky-600"
                            placeholder="Enter current password "
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            className="focus-visible:ring-0 focus-visible:border-sky-600"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm new password"
                            className="focus-visible:ring-0 focus-visible:border-sky-600"
                          />
                        </div>
                      </div>

                      <Button className="gap-2 bg-sky-800 hover:bg-sky-900 cursor-not-allowed rounded-2xl">
                        <Lock className="h-4 w-4" />
                        Update Password
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">
                        Two-Factor Authentication
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">SMS Authentication</p>
                            <p className="text-sm text-gray-500">
                              Receive codes via SMS
                            </p>
                          </div>
                        </div>
                        <Switch className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">API Access</h4>
                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              id="api-key"
                              type={showApiKey ? "text" : "password"}
                              value="sk-1234567890abcdef..."
                              readOnly
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowApiKey(!showApiKey)}
                            >
                              {showApiKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            className="gap-2 hover:bg-[#0f67fe]/10 hover:text-sky-600 border-0 shadow-none"
                          >
                            <Key className="h-4 w-4" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about important
                      updates.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-sky-700" />
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">
                              Receive notifications via email
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20"
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              emailNotifications: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-500">
                              Receive push notifications on your device
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20"
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              pushNotifications: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Weekly Reports</p>
                            <p className="text-sm text-gray-500">
                              Get weekly usage and performance reports
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.weeklyReports}
                          className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20"
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              weeklyReports: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Security Alerts</p>
                            <p className="text-sm text-gray-500">
                              Important security notifications
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.securityAlerts}
                          className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20"
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              securityAlerts: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Usage Alerts</p>
                            <p className="text-sm text-gray-500">
                              Notifications when approaching usage limits
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.usageAlerts}
                          className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20"
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              usageAlerts: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Privacy Settings</CardTitle>
                    <CardDescription>
                      Control your privacy and data sharing preferences.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-sky-700" />
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Data Sharing</p>
                            <p className="text-sm text-gray-500">
                              Allow anonymous usage data to improve our services
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={privacy.dataSharing}
                          className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20"
                          onCheckedChange={(checked) =>
                            setPrivacy({ ...privacy, dataSharing: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Analytics Tracking</p>
                            <p className="text-sm text-gray-500">
                              Help us improve by tracking usage patterns
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={privacy.analyticsTracking}
                          className="data-[state=checked]:bg-[#0f67fe] data-[state=unchecked]:bg-[#0f67fe]/20"
                          onCheckedChange={(checked) =>
                            setPrivacy({
                              ...privacy,
                              analyticsTracking: checked,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">Data Management</h4>
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={handleExportData}
                          className="gap-2 hover:bg-amber-600/10 hover:text-amber-600 border-0 shadow-none"
                        >
                          <Upload className="h-4 w-4" />
                          Export Data
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 hover:bg-emerald-600/10 hover:text-emerald-600 border-0 shadow-none"
                        >
                          <Download className="h-4 w-4" />
                          Import Data
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2 mt-3"
                          onClick={handleDeleteData}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Activity Log</CardTitle>
                    <CardDescription>
                      View your recent account activity and security events.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-sky-700" />
                  <CardContent className="space-y-0">
                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-4 p-4 rounded-full hover:shadow-md pr-6 duration-300"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            log.type === "success" &&
                              "bg-green-100 text-green-600",
                            log.type === "warning" &&
                              "bg-yellow-100 text-yellow-600",
                            log.type === "info" && "bg-sky-100 text-sky-600"
                          )}
                        >
                          {log.type === "success" && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          {log.type === "warning" && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {log.type === "info" && <Info className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{log.action}</h4>
                            <span className="text-sm text-gray-500">
                              {formatTime(log.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
