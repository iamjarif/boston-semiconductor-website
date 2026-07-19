import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "brand-primary": "var(--color-brand-primary)",
        "brand-primary-hover": "var(--color-brand-primary-hover)",
        "brand-secondary": "var(--color-brand-secondary)",
        "brand-primary-deep": "var(--color-brand-primary-deep)",
        "brand-background": "var(--color-brand-background)",

        "bg-base": "var(--color-bg-base)",
        "bg-surface": "var(--color-bg-surface)",
        "bg-surface-raised": "var(--color-bg-surface-raised)",

        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-disabled": "var(--color-text-disabled)",
        "text-on-brand": "var(--color-text-on-brand)",

        "border-default": "var(--color-border-default)",
        "border-strong": "var(--color-border-strong)",
        "border-button": "var(--color-border-button)",

        "semantic-success": "var(--color-semantic-success)",
        "semantic-warning": "var(--color-semantic-warning)",
        "semantic-error": "var(--color-semantic-error)",
        "semantic-info": "var(--color-semantic-info)",

        "neutral-100": "var(--color-neutral-100)",
        "neutral-200": "var(--color-neutral-200)",
        "neutral-300": "var(--color-neutral-300)",
        "neutral-400": "var(--color-neutral-400)",
        "neutral-500": "var(--color-neutral-500)",
        "neutral-600": "var(--color-neutral-600)",
        "neutral-700": "var(--color-neutral-700)",
        "neutral-800": "var(--color-neutral-800)",
        "neutral-900": "var(--color-neutral-900)",
      },
      backgroundImage: {
        "gradient-button-primary": "var(--gradient-button-primary)",
        "gradient-button-primary-hover": "var(--gradient-button-primary-hover)",
        "gradient-button-secondary": "var(--gradient-button-secondary)",
        "gradient-button-secondary-hover": "var(--gradient-button-secondary-hover)",
      },
    },
  },
};

export default config;
