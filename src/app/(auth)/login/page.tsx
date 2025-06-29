"use client";

import React from "react";
import type { ReactElement } from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthStep, FormData, FormErrors } from "@/types/app.types";
import Footer from "@/components/footer";

const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

interface StepContentWrapperProps {
  currentStep: string;
  direction: number;
  children: React.ReactNode;
  className?: string;
}

function StepContentWrapper({
  currentStep,
  direction,
  children,
  className = "",
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: parentHeight }}
      transition={{
        type: "spring",
        duration: 0.4,
        stiffness: 300,
        damping: 30,
      }}
      className={className}
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <SlideTransition
          key={currentStep}
          direction={direction}
          onHeightReady={(h) => setParentHeight(h)}
        >
          {children}
        </SlideTransition>
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: React.ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

// Step indicator component
interface StepIndicatorProps {
  steps: { key: string; label: string }[];
  currentStep: string;
  completedSteps: string[];
}

function StepIndicator({
  steps,
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = completedSteps.includes(step.key);
          const isPast = index < currentIndex;

          return (
            <React.Fragment key={step.key}>
              <motion.div
                className="relative"
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2",
                    isActive
                      ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/30"
                      : isCompleted || isPast
                      ? "bg-sky-400 text-white border-sky-400"
                      : "bg-white text-sky-400 border-sky-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  {isCompleted || isPast ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>

                {/* Step label */}
                <motion.div
                  className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isActive ? "text-sky-600" : "text-gray-500"
                    )}
                  >
                    {step.label}
                  </span>
                </motion.div>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  className="relative w-12 h-0.5 mx-2"
                  initial={false}
                >
                  <div className="absolute inset-0 bg-sky-200 rounded-full" />
                  <motion.div
                    className="absolute inset-0 bg-sky-400 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: isPast || isCompleted ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: 0.1,
                    }}
                  />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// OTP Input Component
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  disabled?: boolean;
}

