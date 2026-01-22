import { useRef, type ContextType, type RefObject } from "react";
import { Outlet, useOutletContext } from "react-router";
import { CreditCard } from "~/components/credit-card";
import { ProfileCard } from "~/components/profile-card";
import { Sidebar } from "~/components/sidebar";
import { SuggestionCard } from "~/components/suggestion-card";

export type PostLayoutContext = { feedRef: RefObject<HTMLDivElement | null> };

export default function PostLayout() {
  const feedRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-background h-screen">
      <div className="mx-auto md:max-w-[80vw] w-full h-screen flex p-2">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Feed */}
        <div
          ref={feedRef}
          className="flex flex-col flex-1 overflow-y-auto scrollbar-minimal"
        >
          <Outlet context={{ feedRef } satisfies PostLayoutContext} />
        </div>

        {/* Right Column */}
        <div className="shrink-0 w-120 flex flex-col gap-5 border-l overflow-y-auto scrollbar-none p-4">
          <ProfileCard />
          <SuggestionCard />
          <CreditCard />
        </div>
      </div>
    </div>
  );
}

export function useFeed() {
  return useOutletContext<PostLayoutContext>();
}
