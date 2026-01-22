import type { Route } from "./+types/home";
import { authenticateMiddleware } from "~/middlewares/authenticate";
import { PostList } from "~/components/post/post-list";
import { PostInput } from "~/components/post/post-input";

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
    <>
      <header className="pt-7 border-b sticky top-0 z-10 bg-background/80 backdrop-blur-lg">
        <h1 className="px-7 text-2xl font-semibold mb-5">Home</h1>
        <div className="px-7 mb-7">
          <PostInput />
        </div>
      </header>

      <PostList />
    </>
  );
}
