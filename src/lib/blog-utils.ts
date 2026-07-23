import type { PortableTextBlock } from "@portabletext/types";

const WORDS_PER_MINUTE = 200;

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function extractTextFromBlock(block: PortableTextBlock): string {
  if (block._type !== "block" || !Array.isArray(block.children)) {
    return "";
  }

  return block.children
    .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
    .join(" ");
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Estimate reading time from Portable Text body (~200 WPM). */
export function estimateReadingTime(body: PortableTextBlock[]): number {
  const text = body.map(extractTextFromBlock).join(" ");
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
