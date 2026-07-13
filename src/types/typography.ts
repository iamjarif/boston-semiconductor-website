export type TextStyle =
  | "title"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body-lg"
  | "body"
  | "body-sm"
  | "body-xs"
  | "label-lg"
  | "label"
  | "label-sm"
  | "mono-lg"
  | "mono"
  | "mono-sm";

/** Maps TextStyle names to their Tailwind utility class. */
export const textStyleClasses: Record<TextStyle, string> = {
  title: "text-title",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6",
  "body-lg": "text-body-lg",
  body: "text-body",
  "body-sm": "text-body-sm",
  "body-xs": "text-body-xs",
  "label-lg": "text-label-lg",
  label: "text-label",
  "label-sm": "text-label-sm",
  "mono-lg": "text-mono-lg",
  mono: "text-mono",
  "mono-sm": "text-mono-sm",
};
