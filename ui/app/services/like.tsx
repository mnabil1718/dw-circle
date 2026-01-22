import type { APIResponse } from "~/dto/api";
import type { AddLikeDTO, ToggleLikeResponse } from "~/dto/like";
import { api } from "./api";

export const postLikeThread = async (
  values: AddLikeDTO,
): Promise<ToggleLikeResponse> => {
  const res = await api.post<APIResponse<ToggleLikeResponse>>("/likes", values);
  return res.data.data!;
};
