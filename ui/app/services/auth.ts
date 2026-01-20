import type { LoginDTO, RegisterDTO, UserLoginResponse } from "~/dto/auth";
import { api } from "./api";
import type { APIResponse } from "~/dto/api";

export const userRegister = (values: RegisterDTO) => api.post("/auth/register", values);


export const userLogin = async (values: LoginDTO): Promise<UserLoginResponse> => {
    const res = await api.post<APIResponse<UserLoginResponse>>("/auth/login", values);
    return res.data.data!;
};
