"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Email is required.");
      setSubmitted(false);
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Please enter a valid email address.");
      setSubmitted(false);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, website }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Something went wrong.");
      }

      setSubmitted(true);
      setEmail("");
    } catch (submitError) {
      setSubmitted(false);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackMessage = error
    ? { type: "error" as const, text: error }
    : submitted
      ? { type: "success" as const, text: "Thanks — you're on the list." }
      : undefined;

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-mono text-brand-primary">// Newsletter</p>
        <h2 className="text-h6 text-text-primary">Stay in the loop</h2>
        <p className="text-body-sm text-text-secondary">
          Engineering insights, tapeout updates, and technical articles from
          our team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <div className="flex flex-row items-center gap-3">
          <InputField
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            disabled={isSubmitting}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
              if (submitted) setSubmitted(false);
            }}
            showLabel={false}
            showHelperText={false}
            size="md"
            className="min-w-0 flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="m"
            className="w-auto shrink-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing…" : "Subscribe"}
          </Button>
        </div>

        {feedbackMessage ? (
          <p
            className={`text-body-sm ${
              feedbackMessage.type === "error"
                ? "text-semantic-error"
                : "text-semantic-success"
            }`}
          >
            {feedbackMessage.text}
          </p>
        ) : null}
      </form>
    </div>
  );
}
