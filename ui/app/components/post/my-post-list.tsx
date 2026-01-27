import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { PostListItem } from "./post-list-item";
import { fetchMyThreads, selectMyThreads } from "~/store/threads";
import { selectProfileOnType } from "~/store/profile";
import { useEffect } from "react";

export function MyPostList({ type }: { type: "own" | "other" }) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileOnType(type));
  const threads = useAppSelector(selectMyThreads);

  useEffect(() => {
    if (profile) {
      dispatch(fetchMyThreads(profile.id));
    }
  }, [dispatch, profile]);

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
