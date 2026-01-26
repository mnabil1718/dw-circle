import type { Follow } from "~/dto/follow";
import { Button } from "../ui/button";
import { useAppDispatch } from "~/store/hooks";
import { unfollow, follow as following } from "~/store/follow";

export function FollowButton({ follow }: { follow: Follow }) {
  const dispatch = useAppDispatch();

  const toggleFollowHandler = () => {
    if (follow.is_followed) {
      dispatch(unfollow(follow.id));
    } else {
      dispatch(following(follow.id));
    }
  };

  return (
    <Button
      variant="outline"
      className="rounded-full cursor-pointer"
      onClick={toggleFollowHandler}
    >
      {follow.is_followed ? "Following" : "Follow"}
    </Button>
  );
}
