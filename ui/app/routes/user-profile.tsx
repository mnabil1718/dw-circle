import { authenticateMiddleware } from "~/middlewares/authenticate";
import type { Route } from "./+types/user-profile";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";
import { fetchUserProfile, selectUserProfile } from "~/store/profile";
import { ProfileTabs } from "~/components/profile/profile-tabs";
import { fetchActiveFollow } from "~/store/follow";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authenticateMiddleware,
];

export default function UserProfile() {
  let params = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const userProfile = useAppSelector(selectUserProfile);

  useEffect(() => {
    if (user && params.username) {
      dispatch(fetchUserProfile(params.username));
    }
  }, [dispatch, user, params.username]);

  useEffect(() => {
    if (user && userProfile) {
      dispatch(fetchActiveFollow(userProfile.username));
    }
  }, [dispatch, user, userProfile]);

  return <ProfileTabs type="other" />;
}
