import { store } from "~/store/store";
import { redirect } from "react-router";
import { toastError } from "~/utils/toast";

export async function authenticateMiddleware({ context }: { context: any }, next: any) {
    const state = store.getState();
    const user = state.auth.user;

    if (!user) {
        toastError("You have to log in first");
        throw redirect("/login");
    }

    await next();
}
