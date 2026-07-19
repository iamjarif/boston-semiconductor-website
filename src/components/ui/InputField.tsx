"use client";

import {
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

export type InputFieldSize = "sm" | "md" | "lg";

export type InputFieldMessage = {
  type: "helper" | "error" | "warning" | "success";
  text: string;
};

export interface InputFieldProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size" | "prefix"> {
  size?: InputFieldSize;
  label?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  showLabel?: boolean;
  required?: boolean;
  optionalBadge?: boolean;
  showPrefix?: boolean;
  showSuffix?: boolean;
  showClearButton?: boolean;
  passwordToggle?: boolean;
  loading?: boolean;
  showCounter?: boolean;
  showHelperText?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  tooltipIcon?: ReactNode;
  message?: InputFieldMessage;
  onClear?: () => void;
  className?: string;
  /** Renders a `<textarea>` instead of a single-line `<input>`. */
  multiline?: boolean;
  /** Visible text rows when `multiline` is set. */
  rows?: number;
}

const sizeStyles: Record<
  InputFieldSize,
  { container: string; input: string; icon: string }
> = {
  sm: {
    container: "px-3 py-2",
    input: "text-body-sm",
    icon: "size-6",
  },
  md: {
    container: "px-4 py-3",
    input: "text-body",
    icon: "size-8",
  },
  lg: {
    container: "px-4 py-3.5",
    input: "text-body-lg",
    icon: "size-8",
  },
};

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-text-secondary ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="size-4"
      aria-hidden="true"
    >
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
        <path
          d="M4 16s5.333-8 12-8 12 8 12 8-5.333 8-12 8-12-8-12-8Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
      <path
        d="M4 16s5.333-8 12-8c2.667 0 4.933.933 6.667 2.333M28 16s-5.333 8-12 8c-2.667 0-4.933-.933-6.667-2.333M4 4l24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessageIcon({ type }: { type: InputFieldMessage["type"] }) {
  const colorClass =
    type === "error"
      ? "text-semantic-error"
      : type === "warning"
        ? "text-semantic-warning"
        : type === "success"
          ? "text-semantic-success"
          : "text-text-secondary";

  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      className={`size-3.5 shrink-0 ${colorClass}`}
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M7 4.5v3M7 9.5v.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InputField({
  size = "md",
  label = "Label",
  placeholder = "Placeholder text",
  prefix = "$",
  suffix = ".00",
  showLabel = true,
  required = false,
  optionalBadge = false,
  showPrefix = false,
  showSuffix = false,
  showClearButton = false,
  passwordToggle = false,
  loading = false,
  showCounter = false,
  showHelperText = true,
  leadingIcon,
  trailingIcon,
  tooltipIcon,
  message,
  onClear,
  className = "",
  disabled,
  readOnly,
  maxLength,
  value,
  defaultValue,
  onChange,
  id,
  type = "text",
  multiline = false,
  rows = 4,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue?.toString() ?? "",
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value ?? "") : internalValue;
  const hasValue = currentValue.length > 0;
  const resolvedMessage = showHelperText
    ? (message ?? { type: "helper" as const, text: "Helper text goes here" })
    : undefined;

  const borderClass =
    resolvedMessage?.type === "error"
      ? "border-2 border-semantic-error"
      : resolvedMessage?.type === "warning"
        ? "border-2 border-semantic-warning"
        : resolvedMessage?.type === "success"
          ? "border-2 border-semantic-success"
          : "border border-border-default hover:border-border-strong focus-within:border-2 focus-within:border-brand-primary active:border-2 active:border-brand-primary";

  const messageColorClass =
    resolvedMessage?.type === "error"
      ? "text-semantic-error"
      : resolvedMessage?.type === "warning"
        ? "text-semantic-warning"
        : resolvedMessage?.type === "success"
          ? "text-semantic-success"
          : "text-text-secondary";

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event as ChangeEvent<HTMLInputElement>);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(() => {
    onClear?.();

    if (!isControlled) {
      setInternalValue("");
    }

    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    } as ChangeEvent<HTMLInputElement>);
  }, [isControlled, onChange, onClear]);

  const inputType = passwordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  const styles = sizeStyles[size];
  const isDisabled = disabled || loading;
  const showBottomRow =
    (showHelperText && resolvedMessage !== undefined) || showCounter;

  return (
    <div
      className={`flex w-full flex-col gap-2 ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {showLabel ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <label htmlFor={inputId} className="text-label text-text-secondary">
              {label}
            </label>
            {required ? (
              <span className="text-label text-semantic-error" aria-hidden="true">
                *
              </span>
            ) : null}
            {tooltipIcon ? (
              <span className="inline-flex size-3.5 items-center text-text-secondary">
                {tooltipIcon}
              </span>
            ) : null}
          </div>
          {optionalBadge ? (
            <span className="rounded-full bg-bg-surface-raised px-2 py-0.5 text-label-sm text-text-secondary">
              Optional
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        className={`flex gap-2 rounded-lg bg-bg-base transition-colors ${styles.container} ${borderClass} ${readOnly ? "cursor-default" : ""} ${multiline ? "flex-1 items-start" : "items-center"}`}
      >
        {leadingIcon ? (
          <span
            className={`inline-flex shrink-0 items-center text-text-secondary ${styles.icon}`}
          >
            {leadingIcon}
          </span>
        ) : null}

        {showPrefix ? (
          <span className={`shrink-0 text-text-secondary ${styles.input}`}>
            {prefix}
          </span>
        ) : null}

        {multiline ? (
          <textarea
            id={inputId}
            value={currentValue}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={readOnly}
            maxLength={maxLength}
            rows={rows}
            onChange={handleChange}
            aria-invalid={resolvedMessage?.type === "error" || undefined}
            aria-describedby={showBottomRow ? messageId : undefined}
            className={`min-w-0 flex-1 resize-none bg-transparent outline-none placeholder:text-text-secondary ${
              hasValue ? "text-text-primary" : "text-text-secondary"
            } ${styles.input} ${readOnly ? "cursor-default" : ""}`}
          />
        ) : (
          <input
            id={inputId}
            type={inputType}
            value={currentValue}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={readOnly}
            maxLength={maxLength}
            onChange={handleChange}
            aria-invalid={resolvedMessage?.type === "error" || undefined}
            aria-describedby={showBottomRow ? messageId : undefined}
            className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-secondary ${
              hasValue ? "text-text-primary" : "text-text-secondary"
            } ${styles.input} ${readOnly ? "cursor-default" : ""}`}
            {...props}
          />
        )}

        {showSuffix && !multiline ? (
          <span className={`shrink-0 text-text-secondary ${styles.input}`}>
            {suffix}
          </span>
        ) : null}

        {showClearButton && hasValue && !readOnly && !isDisabled && !multiline ? (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex shrink-0 items-center text-text-secondary transition-colors hover:text-text-primary"
            aria-label="Clear input"
          >
            <ClearIcon />
          </button>
        ) : null}

        {passwordToggle && !loading && !multiline ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="inline-flex shrink-0 items-center text-text-secondary transition-colors hover:text-text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        ) : null}

        {loading ? (
          <Spinner className={styles.icon} />
        ) : trailingIcon ? (
          <span
            className={`inline-flex shrink-0 items-center text-text-secondary ${styles.icon}`}
          >
            {trailingIcon}
          </span>
        ) : null}
      </div>

      {showBottomRow ? (
        <div
          id={messageId}
          className="flex items-center justify-between gap-2"
        >
          {showHelperText && resolvedMessage ? (
            <div className="flex items-center gap-1">
              {resolvedMessage.type !== "helper" ? (
                <MessageIcon type={resolvedMessage.type} />
              ) : null}
              <p className={`text-body-sm ${messageColorClass}`}>
                {resolvedMessage.text}
              </p>
            </div>
          ) : (
            <span />
          )}

          {showCounter && maxLength !== undefined ? (
            <p className="text-mono text-text-secondary">
              {currentValue.length}/{maxLength}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