function OTPInput({ value, onChange, length, disabled }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) return;

    const newValue = value.split("");
    newValue[index] = digit;
    onChange(newValue.join(""));

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className="w-12 h-12 text-center text-lg font-semibold border-2 border-sky-200 focus:border-sky-400 focus:ring-0 rounded-xl"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function AnimatedAuthPage(): ReactElement {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [authStep, setAuthStep] = useState<AuthStep>("initial");
  const [direction, setDirection] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const router = useRouter();

  // Tab slider animation
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
    setCompletedSteps([]);
  }, [activeTab]);

  // Define steps based on current flow
  const getSteps = () => {
    if (
      authStep === "forgot-password" ||
      (activeTab === "login" && authStep === "otp-verification")
    ) {
      return [
        { key: "initial", label: "Email" },
        { key: "otp-verification", label: "Verify" },
        { key: "success", label: "Complete" },
      ];
    }
    return [
      { key: "initial", label: activeTab === "login" ? "Login" : "Sign Up" },
      { key: "otp-verification", label: "Verify" },
      { key: "success", label: "Complete" },
    ];
  };

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
      toast(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const goToStep = (step: AuthStep, dir = 1) => {
    setDirection(dir);
    setAuthStep(step);

    // Update completed steps
    if (step === "otp-verification") {
      setCompletedSteps(["initial"]);
    } else if (step === "success") {
      setCompletedSteps(["initial", "otp-verification"]);
    }
  };

  const goBack = () => {
    if (authStep === "otp-verification") {
      goToStep("initial", -1);
    } else if (authStep === "forgot-password") {
      goToStep("initial", -1);
    }
  };

  // API functions
  const sendOTP = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await apiClient.generateOtp({ email });

      if (response.success) {
        toast(`Verification code sent to ${email}`);
        return true;
      } else {
        setErrors({ general: response.message || "Failed to send OTP" });
        toast(response.message || "Failed to send verification code");
        return false;
      }
    } catch (error) {
      const errorMsg = "Failed to send OTP. Please try again.";
      setErrors({ general: errorMsg });
      toast(errorMsg);
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

      const response = await apiClient.verifyLoginOtp({
        email,
        otp: Number.parseInt(otp),
      });

      if (response.success) {
        toast("Login successful! Welcome back!");
        return true;
      } else {
        setErrors({ general: response.message || "Invalid OTP" });
        toast(response.message || "Invalid verification code");
        return false;
      }
    } catch (error) {
      const errorMsg = "OTP verification failed. Please try again.";
      setErrors({ general: errorMsg });
      toast(errorMsg);
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

      const response = await apiClient.login({ email, password });

      if (response.success) {
        toast("Login successful! Welcome back!");
        return true;
      } else {
        const errorMsg =
          response.message || "Login failed. Please check your credentials.";
        setErrors({ general: errorMsg });
        toast(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = "Login failed. Please check your credentials.";
      setErrors({ general: errorMsg });
      toast(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (userData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);

      // First send OTP
      const otpResponse = await apiClient.generateOtp({
        email: userData.email,
      });
      if (!otpResponse.success) {
        const errorMsg = otpResponse.message || "Failed to send OTP";
        setErrors({ general: errorMsg });
        toast(errorMsg);
        return false;
      }
      toast(`Verification code sent to ${userData.email}`);
      return true;
    } catch (error) {
      const errorMsg = "Failed to create account. Please try again.";
      setErrors({ general: errorMsg });
      toast(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifySignupOTP = async (userData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const fullName = `${userData.firstName} ${userData.lastName}`;

      const response = await apiClient.verifySignupOtp({
        email: userData.email,
        name: fullName,
        password: userData.password,
        otp: Number.parseInt(userData.otp!),
      });

      if (response.success) {
        toast(
          `Welcome to Surfer AI, ${userData.firstName
            ?.slice(0, 1)
            .toUpperCase()}${userData.firstName?.slice(
            1,
            userData.firstName.length
          )}!`
        );
        return true;
      } else {
        const errorMsg = response.message || "Account creation failed";
        setErrors({ general: errorMsg });
        toast(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = "Account creation failed. Please try again.";
      setErrors({ general: errorMsg });
      toast(errorMsg);
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
      goToStep("success", 1);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await createAccount(formData);
    if (success) {
      goToStep("otp-verification", 1);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await sendOTP(formData.email);
    if (success) {
      goToStep("otp-verification", 1);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;

    if (activeTab === "login" || authStep === "forgot-password") {
      success = await verifyLoginOTP(formData.email, formData.otp!);
    } else {
      success = await verifySignupOTP(formData);
    }

    if (success) {
      setIsSuccess(true);
      goToStep("success", 1);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTabSwitch = (tab: "login" | "signup") => {
    setActiveTab(tab);
  };

  const renderCurrentStep = () => {
    switch (authStep) {
      case "initial":
        if (activeTab === "login") {
          return (
            <div className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
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
                </motion.div>

                {/* Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 hover:text-sky-700"
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
                </motion.div>

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

                {/* Remember Me & Forgot Password */}
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", checked as boolean)
                      }
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep("forgot-password", 1)}
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
                </motion.div>
              </form>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Name Fields */}
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                      <Input
                        type="text"
                        placeholder="First name"
                        className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Last name"
                      className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                {/* Password Fields */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 hover:text-sky-700"
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
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 hover:text-sky-700"
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
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </motion.div>

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

                {/* Terms Agreement */}
                <motion.div
                  className="flex items-start space-x-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Checkbox
                    id="terms"
                    className="mt-1 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
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
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
                </motion.div>
              </form>
            </div>
          );
        }

      case "forgot-password":
        return (
          <div className="space-y-6">
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
                <Send className="w-8 h-8 text-sky-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600">
                Enter your email to receive a verification code
              </p>
            </motion.div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-600" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 focus-visible:ring-0 rounded-2xl border-0 bg-transparent shadow-none focus-visible:bg-sky-600/5"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </motion.div>

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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
              </motion.div>
            </form>
          </div>
        );

      case "otp-verification":
        return (
          <div className="space-y-6">
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <LucideShieldQuestion className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Enter Verification Code
              </h2>
              <div className="inline-flex items-center px-3 py-1 bg-sky-50 rounded-full">
                <span className="text-sm text-sky-600">Code sent to: </span>
                <span className="ml-1 font-medium text-black truncate max-w-[150px]">
                  {formData.email}
                </span>
              </div>
            </motion.div>
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label className="text-gray-700 font-medium text-center block">
                  Enter 5-digit verification code
                </Label>
                <OTPInput
                  value={formData.otp || ""}
                  onChange={(value) => handleInputChange("otp", value)}
                  length={5}
                  disabled={isLoading}
                />
                {errors.otp && (
                  <p className="text-sm text-red-600 flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.otp}
                  </p>
                )}
              </motion.div>

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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  disabled={
                    isLoading || !formData.otp || formData.otp.length !== 5
                  }
                  className="w-full h-12 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
              </motion.div>

              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (
                      authStep === "otp-verification" &&
                      activeTab === "login"
                    ) {
                      sendOTP(formData.email);
                    } else {
                      createAccount(formData);
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 h-12 border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl transition-all duration-200"
                >
                  Resend Code
                </Button>
              </div>
            </form>
          </div>
        );

      case "success":
        return (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            </motion.div>
            <motion.h3
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {activeTab === "login" ? "Welcome back!" : "Account created!"}
            </motion.h3>
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Redirecting to your dashboard...
            </motion.p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent text-4xl font-bold">
              Surfer AI
            </span>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 shadow-2xl rounded-3xl border-0 bg-white/95 backdrop-blur-xl relative overflow-hidden">
              {/* Step Indicator */}
              {authStep !== "initial" && (
                <StepIndicator
                  steps={getSteps()}
                  currentStep={authStep}
                  completedSteps={completedSteps}
                />
              )}

              {/* Tab Header - Only show on initial step */}
              {authStep === "initial" && (
                <div className="relative mb-8">
                  <div className="flex bg-sky-50 rounded-2xl p-1 relative overflow-hidden">
                    {/* Sliding Background */}
                    <motion.div
                      className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm border border-sky-100"
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
                      Sign Up
                    </button>
                  </div>
                </div>
              )}

              {/* Animated Step Content */}
              <StepContentWrapper
                currentStep={authStep}
                direction={direction}
                className="space-y-6"
              >
                {renderCurrentStep()}
              </StepContentWrapper>

              {/* Back Button - Show when not on initial step and not success */}
              {authStep !== "initial" && authStep !== "success" && (
                <motion.div
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </motion.div>
              )}

              {/* Footer - Only show on initial step */}
              {authStep === "initial" && (
                <motion.div
                  className="text-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
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
                </motion.div>
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
              className="inline-flex items-center text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
