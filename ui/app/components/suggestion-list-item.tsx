import { Avatar } from "./avatar";
import { Button } from "./ui/button";

export type SuggestionListItemProps = {
  name: string;
  username: string;
  isFollowed: boolean;
};

export function SuggestionListItem({
  name,
  username,
  isFollowed,
}: SuggestionListItemProps) {
  return (
    <li className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-3 w-full">
        <Avatar className="w-10 h-10 flex-none" />

        <div className="text-sm flex flex-col">
          <span className="font-semibold">{name}</span>
          <span className="text-muted-foreground">@{username}</span>
        </div>
      </div>
      <Button variant="outline" className="rounded-full" disabled={isFollowed}>
        {isFollowed ? "Following" : "Follow"}
      </Button>
    </li>
  );
}
