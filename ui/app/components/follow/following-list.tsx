import { useEffect } from "react";
import { selectAuthUser } from "~/store/auth";
import {
  fetchFollowing,
  selectFollowing,
  selectFollowsFollowingStatus,
} from "~/store/follow";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Avatar } from "../avatar";
import { ToggleFollowButton } from "./toggle-follow-btn";
import type { Follow } from "~/dto/follow";
import { ProfileLink } from "../profile/profile-link";

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
        return <FollowingListItem key={idx} follow={f} />;
      })}
    </>
  );
}

export function FollowingListItem({ follow }: { follow: Follow }) {
  return (
    <li className="flex gap-2 justify-between p-5">
      <div className="flex gap-3 w-full">
        <Avatar image={follow.avatar} className="w-10 h-10 flex-none" />

        <div className="text-sm flex-1">
          <ProfileLink targetId={follow.id} username={follow.username}>
            <h3 className="font-semibold block hover:underline">
              {follow.name}
            </h3>
          </ProfileLink>
          <p className="text-muted-foreground mb-2">@{follow.username}</p>
          <p className="line-clamp-1">{follow.bio}</p>
        </div>
      </div>
      <ToggleFollowButton follow={follow} selector="following" />
    </li>
  );
}
