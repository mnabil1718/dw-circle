import type { APIResponse } from "~/dto/api";
import type {
  AddLikeDTO,
  AddReplyLikeDTO,
  ToggleLikeResponse,
  ToggleReplyLikeResponse,
} from "~/dto/like";
import { api } from "./api";

export const postLikeThread = async (
  values: AddLikeDTO,
): Promise<ToggleLikeResponse> => {
  const res = await api.post<APIResponse<ToggleLikeResponse>>("/likes", values);
  return res.data.data!;
};

export const postLikeReply = async (
  values: AddReplyLikeDTO,
): Promise<ToggleReplyLikeResponse> => {
  const res = await api.post<APIResponse<ToggleReplyLikeResponse>>(
    "/likes/replies",
    values,
  );
  return res.data.data!;
};
