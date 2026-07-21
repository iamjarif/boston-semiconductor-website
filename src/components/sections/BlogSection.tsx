import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { BlogCard } from "@/components/ui/BlogCard";
import { Button } from "@/components/ui/Button";

interface BlogPostData {
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

const blogPosts: BlogPostData[] = [
  {
    category: "GaN Power",
    date: "June 12, 2025",
    title:
      "GaN Power Design at the Intersection of TCAD and Real-World Thermal Constraints",
    imageSrc: "/images/blog/placeholder.png",
    imageAlt: "Illustration for the GaN power design article",
    href: "/blog/gan-power-tcad-thermal-constraints",
  },
  {
    category: "3D-IC",
    date: "May 28, 2025",
    title:
      "3D-IC Integration: Chiplet Architectures and the UCIe Die-to-Die Protocol",
    imageSrc: "/images/blog/placeholder.png",
    imageAlt: "Illustration for the 3D-IC chiplet integration article",
    href: "/blog/3d-ic-chiplet-ucie",
  },
  {
    category: "Place & Route",
    date: "May 14, 2025",
    title:
      "From Foundry PDK to DRC-Clean GDSII: Our Place-and-Route Signoff Flow",
    imageSrc: "/images/blog/placeholder.png",
    imageAlt: "Illustration for the place-and-route signoff flow article",
    href: "/blog/pdk-to-drc-clean-gdsii",
  },
];

export function BlogSection() {
  return (
    <section className="flex flex-col items-center gap-16 bg-bg-base px-4 py-24 lg:py-[140px]">
      <div className="flex w-full max-w-[1316px] flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <p className="text-mono-lg text-brand-primary">Blogs</p>
          <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
            Latest Insights.
          </h2>
        </div>
        <Button href="/blog" variant="ghost" trailingIcon={<ArrowRight size={20} weight="bold" />}>
          Find More
        </Button>
      </div>

      <div className="grid w-full max-w-[1316px] grid-cols-1 gap-6 sm:grid-cols-3">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.href}
            title={post.title}
            category={post.category}
            date={post.date}
            imageSrc={post.imageSrc}
            imageAlt={post.imageAlt}
            href={post.href}
          />
        ))}
      </div>
    </section>
  );
}
