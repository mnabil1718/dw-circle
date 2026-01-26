import { LoginForm } from "~/components/auth/login-form";
import type { Route } from "./+types/login";
import { guestMiddleware } from "../middlewares/guest";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  guestMiddleware,
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Circle App - Login to Your Account" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  return (
    <div className="h-screen flex flex-col bg-background justify-center">
      <LoginForm />
    </div>
  );
}
