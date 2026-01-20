import type { Route } from "./+types/home";
import { authenticateMiddleware } from "~/middlewares/authenticate";
import { Sidebar } from "~/components/sidebar";
import { PostInput } from "~/components/post-input";
import { PostListItem } from "~/components/post-list-item";
import { ProfileCard } from "~/components/profile-card";
import { SuggestionCard } from "~/components/suggestion-card";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authenticateMiddleware,
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="bg-background h-screen">
      <div className="mx-auto md:max-w-[80vw] w-full h-screen flex p-2">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Feed */}
        <div className="flex flex-col flex-1">
          <header className="pt-7 px-5 border-b">
            <h1 className="text-2xl font-semibold mb-3">Home</h1>
            <PostInput />
          </header>

          <ul className="flex-1 flex flex-col overflow-y-auto divide-y">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <PostListItem key={i} />
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="shrink-0 w-100 flex flex-col gap-5 h-full border-l p-4">
          <ProfileCard />
          <SuggestionCard />
        </div>
      </div>
    </div>
  );
}
