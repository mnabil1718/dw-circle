import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { PostListItem } from "./post-list-item";
import {
  fetchThreads,
  selectAllThreads,
  selectThreadsStatus,
} from "~/store/threads";
import { useEffect } from "react";
import { selectAuthUser } from "~/store/auth";

export function PostList() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const threads = useAppSelector(selectAllThreads);
  const threadsStatus = useAppSelector(selectThreadsStatus);

  useEffect(() => {
    if (threadsStatus === "idle" && user) {
      dispatch(fetchThreads());
    }
  }, [threadsStatus, dispatch]);

  if (threads.length < 1) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center text-muted-foreground">
        No Posts yet! Go ahead and write one
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y">
      {threads.map((t, i) => (
        <PostListItem key={i} thread={t} />
      ))}
    </ul>
  );
}
