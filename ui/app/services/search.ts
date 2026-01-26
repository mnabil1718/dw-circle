import type { APIResponse } from "~/dto/api";
import type { Follow } from "~/dto/follow";
import { api } from "./api";

export const getUserSearch = async (keyword: string): Promise<Follow[]> => {
    const res = await api.get<APIResponse<Follow[]>>(`/search?keyword=${keyword}`);
    return res.data.data!;
};