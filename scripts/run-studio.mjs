import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { config } from "dotenv";

const rootDir = resolve(import.meta.dirname, "..");

config({ path: resolve(rootDir, ".env.local"), override: true });

if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  process.env.SANITY_STUDIO_PROJECT_ID =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

if (!process.env.SANITY_STUDIO_DATASET) {
  process.env.SANITY_STUDIO_DATASET =
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
}

const child = spawn("npm", ["run", "dev", "--prefix", "sanity"], {
  cwd: rootDir,
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
