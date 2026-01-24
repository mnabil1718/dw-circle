import { api } from "./api";
import type { APIResponse } from "~/dto/api";
import type { UpdateProfileDTO, UserProfile } from "~/dto/profile";

export const putUserProfile = async (
  values: UpdateProfileDTO,
): Promise<UserProfile> => {

  const fd = new FormData();
  fd.append("name", values.name);
  fd.append("username", values.username);
  if (values.bio) fd.append("bio", values.bio);
  if (values.image) fd.append("image", values.image);

  const res = await api.put<APIResponse<UserProfile>>(
    `/users/${values.userId}/profile`, 
    fd, 
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data.data!;
};


export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const res = await api.get<APIResponse<UserProfile>>(
    `/users/${userId}/profile`,
  );
  return res.data.data!;
};