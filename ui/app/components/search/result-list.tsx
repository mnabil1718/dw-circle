import { useAppSelector } from "~/store/hooks";

import {
  selectSearchKeyword,
  selectSearchResults,
  selectSearchStatus,
} from "~/store/search";
import type { Follow } from "~/dto/follow";
import { Avatar } from "../avatar";
import { ToggleFollowButton } from "../follow/toggle-follow-btn";
import { Loader } from "lucide-react";

export function ResultList() {
  const results = useAppSelector(selectSearchResults);
  const keyword = useAppSelector(selectSearchKeyword);
  const status = useAppSelector(selectSearchStatus);

  // Init
  if (keyword === "" && status === "idle") {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Search for people's name or username
      </div>
    );
  }

  // Loading
  if (status === "pending") {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // No result
  if (status === "succeeded" && results.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        No results for '{keyword}'
      </div>
    );
  }

  return (
    <>
      {results.map((f, idx) => {
        return <SearchListItem key={idx} follow={f} />;
      })}
    </>
  );
}

export function SearchListItem({ follow }: { follow: Follow }) {
  return (
    <li className="flex gap-2 justify-between p-5">
      <div className="flex gap-3 w-full">
        <Avatar image={follow.avatar} className="w-10 h-10 flex-none" />

        <div className="text-sm flex-1">
          <h3 className="font-semibold block">{follow.name}</h3>
          <p className="text-muted-foreground mb-2">@{follow.username}</p>
          <p className="line-clamp-1">{follow.bio}</p>
        </div>
      </div>
      <ToggleFollowButton follow={follow} selector="search" />
    </li>
  );
}
