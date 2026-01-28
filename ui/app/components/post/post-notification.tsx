import { ArrowUp } from "lucide-react";
import { useScrolled } from "~/hooks/use-scrolled";
import { useEffect, useRef, useState } from "react";
import { selectAllThreads } from "~/store/threads";
import { useAppSelector } from "~/store/hooks";
import { useFeed } from "~/layouts/post-layout";

export function PostNotification() {
  const { feedRef } = useFeed();
  const scrolled = useScrolled(feedRef);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const threads = useAppSelector(selectAllThreads);
  const prev = useRef<number>(threads.length);

  console.log("POST NOTIF MOUNTED");

  useEffect(() => {
    if (threads.length > prev.current) {
      console.log("NAMBAH");
      setShowNotification(true);
    }

    prev.current = threads.length;
  }, [threads.length, scrolled]);

  const scrollTop = () => {
    const feed = feedRef.current;
    if (!feed) return;

    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setShowNotification(false);
  };

  return (
    <>
      {showNotification && (
        <div className="w-full flex justify-center mt-4">
          <button
            type="button"
            onClick={scrollTop}
            className="w-fit bg-popover/50 backdrop-blur-lg px-4 py-2 rounded-full border text-sm flex items-center gap-2 cursor-pointer"
          >
            New post available <ArrowUp className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
