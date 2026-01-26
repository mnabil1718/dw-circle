import type { Follow, GetFollowsDTO, ToggleFollowResponse } from "~/dto/follow";
import { api } from "./api";
import type { APIResponse } from "~/dto/api";

export const getUserFollows = async (values: GetFollowsDTO): Promise<Follow[]> => {
    const res = await api.get<APIResponse<Follow[]>>(`/follows?type=${values.type}`);
    return res.data.data!;
};

export const getUserFollowSuggestions = async (): Promise<Follow[]> => {
    const res = await api.get<APIResponse<Follow[]>>('/follows/suggestions');
    return res.data.data!;
};

export const postToggleUsersFollows = async (following_id: number): Promise<ToggleFollowResponse> => {
    const res = await api.post<APIResponse<ToggleFollowResponse>>('/follows', { following_id });
    return res.data.data!;
}