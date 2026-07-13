import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { post } from "./schema/post";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

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
