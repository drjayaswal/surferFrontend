"use client";

import { useState } from "react";
import { toast } from "sonner";
import LoginNavigation from "@/components/loginNavigation";
import { apiClient } from "@/lib/api";
import SmallFooter from "@/components/smallFooter";

export default function HelpForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim() || formData.firstName.length < 2)
      errs.firstName = "First name must be at least 2 characters.";
    if (!formData.lastName.trim() || formData.lastName.length < 2)
      errs.lastName = "Last name must be at least 2 characters.";
    if (
      !formData.email.trim() ||
      !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)
    )
      errs.email = "Please enter a valid Gmail address.";

    const wordCount = formData.message.trim().split(/\s+/).length;
    if (!formData.message.trim()) errs.message = "Message is required.";
    else if (wordCount > 150)
      errs.message = "Message must not exceed 150 words.";

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await apiClient.sendHelp(formData);
      if (res?.success) {
        toast.success("Help request sent successfully.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      } else {
        toast.error("Failed to send help request.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
      <LoginNavigation />

      {/* Gradient blobs */}
      <div
        className="fixed top-[-120px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-tr from-sky-200 to-sky-300 opacity-30 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
      <div
        className="fixed bottom-[-120px] left-[50vw] w-[400px] h-[400px] bg-gradient-to-tr from-sky-300 to-sky-400 opacity-30 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
      <div
        className="fixed top-[-120px] right-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-300 to-sky-400 opacity-30 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />

      <div className="mx-auto max-w-2xl text-center relative z-10">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          How can we help?
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Reach out for support, bug reports, or feature suggestions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20 relative z-10 space-y-6"
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {(["firstName", "lastName"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-900">
                {field === "firstName" ? "First Name" : "Last Name"}
              </label>
              <input
                type="text"
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-500"
              />
              {errors[field] && (
                <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-500"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900">
            Message <span className="text-[8px]">in 150 words</span>
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-500"
          />
          {errors.message && (
            <p className="text-sm text-red-500 mt-1">{errors.message}</p>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-sky-400 px-4 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-sky-500 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Sending..." : "Send Help"}
          </button>
        </div>
      </form>
      <SmallFooter />
    </div>
  );
}
