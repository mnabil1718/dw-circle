import type { Follow } from "~/dto/follow";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  unfollow,
  follow as following,
  selectSingleSuggestion,
  selectSingleFollowing,
  selectSingleFollower,
} from "~/store/follow";

export function ToggleFollowButton({
  follow,
  selector,
}: {
  follow: Follow;
  selector: "suggestions" | "following" | "followers";
}) {
  const dispatch = useAppDispatch();

  const flw = useAppSelector((state) => {
    switch (selector) {
      case "suggestions":
        return selectSingleSuggestion(follow.id)(state);
      case "following":
        return selectSingleFollowing(follow.id)(state);
      case "followers":
        return selectSingleFollower(follow.id)(state);
      default:
        return undefined;
    }
  });

  const toggleFollowHandler = () => {
    if (flw?.is_followed) {
      dispatch(unfollow(flw?.id));
    } else {
      dispatch(following(flw?.id ?? -1));
    }
  };

  return (
    <Button
      variant="outline"
      className="rounded-full"
      onClick={toggleFollowHandler}
    >
      {flw?.is_followed ? "Following" : "Follow"}
    </Button>
  );
}
