/** Stub types for future /careers route — extend when careers section is built. */

export interface Career {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  description: string;
  publishedAt: string;
}

export interface CareerListResult {
  careers: Career[];
  total: number;
}
