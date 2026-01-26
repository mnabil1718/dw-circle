import { authenticateMiddleware } from "~/middlewares/authenticate";
import type { Route } from "./+types/follow";
import { FollowTabs } from "~/components/follow/follow";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authenticateMiddleware,
];

export default function Follow() {
  return <FollowTabs />;
}
