import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/avatar";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";
import {
  fetchProfile,
  selectProfile,
  selectProfileStatus,
} from "~/store/profile";
import { useEffect } from "react";
import { EditProfileDialog } from "./edit-profile-dialog";
import { CoverImage } from "../cover-image";

export function ProfileCard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectProfile);
  const status = useAppSelector(selectProfileStatus);

  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchProfile(user.user_id));
    }
  }, [status, dispatch, user]);

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="mb-2">My Profile</CardTitle>
        <CoverImage />
        <div className="flex items-center justify-between mb-3">
          <Avatar
            image={profile?.avatar}
            alt={profile?.name}
            className="w-20 h-20 -mt-10 ml-2 border-4 border-card"
          />
          <EditProfileDialog />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold line-clamp-1">
            {profile?.name ?? "No name"}
          </h2>
          <span className="text-sm text-muted-foreground">
            @{profile?.username ?? "noname"}
          </span>
          <p className="text-sm line-clamp-2">{profile?.bio ?? ""}</p>
          <ul className="flex items-center text-sm gap-3">
            <li>
              <span className="font-bold">{profile?.following ?? 0}</span>{" "}
              <span className="text-muted-foreground">following</span>
            </li>
            <li>
              <span className="font-bold">{profile?.followers ?? 0}</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </li>
          </ul>
        </div>
      </CardHeader>
    </Card>
  );
}
