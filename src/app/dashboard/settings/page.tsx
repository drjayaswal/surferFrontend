"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  Download,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  Smartphone,
  Lock,
  Key,
  Activity,
  Info,
  Camera,
  Loader2,
  Copy,
  SquareCheckBig,
  Database,
  MousePointerClick,
} from "lucide-react";
import { cn, formatTime, generateApiKey, toBase64 } from "@/lib/utils";
import { ActivityLog } from "@/types/app.types";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { userStore } from "@/stores/userStore";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { COOLDOWN_MS } from "@/lib/const";
import { useHydration } from "@/hooks/useHydration";

export default function SettingsPage() {
  useHydration();

  const user = userStore((s) => s.user);
  const setUser = userStore((s) => s.setUser);
  const authChecked = userStore((s) => s.authChecked);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const lastGeneratedTimeRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [tfaChanged, setTfaChanged] = useState(false);
  const [formUser, setFormUser] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("active-settings-tab");
    if (saved) setActiveTab(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("active-settings-tab", activeTab);
  }, [activeTab]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-sky-500" />
        <p className="ml-2 text-sm text-gray-600">Authenticating...</p>
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
          setUser({
            ...user,
            avatar: base64,
            activity_logs: [...user.activity_logs, response.data.newActivity],
          });
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

  const handleExportData = () => {
    const data = {
      profile: user,
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

  const handleDeleteData = async () => {
    // localStorage.removeItem("surfer");
    toast("Your Account is Successfully Deleted!");
  };

  const updatePassword = async () => {
    const toastId = toast.loading("Updating Password...");
    try {
      const response = await apiClient.updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      if (response.success) {
        const surferRaw = localStorage.getItem("surfer");
        if (surferRaw) {
          const surfer = JSON.parse(surferRaw);
          surfer.state.user.password_updated_at = response.data.timestamp;
          surfer.state.user.activity_log = [
            ...(surfer.state.user.activity_log || []),
            response.data.newActivity,
          ];
          localStorage.setItem("surfer", JSON.stringify(surfer));
        }
        if (user) {
          setUser({
            ...user,
            password_updated_at: response.data.timestamp,
            activity_logs: [...user.activity_logs, response.data.newActivity],
          });
        }

        toast.dismiss(toastId);
        toast.success("Password Updated!");
      } else {
        toast.error(response.message || "Failed to update password");
        toast.dismiss(toastId);
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };

  const generateKey = async () => {
    setIsGenerating(true);
    const now = Date.now();

    if (
      lastGeneratedTimeRef.current &&
      now - lastGeneratedTimeRef.current < COOLDOWN_MS
    ) {
      toast.warning("Please wait before generating another key.");
      setIsGenerating(false);
      return;
    }

    lastGeneratedTimeRef.current = now;

    const toastId = toast.loading("Generating API key...");

    setTimeout(async () => {
      const key = generateApiKey();
      setApiKey(key);
      setShowApiKey(true);

      try {
        const response = await apiClient.updateApiKey({ key: key });
        if (!response.success) {
          toast.error("Failed to update API key on server.");
        } else {
          toast.success("API key is generated !");
          const surferRaw = localStorage.getItem("surfer");
          if (surferRaw) {
            const surfer = JSON.parse(surferRaw);
            surfer.state.user.api_key_generated_at = response.data.timestamp;
            surfer.state.user.activity_log = [
              ...(surfer.state.user.activity_log || []),
              response.data.newActivity,
            ];
            localStorage.setItem("surfer", JSON.stringify(surfer));
          }
          if (user) {
            setUser({
              ...user,
              api_key_generated_at: response.data.timestamp,
              activity_logs: [...user.activity_logs, response.data.newActivity],
            });
          }
        }
      } catch (err) {
        toast.error("Error while updating API key.");
        console.error(err);
      } finally {
        toast.dismiss(toastId);
        setIsGenerating(false);
      }
    }, 5000);
  };

  const updateProfile = async () => {
    try {
      const response = await apiClient.updateProfile({
        name: formUser.name,
        bio: formUser.bio,
      });
      if (response.success) {
        const surferRaw = localStorage.getItem("surfer");
        if (surferRaw) {
          const surfer = JSON.parse(surferRaw);
          surfer.state.user.activity_log = [
            ...(surfer.state.user.activity_log || []),
            response.data.newActivity,
          ];
          localStorage.setItem("surfer", JSON.stringify(surfer));
        }
        if (user) {
          setUser({
            ...user,
            name: formUser.name,
            bio: formUser.bio,
            activity_logs: [...user.activity_logs, response.data.newActivity],
          });
        }

        toast.success("Profile Updated !");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };

  const updateTFA = async () => {
    try {
      const response = await apiClient.updateTFA();
      if (response.success) {
        const surferRaw = localStorage.getItem("surfer");
        if (surferRaw) {
          const surfer = JSON.parse(surferRaw);
          surfer.state.user.TFA_enabled = user?.TFA_enabled ? false : true;
          surfer.state.user.activity_log = [
            ...(surfer.state.user.activity_log || []),
            response.data.newActivity,
          ];
          localStorage.setItem("surfer", JSON.stringify(surfer));
        }
        if (user) {
          setUser({
            ...user,
            TFA_enabled: user.TFA_enabled ? false : true,
            activity_logs: [...user.activity_logs, response.data.newActivity],
          });
        }
        toast.success(`TFA ${user?.TFA_enabled ? "Disabled" : "Enabled"}`);
      } else {
        toast.error(response.message || "Failed to update tfa");
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };

  const handleTfaToggle = async (checked: boolean) => {
    setTfaEnabled(!tfaChanged);
    setTfaChanged(!tfaChanged);
  };

  
  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
    >
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
                        id: "data",
                        label: "Data",
                        icon: <Database className="h-4 w-4" />,
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
                        Update your personal information and profile settings
                      </CardDescription>
                    </CardHeader>
                    <Separator className="bg-sky-700" />
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-6">
                        {/* Avatar Box */}
                        <div className="relative">
                          <Avatar className="h-20 w-20 border-2 border-sky-700">
                            <AvatarImage
                              src={user?.avatar || "/Surf.png"}
                              className="object-fill"
                            />
                            <AvatarFallback>
                              {user?.name.slice(0, 4)}
                            </AvatarFallback>
                          </Avatar>
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
                            value={formUser.name}
                            placeholder={user?.name}
                            onChange={(e) =>
                              setFormUser({ ...formUser, name: e.target.value })
                            }
                            className="focus-visible:ring-0 border-transparent shadow-none focus-visible:border-gray-700/30"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email">Email Address</Label>
                          <span className="text-gray-400 italic select-none">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formUser.bio}
                          placeholder={user?.bio}
                          onChange={(e) =>
                            setFormUser({ ...formUser, bio: e.target.value })
                          }
                          className="focus-visible:ring-0 border-transparent shadow-none focus-visible:border-gray-700/30"
                        />{" "}
                      </div>
                    </CardContent>
                    {formUser.bio != "" && formUser.name && (
                      <Button
                        className="mx-4 bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
                        onClick={updateProfile}
                      >
                        Save Changes
                      </Button>
                    )}
                  </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        Account Security
                      </CardTitle>
                      <CardDescription>
                        Manage your password and security settings.
                      </CardDescription>
                    </CardHeader>
                    <Separator className="bg-sky-700" />
                    <CardContent className="space-y-6">
                      {/* Password Update Section */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="focus-visible:ring-0 focus-visible:border-sky-600 pr-10"
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:bg-transparent cursor-pointer"
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
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
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
                              value={confirmNewPassword}
                              onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                              }
                              className="focus-visible:ring-0 focus-visible:border-sky-600"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>

                        <Button
                          className="gap-2 bg-sky-800 hover:bg-sky-900 rounded-2xl cursor-pointer"
                          disabled={
                            !oldPassword ||
                            !newPassword ||
                            newPassword !== confirmNewPassword
                          }
                          onClick={updatePassword}
                        >
                          <Lock className="h-4 w-4" />
                          Update Password
                        </Button>
                        <span className="text-xs text-zinc-500 flex items-center justify-center">
                          Recently Updated At{" "}
                          {new Date(
                            user?.password_updated_at!
                          ).toLocaleString()}{" "}
                        </span>
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
                                Receive OTP via SMS
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={user?.TFA_enabled}
                            onCheckedChange={() => {
                              setTfaChanged((prev) => !prev);
                              handleTfaToggle;
                            }}
                            className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-sky-600/20 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Save Button only if TFA changed */}
                      {tfaChanged && (
                        <div className="flex items-center justify-center">
                          <Button
                            className="w-full bg-transparent shadow-none hover:bg-transparent text-sky-600 cursor-pointer active:cursor-"
                            onClick={updateTFA}
                          >
                            {user?.TFA_enabled
                              ? "Want to Disable ? Click Here"
                              : "Want to Enable ? Click Here"}
                            <MousePointerClick />
                          </Button>
                        </div>
                      )}

                      {/* API Access */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-5">
                          <h4 className="font-medium text-lg">Access Key</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                id="api-key"
                                type={showApiKey ? "text" : "password"}
                                value={
                                  apiKey || "sfr-slick-neuron-a83kzjdf-20250630"
                                }
                                className={`focus-visible:ring-0 border-0 shadow-none cursor-text ${
                                  isGenerating &&
                                  "bg-muted text-muted-foreground"
                                }`}
                                disabled={isGenerating}
                                readOnly
                              />
                              {/* Toggle Visibility */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-500 hover:bg-transparent cursor-pointer rounded-3xl"
                                onClick={() => {
                                  if (apiKey !== "") setShowApiKey(!showApiKey);
                                }}
                              >
                                {showApiKey ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>

                              {/* Copy to Clipboard */}
                              {apiKey && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent cursor-pointer rounded-3xl"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(
                                        apiKey
                                      );
                                      toast.success(
                                        "Key Copied to Clipboard !"
                                      );
                                      setIsCopied(true);
                                      setTimeout(() => {
                                        setIsCopied(false);
                                      }, 2000);
                                    } catch {
                                      toast.error("Failed to copy API key ");
                                    }
                                  }}
                                >
                                  {isCopied ? (
                                    <>
                                      <SquareCheckBig className="h-4 w-4 text-green-500" />
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              className="gap-2 hover:bg-[#0f67fe]/10 hover:text-sky-600 border-0 shadow-none cursor-pointer"
                              onClick={generateKey}
                            >
                              <Key className="h-4 w-4" />
                              Regenerate
                            </Button>
                          </div>
                          <span className="text-xs text-zinc-500 flex items-center justify-center">
                            {apiKey != ""
                              ? "  This API key will be hidden automatically after a short period for time "
                              : ` Recently Generated At ${new Date(
                                  user?.api_key_generated_at!
                                ).toLocaleString()} `}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Data Tab */}
                <TabsContent value="data">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        Data Management
                      </CardTitle>
                      <CardDescription>
                        Control and manage your account data
                      </CardDescription>
                    </CardHeader>
                    <Separator className="bg-sky-700" />
                    <CardContent>
                      <div>
                        <div className="bg-transparent rounded-lg px-4 pb-6">
                          <span className="text-red-300 font-semibold text-base">
                            To completely delete account, type{" "}
                            <span className="italic text-red-800">delete</span>
                          </span>
                          <Input
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            className="bg-red-100/50 border-0 placeholder:text-red-400 text-red-800 focus-visible:ring-0 mt-2 italic font-bold"
                          />
                          <div className="flex items-center justify-between">
                            <Button
                              size="sm"
                              variant="outline"
                              className="ml-2 mt-3 bg-red-600 text-white hover:bg-red-600/10 hover:text-red-600 border-0 shadow-none cursor-pointer rounded-lg"
                              onClick={handleDeleteData}
                              disabled={confirmName !== "delete"}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Account
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleExportData}
                              className="ml-2 mt-3 hover:bg-emerald-600/10 hover:text-emerald-600 border-0 shadow-none cursor-pointer rounded-lg"
                            >
                              <Download className="h-4 w-4" />
                              Download Data
                            </Button>
                          </div>
                        </div>
                        <span className="text-xs text-red-600 flex items-center justify-center">
                          Permanently delete your account and all associated
                          data. This action cannot be undone
                        </span>
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
                    <CardContent className="space-y-0 max-h-100 overflow-scroll">
                      {user?.activity_logs.length! > 0 ? (
                        user?.activity_logs.map((log, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-full pr-6 duration-300"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                  {log.activity_name}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(log.created_at).toLocaleString()}{" "}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-zinc-400 py-15">
                          <div className="text-md">
                            No activity logs to display
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
