import type { LoginDTO, RegisterDTO, UserLoginResponse } from "~/dto/auth";
import { api } from "./api";

export const userRegister = (values: RegisterDTO) => api.post("/auth/register", values);


export const userLogin = async (values: LoginDTO): Promise<UserLoginResponse> => {
    const res = await api.post("/auth/login", values);
    return res.data.data;
};
