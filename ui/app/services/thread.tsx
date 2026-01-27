import type {
  CreateThreadDTO,
  CreateThreadResponse,
  Thread,
} from "~/dto/thread";
import { api } from "./api";
import type { APIResponse } from "~/dto/api";

export const getThreads = async (
  limit = 100,
  userId?: number,
): Promise<Thread[]> => {
  const res = await api.get<APIResponse<{ threads: Thread[] }>>(
    `/threads?limit=${limit}${userId ? `&userId=${userId}` : ""}`,
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

export const getThreadsByUserId = async (
  limit = 100,
  mine = false,
): Promise<Thread[]> => {
  const res = await api.get<APIResponse<{ threads: Thread[] }>>(
    `/threads?limit=${limit}${mine ? "&mine" : ""}`,
  );
  return res.data.data!.threads;
};
