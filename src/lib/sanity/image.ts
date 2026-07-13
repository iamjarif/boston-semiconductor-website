import imageUrlBuilder from "@sanity/image-url";

import { getSanityClient } from "./client";

const client = getSanityClient();
const builder = client ? imageUrlBuilder(client) : null;

export function urlForImage(source: Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0]) {
  if (!builder) {
    throw new Error("Sanity client is not configured");
  }
  return builder.image(source);
}
