import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { authenticateMiddleware } from "~/middlewares/authenticate";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [authenticateMiddleware];

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    return <div className="bg-background h-screen">
        <Welcome />
    </div>;
}
