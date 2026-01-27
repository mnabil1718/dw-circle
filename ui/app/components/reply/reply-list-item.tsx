import { MessageSquare } from "lucide-react";
import { Avatar } from "../avatar";
import { formatPostDuration } from "~/utils/date";
import type { Reply } from "~/dto/reply";
import { LikeReplyBtn } from "./like-reply-btn";
import { ImageViewer } from "../image-viewer";
import { ProfileLink } from "../profile/profile-link";

type PostListItemProps = {
  reply: Reply;
};

export function ReplyListItem({ reply }: PostListItemProps) {
  return (
    <li className="px-5 py-7 w-full flex items-start gap-5">
      <Avatar
        image={reply.user.profile_picture}
        className="w-10 h-10 flex-none"
      />
      <div className="flex flex-col gap-2">
        <div className="text-sm flex items-center gap-2">
          <ProfileLink targetId={reply.user.id} username={reply.user.username}>
            <h2 className="font-medium hover:underline">{reply.user.name}</h2>
          </ProfileLink>
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
        <ImageViewer image_url={reply.image}>
          <img
            src={reply.image}
            alt={reply.image}
            className="w-full h-full object-cover"
          />
        </ImageViewer>
        <div className="flex items-center gap-5 text-sm">
          <LikeReplyBtn reply={reply} />
        </div>
      </div>
    </li>
  );
}
