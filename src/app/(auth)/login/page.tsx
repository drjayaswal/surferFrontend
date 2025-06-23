"use client";

import React from "react";
import type { ReactElement } from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send,
  LucideShieldQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WaveBackground from "@/components/waveBackground";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { AuthSkeleton, OtpSkeleton } from "@/components/loader";
import { OTPInput } from "@/components/otpInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoginNavigation from "@/components/loginNavigation";

type AuthStep = "initial" | "forgot-password" | "otp-verification" | "success";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
  otp?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
  otp?: string;
}

export default function AuthPage(): ReactElement {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [authStep, setAuthStep] = useState<AuthStep>("initial");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    rememberMe: false,
    otp: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Reset form when switching tabs
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      rememberMe: false,
      otp: "",
    });
    setErrors({});
    setIsSuccess(false);
    setAuthStep("initial");
    toast.info(
      `${activeTab === "login" ? "Login" : "Signup"} to use SurferAI`
    );
  }, [activeTab]);

  // Slider animation refs
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const loginRef = useRef<HTMLButtonElement>(null);
  const signupRef = useRef<HTMLButtonElement>(null);

  const updateSlider = () => {
    const currentRef = activeTab === "login" ? loginRef : signupRef;
    if (currentRef.current) {
      const { offsetLeft, offsetWidth } = currentRef.current;
      setSliderStyle({ left: offsetLeft, width: offsetWidth });
    }
  };

  useEffect(() => {
    updateSlider();
    window.addEventListener("resize", updateSlider);
    return () => window.removeEventListener("resize", updateSlider);
  }, [activeTab]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (only for initial login/signup, not forgot password)
    if (authStep === "initial" && activeTab === "login") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    }

    if (authStep === "initial" && activeTab === "signup") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }

      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // OTP validation
    if (authStep === "otp-verification") {
      if (!formData.otp || formData.otp.length !== 5) {
        newErrors.otp = "Please enter a valid 5-digit OTP";
      }
    }

    setErrors(newErrors);

    // Show validation errors as toast
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  // API functions
  const sendOTP = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      toast.info("Sending verification code...");

      const response = await apiClient.generateOtp({ email });

      if (response.success) {
        toast.success(`Verification code sent to ${email}`);
        return true;
      } else {
        setErrors({ general: response.message || "Failed to send OTP" });
        toast.error(response.message || "Failed to send verification code");
        return false;
      }
    } catch (error) {
      const errorMsg = "Failed to send OTP. Please try again.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLoginOTP = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      toast.info("Verifying your code...");

      const response = await apiClient.verifyLoginOtp({
        email,
        otp: Number.parseInt(otp),
      });

      if (response.success) {
        toast.success("Login successful! Welcome back!");
        return true;
      } else {
        setErrors({ general: response.message || "Invalid OTP" });
        toast.error(response.message || "Invalid verification code");
        return false;
      }
    } catch (error) {
      const errorMsg = "OTP verification failed. Please try again.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPassword = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      toast.info("Signing you in...");

      const response = await apiClient.login({ email, password });

      if (response.success) {
        toast.success("Login successful! Welcome back!");
        return true;
      } else {
        const errorMsg =
          response.message || "Login failed. Please check your credentials.";
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = "Login failed. Please check your credentials.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (userData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      toast.info("Creating your account...");

      // First send OTP
      const otpResponse = await apiClient.generateOtp({
        email: userData.email,
      });
      if (!otpResponse.success) {
        const errorMsg = otpResponse.message || "Failed to send OTP";
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
        return false;
      }
      toast.success(`Verification code sent to ${userData.email}`);
      return true;
    } catch (error) {
      const errorMsg = "Failed to create account. Please try again.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifySignupOTP = async (userData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      toast.info("Creating your account...");

      const fullName = `${userData.firstName} ${userData.lastName}`;

      const response = await apiClient.verifySignupOtp({
        email: userData.email,
        name: fullName,
        password: userData.password,
        otp: Number.parseInt(userData.otp!),
      });

      if (response.success) {
        toast.success(
          `Welcome to Surfer AI, ${userData.firstName}! Account created successfully!`
        );
        return true;
      } else {
        const errorMsg = response.message || "Account creation failed";
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = "Account creation failed. Please try again.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Event Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await loginWithPassword(formData.email, formData.password);
    if (success) {
      setIsSuccess(true);
      toast.success("Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await createAccount(formData);
    if (success) {
      setAuthStep("otp-verification");
      toast.info("Please check your email for the verification code");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await sendOTP(formData.email);
    if (success) {
      setAuthStep("otp-verification");
      toast.info("Please check your email for the password reset code");
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;

    if (activeTab === "login") {
      success = await verifyLoginOTP(formData.email, formData.otp!);
    } else {
      success = await verifySignupOTP(formData);
    }

    if (success) {
      setIsSuccess(true);
      toast.success("Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Redirecting to ${provider} login...`);
    console.log(`Login with ${provider}`);
    // Implement social login logic here
  };

  const handleTabSwitch = (tab: "login" | "signup") => {
    setActiveTab(tab);
  };

  const goBack = () => {
    if (authStep === "otp-verification" || authStep === "forgot-password") {
      setAuthStep("initial");
      setFormData((prev) => ({ ...prev, otp: "" }));
      toast.info("Returned to main form");
    }
  };

  const renderStepIndicator = () => {
    if (authStep === "initial") return null;

    const steps = [
      { key: "initial", label: activeTab === "login" ? "Login" : "Signup" },
      { key: "forgot-password", label: "Email" },
      { key: "otp-verification", label: "Verify" },
    ];

    const currentStepIndex = steps.findIndex((step) => step.key === authStep);

    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  index <= currentStepIndex
                    ? "bg-sky-400 text-white"
                    : "bg-sky-200 text-sky-500"
                )}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 transition-all duration-200",
                    index < currentStepIndex ? "bg-sky-400" : "bg-sky-200"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <LoginNavigation />

      {/* Animated Wave Background */}
      <div className="absolute inset-0 z-0">
        <WaveBackground opacity={0.1} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-4 h-4 bg-sky-400/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-40 right-32 w-6 h-6 bg-blue-400/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-32 left-40 w-3 h-3 bg-indigo-400/25 rounded-full blur-sm"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          />

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 shadow-2xl rounded-4xl shadow-sky-700/40 border-0 bg-white/90 backdrop-blur-xl relative overflow-hidden">
              {/* Success State */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center"
                  >
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {activeTab === "login" ||
                        authStep === "otp-verification"
                          ? "Welcome back!"
                          : "Account created!"}
                      </h3>
                      <p className="text-gray-600">
                        Redirecting to your AI dashboard...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center mb-6">
                <span className="bg-gradient-to-r from-sky-200 via-sky-400 to-sky-600 bg-clip-text text-transparent text-5xl font-bold">
                  Surfer AI
                </span>
              </div>

              {/* Step Indicator */}
              {renderStepIndicator()}

              {/* Tab Header - Only show on initial step */}
              {authStep === "initial" && (
                <div className="relative mb-6">
                  <div className="flex bg-transparent rounded-2xl p-1 relative overflow-hidden">
                    {/* Sliding Background */}
                    <motion.div
                      className="absolute top-1 bottom-1 bg-sky-500/10 rounded-xl shadow-sm"
                      animate={{
                        left: sliderStyle.left,
                        width: sliderStyle.width,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />

                    {/* Tab Buttons */}
                    <button
                      ref={loginRef}
                      onClick={() => handleTabSwitch("login")}
                      className={cn(
                        "relative z-10 flex-1 py-3 text-sm font-semibold rounded-xl transition-colors duration-200",
                        activeTab === "login"
                          ? "text-sky-600"
                          : "text-gray-600 hover:text-sky-500"
                      )}
                    >
                      Login
                    </button>
                    <button
                      ref={signupRef}
                      onClick={() => handleTabSwitch("signup")}
                      className={cn(
                        "relative z-10 flex-1 py-3 text-sm font-semibold rounded-xl transition-colors duration-200",
                        activeTab === "signup"
                          ? "text-sky-600"
                          : "text-gray-600 hover:text-sky-500"
                      )}
                    >
                      Signup
                    </button>
                  </div>
                </div>
              )}

              {/* Form Content */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Initial Login Form */}
                  {authStep === "initial" && activeTab === "login" && (
                    <motion.div
                      key="login-initial"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLoading ? (
                        <AuthSkeleton />
                      ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                          {/* Email Field */}
                          <div className="space-y-2">
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className={cn(
                                  "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",
                                  errors.email &&
                                    "border-red-300 focus:border-red-400"
                                )}
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                              />
                            </div>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <AlertCircle className="h-4 w-4" />
                                {errors.email}
                              </motion.p>
                            )}
                          </div>

                          {/* Password Field */}
                          <div className="space-y-2">
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className={cn(
                                  "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",

                                  errors.password &&
                                    "border-red-300 focus:border-red-400"
                                )}
                                value={formData.password}
                                onChange={(e) =>
                                  handleInputChange("password", e.target.value)
                                }
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            {errors.password && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <AlertCircle className="h-4 w-4" />
                                {errors.password}
                              </motion.p>
                            )}
                          </div>

                          {/* Remember Me & Forgot Password */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="remember"
                                checked={formData.rememberMe}
                                className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-0"
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "rememberMe",
                                    checked as boolean
                                  )
                                }
                              />
                              <Label
                                htmlFor="remember"
                                className="text-sm text-gray-600"
                              >
                                Remember me
                              </Label>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAuthStep("forgot-password");
                                toast.info(
                                  "Enter your email to reset password"
                                );
                              }}
                              className="text-sm text-sky-600 hover:text-sky-700"
                            >
                              Forgot Password?
                            </button>
                          </div>

                          {/* General Error */}
                          {errors.general && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 bg-red-50 border border-red-200 rounded-xl"
                            >
                              <p className="text-sm text-red-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {errors.general}
                              </p>
                            </motion.div>
                          )}

                          {/* Submit Button */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="h-12 bg-gradient-to-r from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                  Logging in...
                                </>
                              ) : (
                                <>
                                  Login
                                  <ArrowRight className="h-5 w-5 ml-2" />
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-12 border-0 hover:bg-sky-700/5 bg-transparent shadow-none rounded-xl cursor-pointer"
                              onClick={() => handleSocialLogin("google")}
                            >
                              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                              Google
                            </Button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {/* Forgot Password Form */}
                  {authStep === "forgot-password" && (
                    <motion.div
                      key="forgot-password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLoading ? (
                        <AuthSkeleton />
                      ) : (
                        <>
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-transparent rounded-2xl mb-4 shadow-lg shadow-sky-500/25">
                              <Send className="w-8 h-8 text-sky-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                              Reset Password
                            </h2>
                            <p className="text-gray-600">
                              Enter your email to receive a verification code
                            </p>
                          </div>

                          <form
                            onSubmit={handleForgotPassword}
                            className="space-y-6"
                          >
                            <div className="space-y-2">
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                                <Input
                                  id="forgot-email"
                                  type="email"
                                  placeholder="Enter your email"
                                  className={cn(
                                    "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",

                                    errors.email &&
                                      "border-red-300 focus:border-red-400"
                                  )}
                                  value={formData.email}
                                  onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                  }
                                />
                              </div>
                              {errors.email && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-sm text-red-600 flex items-center gap-1"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.email}
                                </motion.p>
                              )}
                            </div>

                            {errors.general && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-xl"
                              >
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.general}
                                </p>
                              </motion.div>
                            )}

                            <div className="flex gap-2 items-center justify-center">
                              <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-12 bg-gradient-to-r from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Sending Code...
                                  </>
                                ) : (
                                  <>
                                    Send Verification Code
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                  </>
                                )}
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                onClick={goBack}
                                className="h-12 text-sky-600 hover:text-sky-600 hover:bg-sky-600/10 rounded-xl transition-all duration-200"
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                              </Button>
                            </div>
                          </form>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* OTP Verification Form */}
                  {authStep === "otp-verification" && (
                    <motion.div
                      key="otp-verification"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLoading ? (
                        <OtpSkeleton />
                      ) : (
                        <>
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-transparent rounded-2xl mb-4 shadow-none shadow-green-500/25">
                              <LucideShieldQuestion className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                              Enter Verification Code
                            </h2>
                            <div className="inline-flex items-center px-3 py-1 bg-sky-50 rounded-full">
                              <span className="text-sm text-sky-600">
                                Code sent to:{" "}
                              </span>
                              <span className="ml-1 font-medium text-black truncate max-w-[150px]">
                                {formData.email}
                              </span>
                            </div>
                          </div>

                          <form
                            onSubmit={handleOTPVerification}
                            className="space-y-6"
                          >
                            <div className="space-y-4">
                              <Label className="text-gray-700 font-medium text-center block">
                                Enter 5-digit verification code
                              </Label>
                              <OTPInput
                                value={formData.otp || ""}
                                onChange={(value) =>
                                  handleInputChange("otp", value)
                                }
                                length={5}
                                disabled={isLoading}
                              />
                              {errors.otp && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-sm text-red-600 flex items-center justify-center gap-1"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.otp}
                                </motion.p>
                              )}
                            </div>

                            {errors.general && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-xl"
                              >
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.general}
                                </p>
                              </motion.div>
                            )}

                            <div className="space-y-3">
                              <Button
                                type="submit"
                                disabled={
                                  isLoading ||
                                  !formData.otp ||
                                  formData.otp.length !== 5
                                }
                                className="w-full h-12 bg-gradient-to-r from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    Verify & Continue
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                  </>
                                )}
                              </Button>

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={goBack}
                                  className="flex-1 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                                >
                                  <ArrowLeft className="mr-2 h-4 w-4" />
                                  Back
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    toast.warning(
                                      "Resending verification code..."
                                    );
                                    setTimeout(() => {
                                      sendOTP(formData.email);
                                    }, 1000);
                                  }}
                                  disabled={isLoading}
                                  className="flex-1 h-12 border-0 bg-sky-700/10 hover:bg-sky-600/60 hover:text-white rounded-xl transition-all duration-200"
                                >
                                  Resend Code
                                </Button>
                              </div>
                            </div>
                          </form>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Signup Form */}
                  {authStep === "initial" && activeTab === "signup" && (
                    <motion.div
                      key="signup-initial"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLoading ? (
                        <AuthSkeleton />
                      ) : (
                        <form onSubmit={handleSignup} className="space-y-6">
                          {/* Name Fields */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                                <Input
                                  id="firstName"
                                  type="text"
                                  placeholder="First name"
                                  className={cn(
                                    "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",

                                    errors.firstName &&
                                      "border-red-300 focus:border-red-400"
                                  )}
                                  value={formData.firstName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "firstName",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {errors.firstName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-sm text-red-600 flex items-center gap-1"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.firstName}
                                </motion.p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Input
                                id="lastName"
                                type="text"
                                placeholder="Last name"
                                className={cn(
                                  "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",

                                  errors.lastName &&
                                    "border-red-300 focus:border-red-400"
                                )}
                                value={formData.lastName}
                                onChange={(e) =>
                                  handleInputChange("lastName", e.target.value)
                                }
                              />
                              {errors.lastName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-sm text-red-600 flex items-center gap-1"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.lastName}
                                </motion.p>
                              )}
                            </div>
                          </div>

                          {/* Email Field */}
                          <div className="space-y-2">
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                              <Input
                                id="signup-email"
                                type="email"
                                placeholder="Enter your email"
                                className={cn(
                                  "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",

                                  errors.email &&
                                    "border-red-300 focus:border-red-400"
                                )}
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                              />
                            </div>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <AlertCircle className="h-4 w-4" />
                                {errors.email}
                              </motion.p>
                            )}
                          </div>

                          {/* Password Field */}
                          <div className="space-y-2">
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                              <Input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className={cn(
                                  "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",

                                  errors.password &&
                                    "border-red-300 focus:border-red-400"
                                )}
                                value={formData.password}
                                onChange={(e) =>
                                  handleInputChange("password", e.target.value)
                                }
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 hover:text-sky-700 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            {errors.password && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <AlertCircle className="h-4 w-4" />
                                {errors.password}
                              </motion.p>
                            )}
                          </div>

                          {/* Confirm Password Field */}
                          <div className="space-y-2">
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className={cn(
                                  "pl-10 h-12 focus-visible:ring-0 rounded-xl border-0 bg-transparent shadow-none focus-visible:bg-sky-700/5",

                                  errors.confirmPassword &&
                                    "border-red-300 focus:border-red-400"
                                )}
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                  handleInputChange(
                                    "confirmPassword",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 hover:text-sky-700 cursor-pointer"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <AlertCircle className="h-4 w-4" />
                                {errors.confirmPassword}
                              </motion.p>
                            )}
                          </div>

                          {/* Terms Agreement */}
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="terms"
                              className="mt-1 data-[state=checked]:bg-sky-600 data-[state=checked]:border-0"
                            />
                            <Label
                              htmlFor="terms"
                              className="text-sm text-gray-600 leading-relaxed"
                            >
                              I agree to the{" "}
                              <Link
                                href="/terms"
                                className="text-sky-600 hover:text-sky-700"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="/privacy"
                                className="text-sky-600 hover:text-sky-700"
                              >
                                Privacy Policy
                              </Link>
                            </Label>
                          </div>

                          {/* General Error */}
                          {errors.general && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 bg-red-50 border border-red-200 rounded-xl"
                            >
                              <p className="text-sm text-red-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {errors.general}
                              </p>
                            </motion.div>
                          )}

                          {/* Submit Button */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="h-12 bg-gradient-to-r from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                  Creating Account...
                                </>
                              ) : (
                                <>
                                  Create Account
                                  <ArrowRight className="h-5 w-5 ml-2" />
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-12 border-0 hover:bg-sky-700/5 bg-transparent shadow-none rounded-xl cursor-pointer"
                              onClick={() => handleSocialLogin("google")}
                            >
                              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                              Google
                            </Button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer - Only show on initial step */}
              {authStep === "initial" && (
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    {activeTab === "login"
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      type="button"
                      className="text-sky-600 hover:text-sky-700 font-medium"
                      onClick={() =>
                        setActiveTab(activeTab === "login" ? "signup" : "login")
                      }
                    >
                      {activeTab === "login" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link
              href="/"
              className="inline-flex items-center text-sm text-sky-600 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
