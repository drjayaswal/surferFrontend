"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  Send,
  ChevronDown,
} from "lucide-react";
import { FormState, submitForm } from "@/lib/report";

const initialState: FormState = {
  message: "",
  success: false,
};

interface GenericFormProps {
  type: "connect" | "help";
}

export default function GenericForm({ type }: GenericFormProps) {
  const [state, dispatch, isPending] = useActionState(
    submitForm.bind(null, type),
    initialState
  );
  const [showSteps, setShowSteps] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setShowSteps(false);
    }
  }, [state.success]);

  const handleIssueTypeChange = (value: string) => {
    setShowSteps(value === "bug");
  };

  const formTitle = type === "connect" ? "Connect With Us" : "Need Any Help?";
  const formDescription =
    type === "connect"
      ? "Have a question or want to collaborate? Send us a message!"
      : "Spotted a bug, have a brilliant feature idea, or experiencing a hiccup? Let us know!";
  const submitButtonText =
    type === "connect" ? "Send Message" : "Submit AssistCue";
  const submitButtonIcon = type === "connect" && (
    <Send className="mr-2 h-5 w-5" />
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-sky-600 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-sky-700/50">
      <form ref={formRef} action={dispatch} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Input
              id="name"
              name="name"
              placeholder="Ada Lovelace"
              className="focus-visible:bg-sky-700 border-0 text-white placeholder:text-sky-300 focus-visible:ring-0 shadow-none"
            />
            {state.errors?.name && (
              <p className="text-red-400 text-xs mt-1">
                {state.errors.name[0]}
              </p>
            )}
          </div>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ada@example.com"
              required
              className="focus-visible:bg-sky-700 border-0 text-white placeholder:text-sky-300 focus-visible:ring-0 shadow-none"
            />
            {state.errors?.email && (
              <p className="text-red-400 text-xs mt-1">
                {state.errors.email[0]}
              </p>
            )}
          </div>
        </div>

        {type === "help" && (
          <div className="space-y-2">
            <Select
              name="issueType"
              required
              onValueChange={handleIssueTypeChange}
            >
              <SelectTrigger
                id="issueType"
                className="w-full bg-gradient-to-r from-sky-600 text-sky-300 placeholder-white border-0 focus:ring-0 focus-visible:ring-0 transition-all duration-200"
              >
                <span className="text-white flex gap-2 items-center justify-between">
                  Select Issue Type
                  <ChevronDown className="text-white" />
                </span>
              </SelectTrigger>

              <SelectContent className="bg-sky-700 text-white border border-sky-600 shadow-xl rounded-lg">
                <SelectItem
                  value="bug"
                  className="hover:bg-sky-600/70 transition-colors cursor-pointer"
                >
                  Bug Report
                </SelectItem>
                <SelectItem
                  value="feature_request"
                  className="hover:bg-sky-600/70 transition-colors cursor-pointer"
                >
                  Feature Request
                </SelectItem>
                <SelectItem
                  value="performance_lag"
                  className="hover:bg-sky-600/70 transition-colors cursor-pointer"
                >
                  Performance Lag
                </SelectItem>
                <SelectItem
                  value="other"
                  className="hover:bg-sky-600/70 transition-colors cursor-pointer"
                >
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.issueType && (
              <p className="text-red-400 text-xs mt-1">
                {state.errors.issueType[0]}
              </p>
            )}
          </div>
        )}

        <div>
          <Input
            id="subject"
            name="subject"
            placeholder={
              type === "connect"
                ? "e.g., Partnership Inquiry"
                : "Issue you are facing e.g., Login button not working on mobile"
            }
            required
            className="focus-visible:bg-sky-700 border-0 text-white placeholder:text-sky-300 focus-visible:ring-0 shadow-none"
          />
          {state.errors?.subject && (
            <p className="text-red-400 text-xs mt-1">
              {state.errors.subject[0]}
            </p>
          )}
        </div>

        <div>
          <Textarea
            id={type === "connect" ? "message" : "description"}
            name={type === "connect" ? "message" : "description"}
            placeholder={
              type === "connect"
                ? "Type your message here..."
                : "Describe the issue in detail..."
            }
            rows={5}
            required
            className="focus-visible:bg-sky-700 border-2 border-sky-300/50 focus-visible:border-transparent text-white placeholder:text-sky-300 focus-visible:ring-0 shadow-none"
          />
          {state.errors?.description && (
            <p className="text-red-400 text-xs mt-1">
              {state.errors.description[0]}
            </p>
          )}
          {state.errors?.message && (
            <p className="text-red-400 text-xs mt-1">
              {state.errors.message[0]}
            </p>
          )}
        </div>

        {type === "help" && showSteps && (
          <div>
            <Textarea
              id="stepsToReproduce"
              name="stepsToReproduce"
              placeholder="1. Go to '...'&#x0a;2. Click on '...'&#x0a;3. Scroll down to '...'&#x0a;4. See error"
              rows={4}
              className="focus-visible:bg-sky-700 text-white placeholder:text-sky-300 focus-visible:ring-0 shadow-none"
            />
            {state.errors?.stepsToReproduce && (
              <p className="text-red-400 text-xs mt-1">
                {state.errors.stepsToReproduce[0]}
              </p>
            )}
          </div>
        )}

        {type === "help" && (
          <div>
            <Input
              id="affectedFeature"
              name="affectedFeature"
              placeholder="e.g., User Profile Page, Checkout Process"
              className="focus-visible:bg-sky-700 border-0 text-white placeholder:text-sky-300 focus-visible:ring-0 shadow-none"
            />
            {state.errors?.affectedFeature && (
              <p className="text-red-400 text-xs mt-1">
                {state.errors.affectedFeature[0]}
              </p>
            )}
          </div>
        )}

        {/* File upload can be added here if needed, but requires more setup for storage */}
        <Input
          id="attachment"
          name="attachment"
          type="file"
          className="bg-transparent border-0 text-white file:text-sky-700 file:bg-sky-400 file:border-0 file:rounded-md file:px-3 file:py-0.5"
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-transparent hover:bg-sky-600 text-white font-semibold text-lg py-3 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
            </>
          ) : (
            submitButtonIcon
          )}
          {isPending ? "" : submitButtonText}
        </Button>
      </form>

      {state.message && (
        <Alert
          className={`mt-6 ${
            state.success
              ? "bg-green-900/70 border-green-500/50 text-green-300"
              : "bg-red-900/70 border-red-500/50 text-red-300"
          }`}
        >
          {state.success ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          <AlertTitle
            className={state.success ? "text-green-200" : "text-red-200"}
          >
            {state.success ? "Success!" : "Error!"}
          </AlertTitle>
          <AlertDescription>
            {state.message}
            {state.token && (
              <div className="mt-2">
                Your Reference Token:
                <strong className="ml-2 font-mono bg-slate-700/50 px-2 py-1 rounded text-sky-300 border border-sky-600/50">
                  {state.token}
                </strong>
                <p className="text-xs mt-1 text-sky-400/80">
                  Please save this token for future reference.
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
