import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAppSelector } from "~/store/hooks";
import { selectProfile } from "~/store/profile";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { CoverImage } from "../cover-image";
import { Avatar } from "../avatar";
import { EditProfileDialog } from "./edit-profile-dialog";
import { selectMyThreads } from "~/store/threads";
import { selectAuthUser } from "~/store/auth";
import { MyPostList } from "../post/my-post-list";
import { ImagesFeed } from "./images-feed";

export function ProfileTabs() {
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectProfile);

  if (!profile) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center text-muted-foreground">
        No profile found
      </div>
    );
  }
  return (
    <Tabs defaultValue="posts" className="flex flex-col flex-1">
      <div className="">
        <header className="pt-7 border-b bg-background/80 backdrop-blur-lg">
          <div className="sticky top-0 z-10 flex items-center gap-2 mb-3 px-2 bg-background/70 backdrop-blur-lg py-3">
            <Link to={"/home"}>
              <Button variant={"ghost"}>
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold line-clamp-1">
              {profile.name}
            </h1>
          </div>
          <div className="px-5 mb-10">
            <CoverImage />
            <div className="flex items-center justify-between mb-3">
              <Avatar
                image={profile?.avatar}
                alt={profile?.name}
                className="w-20 h-20 -mt-10 ml-2 bg-card border-4 border-card"
              />
              <div className="mt-2">
                <EditProfileDialog />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold line-clamp-1">
                {profile?.name ?? "No name"}
              </h2>
              <span className="text-sm text-muted-foreground">
                @{profile?.username ?? "noname"}
              </span>
              <p className="text-sm line-clamp-2">{profile?.bio ?? ""}</p>
              <ul className="flex items-center text-sm gap-3">
                <li>
                  <span className="font-bold">{profile?.following ?? 0}</span>{" "}
                  <span className="text-muted-foreground">following</span>
                </li>
                <li>
                  <span className="font-bold">{profile?.followers ?? 0}</span>{" "}
                  <span className="text-muted-foreground">followers</span>
                </li>
              </ul>
            </div>
          </div>
          <TabsList variant="line" className="w-full sticky top-0">
            <TabsTrigger value="posts" className="cursor-pointer">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="cursor-pointer">
              Media
            </TabsTrigger>
          </TabsList>
        </header>

        {/* <PostNotification /> */}
      </div>
      <TabsContent value="posts" className="flex flex-col flex-1 divide-y">
        <MyPostList />
      </TabsContent>
      <TabsContent value="media" className="flex flex-col flex-1 divide-y">
        <ImagesFeed />
      </TabsContent>
    </Tabs>
  );
}
