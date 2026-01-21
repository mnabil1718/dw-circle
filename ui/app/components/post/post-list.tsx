import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { PostListItem } from "./post-list-item";
import {
  fetchThreads,
  selectAllThreads,
  selectThreadsStatus,
  threadCreated,
} from "~/store/thread";
import { useEffect } from "react";
import { socket } from "~/lib/socket";
import { THREAD_CREATED_EVENT } from "~/constants/events";
import type { Thread } from "~/dto/thread";

export function PostList() {
  const dispatch = useAppDispatch();
  const threads = useAppSelector(selectAllThreads);
  const threadsStatus = useAppSelector(selectThreadsStatus);

  useEffect(() => {
    if (threadsStatus === "idle") {
      dispatch(fetchThreads());
    }
  }, [threadsStatus, dispatch]);

  useEffect(() => {
    const refetch = ({ tweet }: { tweet: Thread }) => {
      dispatch(threadCreated(tweet));
    };

    socket.on(THREAD_CREATED_EVENT, refetch);

    return () => {
      socket.off(THREAD_CREATED_EVENT, refetch);
    };
  }, [dispatch]);

  return (
    <ul className="flex-1 flex flex-col overflow-y-auto scrollbar-minimal divide-y">
      {threads.map((t, i) => (
        <PostListItem key={i} thread={t} />
      ))}
    </ul>
  );
}
