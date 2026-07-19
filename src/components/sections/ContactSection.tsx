"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { InputField, type InputFieldMessage } from "@/components/ui/InputField";

interface ContactFormState {
  fullName: string;
  company: string;
  description: string;
}

interface ContactFormErrors {
  fullName?: string;
}

const initialFormState: ContactFormState = {
  fullName: "",
  company: "",
  description: "",
};

export function ContactSection() {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (values: ContactFormState): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    // TODO: wire to backend/email service
    setSubmitted(true);
  };

  const fullNameMessage: InputFieldMessage | undefined = errors.fullName
    ? { type: "error", text: errors.fullName }
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

      <div className="relative z-10 flex w-full max-w-[1316px] flex-col items-center gap-16 py-16 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="flex flex-col items-center gap-7 text-center lg:max-w-[558px] lg:items-start lg:text-left">
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
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 lg:max-w-[499px]"
          noValidate
        >
          <InputField
            label="Full Name"
            placeholder="Full Name"
            showLabel={false}
            required
            value={form.fullName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, fullName: event.target.value }))
            }
            message={fullNameMessage}
            showHelperText={Boolean(fullNameMessage)}
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
            showHelperText={false}
            multiline
            rows={6}
            className="flex-1"
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
          />
          <Button type="submit" variant="secondary" size="xl">
            Discuss Your Project
          </Button>
          {submitted ? (
            <p className="text-body-sm text-semantic-success" role="status">
              Thanks &mdash; we&apos;ll be in touch within one business day.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
