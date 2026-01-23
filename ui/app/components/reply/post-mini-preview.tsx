import type { Thread } from "~/dto/thread";
import { Avatar } from "../avatar";
import { formatPostDuration } from "~/utils/date";

export function PostMiniPreview({ thread }: { thread: Thread }) {
  return (
    <div className="relative flex items-start gap-4">
      <div className="absolute h-full w-5 border-r-2"></div>
      <Avatar className="w-10 h-10 flex-none" />
      <div className="flex flex-col gap-2">
        <div className="text-sm flex items-center gap-2">
          <h2 className="font-medium">{thread.user.name}</h2>
          <span className="text-sm text-muted-foreground">
            @{thread.user.username}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
          <span className="text-muted-foreground">
            {formatPostDuration(thread.created_at)}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap wrap-break-word line-clamp-1">
          {thread.content}
        </p>

        <div className="text-sm text-muted-foreground pb-4">
          Replying{" "}
          <span className="text-cyan-400">@{thread.user.username}</span>
        </div>
      </div>
    </div>
  );
}
