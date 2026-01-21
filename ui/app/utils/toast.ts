import { toast } from "sonner";

export type ToastPosition = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";

export function toastError(msg: string, dir: ToastPosition = "top-center") {
    toast.error(msg, {
            position: dir,
            style: {
                backgroundColor: "oklch(45.5% 0.188 13.697)"
            }
        });
}