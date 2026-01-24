import { api } from "./api";
import type { APIResponse } from "~/dto/api";
import type { UpdateProfileDTO, UserProfile } from "~/dto/profile";

export const putUserProfile = async (
  values: UpdateProfileDTO,
): Promise<UserProfile> => {
  const res = await api.put<APIResponse<UserProfile>>(`/users/${values.userId}/profile`, values);
  return res.data.data!;
};

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const res = await api.get<APIResponse<UserProfile>>(
    `/users/${userId}/profile`,
  );
  return res.data.data!;
};