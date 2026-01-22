import type {
  CreateThreadDTO,
  CreateThreadResponse,
  Thread,
} from "~/dto/thread";
import { api } from "./api";
import type { APIResponse } from "~/dto/api";

export const getThreads = async (limit = 100): Promise<Thread[]> => {
  const res = await api.get<APIResponse<{ threads: Thread[] }>>(
    `/threads?limit=${limit}`,
  );
  return res.data.data!.threads;
};

export const getThreadById = async (id: number): Promise<Thread> => {
  const res = await api.get<APIResponse<{ thread: Thread }>>(`/threads/${id}`);
  return res.data.data!.thread;
};

export const postThreads = async (req: CreateThreadDTO): Promise<Thread> => {
  const fd = new FormData();
  fd.append("content", req.content);
  if (req.image) fd.append("image", req.image);

  const res = await api.post<APIResponse<{ tweet: Thread }>>("/threads", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data!.tweet;
};
