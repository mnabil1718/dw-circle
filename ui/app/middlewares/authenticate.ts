import { store } from "~/store/store";
import { redirect } from "react-router";

export async function authenticateMiddleware({ context }: { context: any }, next: any) {
    const state = store.getState();
    const user = state.auth.user;

    if (!user) {
        throw redirect("/login");
    }

    await next();
}
