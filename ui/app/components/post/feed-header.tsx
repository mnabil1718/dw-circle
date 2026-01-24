import { PostInput } from "./post-input";
import { PostNotification } from "./post-notification";

export function FeedHeader() {
  return (
    <div className="sticky top-0 z-10">
      <header className="pt-7 border-b bg-background/80 backdrop-blur-lg">
        <h1 className="px-7 text-2xl font-semibold mb-5">Home</h1>
        <div className="px-7 mb-7">
          <PostInput />
        </div>
      </header>
      {/* <PostNotification /> */}
    </div>
  );
}
