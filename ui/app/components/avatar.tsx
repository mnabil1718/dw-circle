import { cn } from "~/lib/utils";

export function Avatar({ className }: { className: string }) {
  return (
    <div
      className={cn(
        className,
        "relative rounded-full overflow-hidden bg-foreground",
      )}
    >
      <img
        src="/avatar.jpg"
        alt="Profile Picture"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
