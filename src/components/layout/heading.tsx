interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export default function Heading({
  title,
  description,
  className,
}: HeadingProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold capitalize tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
