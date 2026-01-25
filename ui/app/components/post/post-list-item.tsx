import { MessageSquare } from "lucide-react";
import { Avatar } from "../avatar";
import type { Thread } from "~/dto/thread";
import { formatPostDuration } from "~/utils/date";
import { LikeBtn } from "./like-btn";
import { useNavigate } from "react-router";
import { ImageViewer } from "../image-viewer";
import { ReplyInputDialog } from "../reply/reply-input-dialog";

type PostListItemProps = {
  thread: Thread;
};

export function PostListItem({ thread }: PostListItemProps) {
  let navigate = useNavigate();
  const nav = () => {
    navigate(`/posts/${thread.id}`);
  };

  return (
    <li
      onClick={nav}
      className="px-5 py-7 w-full flex items-start gap-5 cursor-pointer"
    >
      <Avatar
        image={thread.user.profile_picture}
        className="w-10 h-10 flex-none"
      />
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
        <p className="text-sm whitespace-pre-wrap wrap-break-word">
          {thread.content}
        </p>
        <ImageViewer image_url={thread.image} />
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-5 text-sm"
        >
          <LikeBtn thread={thread} />
          <ReplyInputDialog thread={thread} />
          {/* <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer"
          ></button> */}
        </div>
      </div>
    </li>
  );
}
