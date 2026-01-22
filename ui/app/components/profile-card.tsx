import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/avatar";
import { useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";

export function ProfileCard() {
  const user = useAppSelector(selectAuthUser);

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="mb-2">My Profile</CardTitle>
        <img
          src="/grad.webp"
          className="bg-slate-600 aspect-[3.2/1] w-full rounded-md overflow-hidden object-cover mb-1"
        />
        <div className="flex items-center justify-between mb-3">
          <Avatar className="w-20 h-20 -mt-10 ml-2 border-4 border-card" />
          <Button variant={"outline"} className="rounded-full">
            Edit Profile
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{user?.name ?? "No name"}</h2>
          <span className="text-sm text-muted-foreground">
            @{user!.username}
          </span>
          <p className="text-sm">Picked over the worms, and weird fishes</p>
          <ul className="flex items-center text-sm gap-3">
            <li>
              <span className="font-bold">291</span>{" "}
              <span className="text-muted-foreground">following</span>
            </li>
            <li>
              <span className="font-bold">32</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </li>
          </ul>
        </div>
      </CardHeader>
    </Card>
  );
}
