import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email is too long.")
  .email("Please enter a valid email address.");

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(200, "Name is too long."),
  email: emailField,
  company: z.string().trim().max(200, "Company name is too long.").optional(),
  projectDescription: z
    .string()
    .trim()
    .min(1, "Project description is required.")
    .max(5000, "Project description is too long."),
  website: z.string().optional(),
});

export const newsletterFormSchema = z.object({
  email: emailField,
  website: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>;

/** Strip CRLF to prevent email header injection in subjects. */
export function sanitizeEmailHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}
