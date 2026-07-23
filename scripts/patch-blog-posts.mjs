import { config } from "dotenv";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const rootDir = resolve(import.meta.dirname, "..");
config({ path: resolve(rootDir, ".env.local"), override: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

const client = getCliClient({ projectId, dataset });

/** Post updates: excerpt + category for existing test posts. */
const updates = [
  {
    id: "8d1b7db6-d4df-41e2-a14b-70d664b645e0",
    set: {
      title: "What Are Semiconductors?",
      slug: { _type: "slug", current: "what-are-semiconductors" },
      category: "Technology",
      excerpt:
        "Semiconductors power smartphones, EVs, medical devices, and satellites. Learn what they are and why they are essential to modern technology.",
    },
  },
  {
    id: "cde3edc7-2a41-4cce-9952-34fc58bda10a",
    set: {
      category: "Technology",
      excerpt:
        "A beginner's guide to semiconductors — what they are, how they work, and why they power nearly every electronic device we use.",
    },
  },
];

let transaction = client.transaction();

for (const { id, set } of updates) {
  transaction = transaction.patch(id, (patch) => patch.set(set));
}

const result = await transaction.commit();
console.log(`Updated ${result.documentIds.length} post(s):`);
for (const { id, set } of updates) {
  console.log(`- ${id} → category: "${set.category}"`);
}
