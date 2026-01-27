import { Link } from "react-router";
import { selectAuthUser } from "~/store/auth";
import { useAppSelector } from "~/store/hooks";
import type { MouseEvent } from "react";

export function ProfileLink({
  targetId,
  username,
  children,
}: {
  targetId: number;
  username: string;
  children: React.ReactNode;
}) {
  const user = useAppSelector(selectAuthUser);

  const url = user?.user_id === targetId ? "/profile" : `/${username}`;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link to={url} onClick={handleClick}>
      {children}
    </Link>
  );
}
