/**
 * REASON: cannot redirect and show toast via axios interceptors
 *
 * on public routes this will still works because the backend
 * never sends 401 on unprotected routes. navigation also happens
 * client side.
 *
 * use this wrapped around root router/layout
 */

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";

export function AuthWatcher({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectAuthUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return <>{children}</>;
}
