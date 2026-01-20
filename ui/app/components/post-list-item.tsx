import { Heart, MessageSquare } from "lucide-react";
import { Avatar } from "./avatar";
import type { Thread } from "~/dto/thread";
import { formatPostDuration } from "~/utils/date";
import { LikeBtn } from "./like-btn";

type PostListItemProps = {
  thread: Thread;
};

export function PostListItem({ thread }: PostListItemProps) {
  return (
    <li className="px-5 py-7 w-full flex items-start gap-5">
      <Avatar className="w-10 h-10" />
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
        <p className="text-sm">{thread.content}</p>
        <div className="flex items-center gap-5 text-sm">
          <LikeBtn isLiked={thread.isLiked} likes={thread.likes} />
          <button className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer">
            <MessageSquare size={20} /> {thread.reply}
          </button>
        </div>
      </div>
    </li>
  );
}
