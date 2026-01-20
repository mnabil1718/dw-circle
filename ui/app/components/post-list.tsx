import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { PostListItem } from "./post-list-item";
import {
  fetchThreads,
  selectAllThreads,
  selectThreadsStatus,
} from "~/store/thread";
import { useEffect } from "react";

export function PostList() {
  const dispatch = useAppDispatch();
  const threads = useAppSelector(selectAllThreads);
  const threadsStatus = useAppSelector(selectThreadsStatus);

  useEffect(() => {
    if (threadsStatus === "idle") {
      dispatch(fetchThreads());
    }
  }, [threadsStatus, dispatch]);

  return (
    <ul className="flex-1 flex flex-col overflow-y-auto divide-y">
      {threads.map((t, i) => (
        <PostListItem key={i} thread={t} />
      ))}
    </ul>
  );
}
