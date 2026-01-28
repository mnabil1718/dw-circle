/**
 * REASON: cannot redirect and show toast via axios interceptors. navigation also happens
 * client side. Use this in conjunction with AuthtehnticateMiddleware to prevent flashing.
 * Also use this wrapped around root router/layout.
 */

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";
import { toastError } from "~/utils/toast";

const publicRoutes: string[] = ["/login", "/register"];

export function AuthWatcher({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectAuthUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && !publicRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return <>{children}</>;
}
