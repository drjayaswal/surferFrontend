"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import LoginNavigation from "@/components/loginNavigation";
import SmallFooter from "@/components/smallFooter";

export default function ConnectionForm() {
  const [form, setForm] = useState({
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, message } = form;

    if (!email.trim() || !message.trim()) {
      toast.error("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Only Gmail addresses are allowed.");
      return;
    }

    if (message.trim().split(/\s+/).length > 150) {
      toast.error("Message cannot exceed 150 words.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.sendConnect(form);
      if (res.success) {
        toast.success("Thanks! We’ll be in touch soon.");
        setForm({ email: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to submit. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
      <LoginNavigation />
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
          Let’s Connect
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Got an idea, feedback, or just want to say hi? We’d love to hear from
          you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20 relative z-10"
      >
        <div className="grid grid-cols-1 gap-y-6">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-500"
              placeholder="yourname@gmail.com"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-900"
            >
              Message <span className="text-[8px]">in 150 words</span>
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={4}
              placeholder="Let us know how we can collaborate or assist you."
              className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-sky-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-sky-500 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Sending..." : "Send Connect"}
            </button>
          </div>
        </div>
      </form>
      <SmallFooter />
    </div>
  );
}
