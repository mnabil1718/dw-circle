import type { APIResponse } from "~/dto/api";
import type { AddLikeDTO } from "~/dto/like";
import { api } from "./api";

export const postLikeThread = async (values: AddLikeDTO): Promise<string> => {
  const res = await api.post<APIResponse<void>>("/likes", values);
  return res.data.message;
};
