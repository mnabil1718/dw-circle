import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/avatar";
import { SuggestionListItem } from "./suggestion-list-item";

export function SuggestionCard() {
  const suggestionList = [
    {
      name: "Mohammed Jawahir",
      username: "em.jawahir",
      isFollowed: true,
    },
    {
      name: "Shakia Kimathi",
      username: "shakiakim",
      isFollowed: false,
    },
    {
      name: "Naveen Singh",
      username: "naveeeen",
      isFollowed: false,
    },
    {
      name: "Jennifer Stewart",
      username: "jenniferste",
      isFollowed: false,
    },
    {
      name: "Zula Chizimu",
      username: "zulachi",
      isFollowed: false,
    },
  ];
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold mb-2">
          Suggested For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-5">
          {suggestionList.map((i, idx) => {
            return (
              <SuggestionListItem
                key={idx}
                name={i.name}
                username={i.username}
                isFollowed={i.isFollowed}
              />
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
