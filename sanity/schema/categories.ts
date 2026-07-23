/** Blog post categories — editors pick from this list in Studio. */
export const blogCategories = [
  { title: "Industry Insights", value: "Industry Insights" },
  { title: "Company News", value: "Company News" },
  { title: "Technology", value: "Technology" },
  { title: "Engineering", value: "Engineering" },
] as const;

export type BlogCategory = (typeof blogCategories)[number]["value"];
