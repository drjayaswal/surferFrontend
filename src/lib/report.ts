"use server";

import { z } from "zod";
import { randomUUID } from "crypto";

// Define schemas for different form types
const connectSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." }),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters." }),
});

const helpSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  issueType: z.enum(["bug", "feature_request", "performance_lag", "other"], {
    errorMap: () => ({ message: "Please select an issue type." }),
  }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
  stepsToReproduce: z.string().optional(),
  affectedFeature: z.string().optional(),
  // attachment: z.any().optional(), // File handling requires more complex setup
});

export interface FormState {
  message: string;
  token?: string;
  errors?: {
    name?: string[];
    email?: string[];
    issueType?: string[];
    subject?: string[];
    description?: string[];
    message?: string[];
    stepsToReproduce?: string[];
    affectedFeature?: string[];
    attachment?: string[];
  };
  success: boolean;
}

export async function submitForm(
  formType: "connect" | "help",
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  let validatedFields: z.SafeParseReturnType<any, any>;
  let responseMessage: string;
  let token: string | undefined = undefined;

  if (formType === "connect") {
    validatedFields = connectSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });
    responseMessage =
      "Thank you for connecting with us! We'll get back to you soon.";
  } else {
    // formType === 'help'
    validatedFields = helpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      issueType: formData.get("issueType"),
      subject: formData.get("subject"),
      description: formData.get("description"),
      stepsToReproduce: formData.get("stepsToReproduce"),
      affectedFeature: formData.get("affectedFeature"),
      // attachment: formData.get("attachment"),
    });
    responseMessage =
      "Thank you! Your issue has been submitted successfully. Our AI-powered system is already on it.";
    token = `ASSIST-${randomUUID().slice(0, 8).toUpperCase()}`;
  }

  if (!validatedFields.success) {
    return {
      message: "Form submission failed. Please check the errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // Simulate sending data to a backend/ticketing system
  console.log(`New ${formType} form submitted:`, validatedFields.data);
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

  return {
    message: responseMessage,
    token: token,
    success: true,
  };
}
