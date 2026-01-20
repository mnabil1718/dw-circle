import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

export type SidebarLinkProps = {
  url: string;
  label: string;
  icon: React.ReactNode;
};

export function SidebarLink({ label, icon, url }: SidebarLinkProps) {
  return (
    <NavLink to={url}>
      {({ isActive }) => (
        <span
          className={cn(
            "flex items-center gap-2 hover:bg-accent/50 py-3 px-4 rounded-full",
            isActive ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {icon} {label}
        </span>
      )}
    </NavLink>
  );
}
