import type { LoginDTO, RegisterDTO } from "~/dto/auth";
import { api } from "./api";

export const userRegister = (values: RegisterDTO) => api.post("/auth/register", values);

export const userLogin = (values: LoginDTO) => api.post("/auth/login", values);
