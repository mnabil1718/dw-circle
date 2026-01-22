import type { Route } from "./+types/home";
import { authenticateMiddleware } from "~/middlewares/authenticate";
import { PostList } from "~/components/post/post-list";
import { Link, useParams } from "react-router";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SinglePost } from "~/components/post/single-post";
import {
  fetchThread,
  selectThreadById,
  selectThreadStatus,
} from "~/store/thread";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useFeed } from "~/layouts/post-layout";
import { ReplyInput } from "~/components/reply/reply-input";
import { ReplyList } from "~/components/reply/reply-list";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authenticateMiddleware,
];

export default function Post() {
  let params = useParams();
  const { feedRef } = useFeed();
  const dispatch = useAppDispatch();
  const thread = useAppSelector(selectThreadById(Number(params.id)));
  const threadStatus = useAppSelector(selectThreadStatus(Number(params.id)));

  useEffect(() => {
    if (threadStatus === "idle") {
      dispatch(fetchThread(Number(params.id)));
    }
  }, [threadStatus, dispatch, params.id]);

  useEffect(() => {
    feedRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [params.id]);

  if (!thread)
    return (
      <>
        <header className="pt-7 px-5 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Link to={"/home"}>
              <Button variant={"ghost"}>
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">Back</h1>
          </div>
        </header>
        <div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground">
          No Post Found
        </div>
      </>
    );

  return (
    <>
      <header className="pt-7 border-b">
        <div className="px-5 flex items-center gap-2 mb-3">
          <Link to={"/home"}>
            <Button variant={"ghost"}>
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Back</h1>
        </div>
        <SinglePost thread={thread} />
        <div className="border-t px-7 py-5">
          <ReplyInput placeholder="Type Your Reply!" threadId={thread.id} />
        </div>
      </header>

      <ReplyList threadId={thread.id} />
    </>
  );
}
