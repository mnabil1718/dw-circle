import { useAppSelector } from "~/store/hooks";
import { PostListItem } from "./post-list-item";

export function PostList() {
  const threads = useAppSelector((state) => state.thread.threads);
  return (
    <ul className="flex-1 flex flex-col overflow-y-auto divide-y">
      {threads.map((t, i) => (
        <PostListItem key={i} thread={t} />
      ))}
    </ul>
  );
}
