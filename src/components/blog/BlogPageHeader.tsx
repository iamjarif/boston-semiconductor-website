interface BlogPageHeaderProps {
  eyebrow: string;
  heading: string;
  subcopy?: string;
  align?: "center" | "left";
  className?: string;
}

export function BlogPageHeader({
  eyebrow,
  heading,
  subcopy,
  align = "center",
  className = "",
}: BlogPageHeaderProps) {
  const alignment =
    align === "left"
      ? "items-start text-left"
      : "items-center text-center";

  return (
    <div className={`flex flex-col gap-7 ${alignment} ${className}`}>
      <div className={`flex flex-col gap-3 ${alignment}`}>
        <p className="text-mono-lg text-brand-primary">{eyebrow}</p>
        <h1 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
          {heading}
        </h1>
      </div>
      {subcopy ? (
        <p className="max-w-[750px] text-body text-text-secondary">{subcopy}</p>
      ) : null}
    </div>
  );
}
