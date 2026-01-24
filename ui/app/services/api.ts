import axios from "axios";
import { redirect } from "react-router";
import { logout } from "~/store/auth";
import { store } from "~/store/store";
import { toastError } from "~/utils/toast";

export const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.user?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (err) => Promise.reject(err),
);

api.interceptors.response.use(
    (r) => r,
    (err) => {
        let msg = "Something went wrong";

        if (axios.isAxiosError(err)) {
            // auth error, logging out user
            if (err.response?.status === 401) {
                store.dispatch(logout());
                msg = "token expired. Please log in again";
            }
            // Backend error with response
            else if (err.response) {
                msg =
                    err.response.data?.message || msg;
            }
            // can be network issue
            else if (err.request) {
                msg = "Cannot reach server. Check your connection.";
            }
        }

        toastError(msg);

        // Keep AxiosError shape for caller
        return Promise.reject(err);
    }
);
