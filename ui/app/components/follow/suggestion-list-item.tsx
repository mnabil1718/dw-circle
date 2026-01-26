import type { Follow } from "~/dto/follow";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { ToggleFollowButton } from "./toggle-follow-btn";

export type SuggestionListItemProps = {
  follow: Follow;
};

export function SuggestionListItem({ follow }: SuggestionListItemProps) {
  return (
    <li className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-3 w-full">
        <Avatar image={follow.avatar} className="w-10 h-10 flex-none" />

        <div className="text-sm flex flex-col">
          <span className="font-semibold">{follow.name}</span>
          <span className="text-muted-foreground">@{follow.username}</span>
        </div>
      </div>
      <ToggleFollowButton follow={follow} selector="suggestions" />
    </li>
  );
}
