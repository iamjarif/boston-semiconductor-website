import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { post } from "./schema/post";

if (typeof window === "undefined") {
  const studioDir = fileURLToPath(new URL(".", import.meta.url));
  config({ path: resolve(studioDir, "../.env.local"), override: true });
}

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

if (!projectId) {
  throw new Error(
    "Missing Sanity project ID. Set NEXT_PUBLIC_SANITY_PROJECT_ID in the root .env.local file.",
  );
}

export default defineConfig({
  name: "boston-semiconductor",
  title: "Boston Semiconductor",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: [post],
  },
});
