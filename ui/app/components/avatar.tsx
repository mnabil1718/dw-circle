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
    <div className={cn(className, "relative rounded-full")}>
      <div className="rounded-full w-full h-full overflow-hidden">
        <img src={image} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
