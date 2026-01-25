import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import type { AddReplyLikeDTO } from "~/dto/like";
import type { Thread } from "~/dto/thread";
import { selectAuthUser } from "~/store/auth";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  createLikeReply,
  deleteLikeReply,
  selectRepliesById,
} from "~/store/reply";

export function LikeReplyBtn({ reply }: { reply: Thread }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const rpl = useAppSelector(selectRepliesById(reply.id));

  const likeHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const payload: AddReplyLikeDTO = {
      user_id: user?.user_id ?? -1,
      reply_id: reply.id,
    };

    if (rpl?.isLiked) {
      dispatch(deleteLikeReply(payload));
    } else {
      dispatch(createLikeReply(payload));
    }
  };

  return (
    <button
      onClick={likeHandler}
      className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer disabled:hover:opacity-70"
    >
      {rpl?.isLiked ? <Heart size={20} fill="white" /> : <Heart size={20} />}{" "}
      {rpl?.likes}
    </button>
  );
}
