import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import type { AddLikeDTO } from "~/dto/like";
import type { Thread } from "~/dto/thread";
import { selectAuthUser } from "~/store/auth";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { createLikeThread, deleteLikeThread } from "~/store/thread";
import { selectAllThreads, selectThreadsById } from "~/store/threads";

export function LikeBtn({ thread }: { thread: Thread }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const thr = useAppSelector(selectThreadsById(thread.id));

  const likeHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const payload: AddLikeDTO = {
      user_id: user?.user_id ?? -1,
      tweet_id: thread.id,
    };

    if (thr?.isLiked) {
      dispatch(deleteLikeThread(payload));
    } else {
      dispatch(createLikeThread(payload));
    }
  };

  return (
    <button
      onClick={likeHandler}
      className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer disabled:hover:opacity-70"
    >
      {thr?.isLiked ? <Heart size={20} fill="white" /> : <Heart size={20} />}{" "}
      {thread.likes}
    </button>
  );
}
