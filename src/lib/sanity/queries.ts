/** GROQ queries for blog content — sorted by publishedAt descending. */

export const postsQuery = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    "slug": slug.current,
    title,
    excerpt,
    publishedAt,
    coverImage {
      asset->{ _id, url },
      alt
    }
  }
`;

export const postsCountQuery = `
  count(*[_type == "post" && defined(slug.current)])
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    excerpt,
    publishedAt,
    coverImage {
      asset->{ _id, url },
      alt
    },
    body
  }
`;

export const postSlugsQuery = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`;
