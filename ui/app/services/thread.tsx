import type { Thread } from "~/dto/thread";
import { api } from "./api";
import type { APIResponse } from "~/dto/api";

// TODO: add token later
export const getThreads = async (): Promise<Thread[]> => {
  const res = await api.get<APIResponse<{ threads: Thread[] }>>("/threads");
  return res.data.data!.threads;
};
