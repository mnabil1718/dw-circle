import type {
  CreateThreadDTO,
  CreateThreadResponse,
  Thread,
} from "~/dto/thread";
import { api } from "./api";
import type { APIResponse } from "~/dto/api";

// TODO: add token later
export const getThreads = async (): Promise<Thread[]> => {
  const res = await api.get<APIResponse<{ threads: Thread[] }>>("/threads");
  return res.data.data!.threads;
};

export const postThreads = async (
  req: CreateThreadDTO,
): Promise<CreateThreadResponse> => {
  const fd = new FormData();
  fd.append("content", req.content);
  if (req.image) fd.append("image", req.image);

  const res = await api.post<APIResponse<{ tweet: CreateThreadResponse }>>(
    "/threads",
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  console.log(res.data);
  return res.data.data!.tweet;
};
