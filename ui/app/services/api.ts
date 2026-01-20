import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

api.interceptors.response.use(
    (r) => r,
    (err) => {
        let msg = "Something went wrong";

        if (axios.isAxiosError(err)) {
            // Backend error with response
            if (err.response) {

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
