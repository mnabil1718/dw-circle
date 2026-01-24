import type { Route } from "./+types/home";
import { authenticateMiddleware } from "~/middlewares/authenticate";
import { PostList } from "~/components/post/post-list";
import { FeedHeader } from "~/components/post/feed-header";

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
      <FeedHeader />
      <PostList />
    </>
  );
}
