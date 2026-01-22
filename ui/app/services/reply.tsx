import type { APIResponse } from "~/dto/api";
import type { CreateReplyActionPayload, Reply } from "~/dto/reply";
import { api } from "./api";

export const postReply = async (
  data: CreateReplyActionPayload,
): Promise<Reply> => {
  const fd = new FormData();
  fd.append("content", data.req.content);
  if (data.req.image) fd.append("image", data.req.image);

  const res = await api.post<APIResponse<{ reply: Reply }>>(
    `/threads/${data.threadId}/replies`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data.data!.reply;
};

export const getReplies = async (
  threadId: number,
  limit = 100,
): Promise<Reply[]> => {
  const res = await api.get<APIResponse<{ replies: Reply[] }>>(
    `/threads/${threadId}/replies?limit=${limit}`,
  );
  return res.data.data!.replies;
};
