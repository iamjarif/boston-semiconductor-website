import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { newsletterSubscriber } from "./schema/newsletterSubscriber";
import { post } from "./schema/post";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

if (!projectId) {
  throw new Error(
    "Missing Sanity project ID. Run `npm run studio` from the repo root so .env.local is loaded, or set SANITY_STUDIO_PROJECT_ID.",
  );
}

export default defineConfig({
  name: "boston-semiconductor",
  title: "Boston Semiconductor",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: [post, newsletterSubscriber],
  },
});
