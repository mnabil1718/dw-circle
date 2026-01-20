import { cn } from "~/lib/utils";

export function Avatar({
  className,
  image = "/avatar.jpg",
  alt = "Profile Picture",
}: {
  className: string;
  image?: string;
  alt?: string;
}) {
  return (
    <div
      className={cn(
        className,
        "relative rounded-full overflow-hidden bg-foreground",
      )}
    >
      <img src={image} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
