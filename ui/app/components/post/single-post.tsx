import type { Thread } from "~/dto/thread";
import { Avatar } from "../avatar";
import { MessageSquare } from "lucide-react";
import { formatDate, formatTime } from "~/utils/date";
import { ImageViewer } from "../image-viewer";
import { SingleLikeBtn } from "./single-like-btn";
import { ProfileLink } from "../profile/profile-link";

type SinglePostProps = {
  thread: Thread;
};

export function SinglePost({ thread }: SinglePostProps) {
  return (
    <div className="py-7 px-7 w-full flex items-start gap-5">
      <div className="flex flex-col gap-5">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <Avatar
            image={thread.user.profile_picture}
            className="w-10 h-10 flex-none"
          />
          <div className="text-sm gap-2">
            <ProfileLink
              targetId={thread.user.id}
              username={thread.user.username}
            >
              <h2 className="font-medium hover:underline">
                {thread.user.name}
              </h2>
            </ProfileLink>
            <span className="text-sm text-muted-foreground">
              @{thread.user.username}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <p className="whitespace-pre-wrap wrap-break-word">
            {thread.content}
          </p>
          <ImageViewer image_url={thread.image}>
            <img
              src={thread.image}
              alt={thread.image}
              className="w-full h-full object-cover"
            />
          </ImageViewer>
        </div>

        {/* Time */}
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <span>{formatTime(thread.created_at)}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
          <span>{formatDate(thread.created_at)}</span>
        </span>

        {/* Stats */}
        <div className="flex items-center gap-8 text-sm">
          <SingleLikeBtn thread={thread} />
          <button className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer">
            <MessageSquare size={20} /> {thread.replies} Replies
          </button>
        </div>
      </div>
    </div>
  );
}
