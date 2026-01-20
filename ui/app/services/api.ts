import axios from "axios";
import { toast } from "sonner";
import { logout } from "~/store/auth";
import { store } from "~/store/store";

export const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

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

        toast.error(msg);

        // Keep AxiosError shape for caller
        return Promise.reject(err);
    }
);
