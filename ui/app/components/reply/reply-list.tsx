import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useEffect } from "react";
import {
  fetchReplies,
  selectAllReplies,
  selectRepliesStatus,
} from "~/store/reply";
import { ReplyListItem } from "./reply-list-item";
import { selectAuthUser } from "~/store/auth";

export function ReplyList({ threadId }: { threadId: number }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const replies = useAppSelector(selectAllReplies);
  const status = useAppSelector(selectRepliesStatus);

  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchReplies(threadId));
    }
  }, [dispatch, threadId]);

  if (replies.length < 1) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center text-muted-foreground">
        No Replies yet! Go ahead and write one
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y">
      {replies.map((r, i) => (
        <ReplyListItem key={i} reply={r} />
      ))}
    </ul>
  );
}
