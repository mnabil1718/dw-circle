import { authenticateMiddleware } from "~/middlewares/authenticate";
import type { Route } from "./+types/search";
import { SearchQuery } from "~/components/search/search-query";
import { ResultList } from "~/components/search/result-list";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authenticateMiddleware,
];

export default function Search() {
  return (
    <>
      <div className="sticky top-0 z-10">
        <header className="pt-7 border-b bg-background/80 backdrop-blur-lg">
          {/* <h1 className="px-7 text-2xl font-semibold mb-5">Search</h1> */}
          <div className="px-7 mb-7">
            <SearchQuery />
          </div>
        </header>
        {/* <PostNotification /> */}
      </div>
      <div className="flex flex-col flex-1 divide-y">
        <ResultList />
      </div>
    </>
  );
}
