import { useEffect } from "react";
import { selectAuthUser } from "~/store/auth";
import {
  fetchFollowers,
  fetchFollowing,
  selectFollowing,
  selectFollowsFollowingStatus,
} from "~/store/follow";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Button } from "../ui/button";
import { Avatar } from "../avatar";
import { ToggleFollowButton } from "./toggle-follow-btn";

export function FollowingList() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectFollowsFollowingStatus);
  const following = useAppSelector(selectFollowing);

  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchFollowing());
    }
  }, [dispatch, user, status]);

  if (following.length < 1) {
    return (
      <div className="flex flex-col w-full flex-1 justify-center items-center">
        <span className="text-muted-foreground">You follow no one</span>
      </div>
    );
  }

  return (
    <>
      {following.map((f, idx) => {
        return (
          <li key={idx} className="flex gap-2 justify-between p-5">
            <div className="flex gap-3 w-full">
              <Avatar image={f.avatar} className="w-10 h-10 flex-none" />

              <div className="text-sm flex-1">
                <h3 className="font-semibold block">{f.name}</h3>
                <p className="text-muted-foreground mb-2">@{f.username}</p>
                <p className="line-clamp-1">{f.bio}</p>
              </div>
            </div>
            <ToggleFollowButton follow={f} selector="following" />
          </li>
        );
      })}
    </>
  );
}
