import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useEffect } from "react";
import {
  fetchReplies,
  selectAllReplies,
  selectRepliesStatus,
} from "~/store/reply";
import { ReplyListItem } from "./reply-list-item";

export function ReplyList({ threadId }: { threadId: number }) {
  const dispatch = useAppDispatch();
  const replies = useAppSelector(selectAllReplies);
  const repliesStatus = useAppSelector(selectRepliesStatus);

  useEffect(() => {
    if (repliesStatus === "idle") {
      dispatch(fetchReplies(threadId));
    }
  }, [repliesStatus, dispatch]);

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
