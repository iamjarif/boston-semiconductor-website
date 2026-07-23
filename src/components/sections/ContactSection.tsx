"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { InputField, type InputFieldMessage } from "@/components/ui/InputField";
import { SectionReveal, SectionRevealItem } from "@/components/ui/SectionReveal";

interface ContactFormState {
  name: string;
  email: string;
  company: string;
  projectDescription: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  projectDescription?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  company: "",
  projectDescription: "",
};

export function ContactSection() {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (values: ContactFormState): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.projectDescription.trim()) {
      nextErrors.projectDescription = "Project description is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          projectDescription: form.projectDescription.trim(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Something went wrong.");
      }

      setSubmitted(true);
      setForm(initialFormState);
    } catch (error) {
      setSubmitted(false);
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameMessage: InputFieldMessage | undefined = errors.name
    ? { type: "error", text: errors.name }
    : undefined;

  const emailMessage: InputFieldMessage | undefined = errors.email
    ? { type: "error", text: errors.email }
    : undefined;

  const projectDescriptionMessage: InputFieldMessage | undefined =
    errors.projectDescription
      ? { type: "error", text: errors.projectDescription }
      : undefined;

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center overflow-hidden bg-bg-surface px-4 py-16 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-contact-1.svg"
          size={524}
          className="left-[-150px] top-1/2 -translate-y-1/2"
        />
        <GlowOrb
          src="/images/glows/glow-contact-2.svg"
          size={299}
          rotate={-60}
          className="right-[-100px] top-[-100px]"
        />
      </div>

      <SectionReveal className="relative z-10 flex w-full max-w-[1316px] flex-col items-center gap-16 py-16 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <SectionRevealItem className="flex flex-col items-center gap-7 text-center lg:max-w-[558px] lg:items-start lg:text-left">
          <div className="flex flex-col items-center gap-3 lg:items-start">
            <p className="text-mono-lg text-border-button">
              LET&apos;S BUILD TOGETHER
            </p>
            <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
              Ready to start your next tapeout?
            </h2>
          </div>
          <p className="max-w-[750px] text-body text-text-secondary">
            Tell us about your project - we&apos;ll get back within one
            business day.
          </p>
        </SectionRevealItem>

        <SectionRevealItem className="w-full lg:max-w-[499px]">
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4"
            noValidate
          >
            <InputField
              label="Full Name"
              placeholder="Full Name"
              showLabel={false}
              required
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              message={nameMessage}
              showHelperText={Boolean(nameMessage)}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="Email"
              showLabel={false}
              required
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              message={emailMessage}
              showHelperText={Boolean(emailMessage)}
            />
            <InputField
              label="Company"
              placeholder="Company"
              showLabel={false}
              showHelperText={false}
              value={form.company}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, company: event.target.value }))
              }
            />
            <InputField
              label="Project description"
              placeholder="Describe your project..."
              showLabel={false}
              required
              value={form.projectDescription}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  projectDescription: event.target.value,
                }))
              }
              message={projectDescriptionMessage}
              showHelperText={Boolean(projectDescriptionMessage)}
              multiline
              rows={6}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="secondary"
              size="xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Discuss Your Project"}
            </Button>
            {submitError ? (
              <p className="text-body-sm text-semantic-error" role="alert">
                {submitError}
              </p>
            ) : null}
            {submitted ? (
              <p className="text-body-sm text-semantic-success" role="status">
                Thanks &mdash; we&apos;ll be in touch within one business day.
              </p>
            ) : null}
          </form>
        </SectionRevealItem>
      </SectionReveal>
    </section>
  );
}
