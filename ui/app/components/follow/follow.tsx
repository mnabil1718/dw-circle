import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";
import { fetchFollowers, fetchFollowing } from "~/store/follow";
import { FollowerList } from "./follower-list";
import { FollowingList } from "./following-list";

export function FollowTabs() {
  return (
    <Tabs defaultValue="followers" className="flex flex-col flex-1">
      <div className="sticky top-0 z-10">
        <header className="pt-7 border-b bg-background/80 backdrop-blur-lg">
          <h1 className="px-7 text-2xl font-semibold mb-5">Follows</h1>
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="followers" className="cursor-pointer">
              Followers
            </TabsTrigger>
            <TabsTrigger value="following" className="cursor-pointer">
              Following
            </TabsTrigger>
          </TabsList>
        </header>

        {/* <PostNotification /> */}
      </div>
      <TabsContent value="followers" className="flex flex-col flex-1 divide-y">
        <FollowerList />
      </TabsContent>
      <TabsContent value="following" className="flex flex-col flex-1 divide-y">
        <FollowingList />
      </TabsContent>
    </Tabs>
  );
}
