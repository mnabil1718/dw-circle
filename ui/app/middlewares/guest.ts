import { store } from "~/store/store";
import { redirect } from "react-router";
import { toastError } from "~/utils/toast";

export async function guestMiddleware({ context }: { context: any }, next: any) {
    const state = store.getState();
    const user = state.auth.user;

    if (user) {
        toastError("You're already logged in");
        throw redirect("/home");
    }

    await next();
}
