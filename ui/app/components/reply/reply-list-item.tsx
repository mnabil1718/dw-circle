import { MessageSquare } from "lucide-react";
import { Avatar } from "../avatar";
import { formatPostDuration } from "~/utils/date";
import type { Reply } from "~/dto/reply";
import { LikeReplyBtn } from "./like-reply-btn";
import { ImageViewer } from "../image-viewer";

type PostListItemProps = {
  reply: Reply;
};

export function ReplyListItem({ reply }: PostListItemProps) {
  return (
    <li className="px-5 py-7 w-full flex items-start gap-5">
      <Avatar className="w-10 h-10 flex-none" />
      <div className="flex flex-col gap-2">
        <div className="text-sm flex items-center gap-2">
          <h2 className="font-medium">{reply.user.name}</h2>
          <span className="text-sm text-muted-foreground">
            @{reply.user.username}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
          <span className="text-muted-foreground">
            {formatPostDuration(reply.created_at)}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap wrap-break-word">
          {reply.content}
        </p>
        <ImageViewer image_url={reply.image} />
        <div className="flex items-center gap-5 text-sm">
          {/* <LikeReplyBtn reply={reply} /> */}
        </div>
      </div>
    </li>
  );
}
