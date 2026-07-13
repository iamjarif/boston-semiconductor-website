import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

/** Returns true when Sanity env vars are configured. */
export function isSanityConfigured(): boolean {
  return Boolean(projectId);
}

let _client: SanityClient | null = null;

/** Lazy-initialized Sanity client — only created when env vars are present. */
export function getSanityClient(): SanityClient | null {
  if (!projectId) return null;

  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN,
    });
  }

  return _client;
}
