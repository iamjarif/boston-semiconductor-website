import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

/** Sanity client with write access for webhook side-effects (e.g. marking notifications sent). */
export function getSanityWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
