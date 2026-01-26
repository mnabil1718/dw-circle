export type Follow = {
  id: number;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  is_followed: boolean;
};

export type GetFollowsDTO = {
  type: "following" | "followers";
};

export type ToggleUser = {
  id: number;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  following: number;
  followers: number;
};

export type ToggleFollowResponse = {
  following_id: number;
  follower_id: number;
  follower: ToggleUser;
  following: ToggleUser;
};

// ==========  SOCKET RESPONSE ===========

export type FollowToggledSocketType = "follow" | "unfollow";

export type FollowToggledSocketPayload = {
  type: FollowToggledSocketType;
  result: ToggleFollowResponse;
};
