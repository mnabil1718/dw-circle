import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch } from "~/store/hooks";
import { logout } from "~/store/auth";
import { useNavigate } from "react-router";

export function Logout() {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <Button
      onClick={logoutHandler}
      variant={"ghost"}
      className="text-lg justify-start py-6 rounded-full"
    >
      <LogOut className="transform scale-x-[-1]" /> Logout
    </Button>
  );
}
