import { RegisterForm } from "~/components/auth/register-form";
import { guestMiddleware } from "~/middlewares/guest";
import type { Route } from "./+types/register";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  guestMiddleware,
];

export default function Register() {
  return (
    <div className="h-screen flex flex-col bg-background justify-center">
      <RegisterForm />
    </div>
  );
}
