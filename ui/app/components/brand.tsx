import { NavLink } from "react-router";

export function Brand() {
  return (
    <NavLink to="/home">
      <img src="/brand.png" className="object-contain w-full" />
    </NavLink>
  );
}
