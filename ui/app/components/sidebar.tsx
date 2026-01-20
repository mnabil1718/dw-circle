import { Brand } from "~/components/brand";
import { CircleUserRound, Heart, House, LogOut, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SidebarLink } from "~/components/sidebar-link";
import { Logout } from "./logout";

export function Sidebar() {
  return (
    <div className="max-w-85 w-full flex flex-col border-r pt-4">
      <div className="max-w-40">
        <Brand />
      </div>
      <div className="flex-1 flex flex-col justify-between text-lg p-6">
        <nav>
          <SidebarLink url="/home" label="Home" icon={<House />} />
          <SidebarLink url="/search" label="Search" icon={<Search />} />
          <SidebarLink url="/follow" label="Follow" icon={<Heart />} />
          <SidebarLink
            url="/profile"
            label="Profile"
            icon={<CircleUserRound />}
          />
          <Button className="w-full rounded-full font-medium text-lg py-6 mt-5">
            Create Post
          </Button>
        </nav>
        <Logout />
      </div>
    </div>
  );
}
