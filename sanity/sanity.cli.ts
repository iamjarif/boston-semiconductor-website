import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineCliConfig } from "sanity/cli";

const studioDir = fileURLToPath(new URL(".", import.meta.url));

config({ path: resolve(studioDir, "../.env.local"), override: true });

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

export default defineCliConfig({
  api: {
    projectId: projectId!,
    dataset,
  },
  studioHost: "boston-semiconductor",
  deployment: {
    appId: "wc131yqt7i5vzagg0nvc7pu8",
  },
});
