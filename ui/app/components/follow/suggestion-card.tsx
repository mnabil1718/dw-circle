import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SuggestionListItem } from "./suggestion-list-item";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";
import {
  fetchFollowSuggestions,
  selectFollowsSuggestionStatus,
  selectFollowSuggestions,
} from "~/store/follow";
import { useEffect } from "react";

export function SuggestionCard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const suggestions = useAppSelector(selectFollowSuggestions);
  const status = useAppSelector(selectFollowsSuggestionStatus);

  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchFollowSuggestions());
    }
  }, [dispatch, user]);

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold mb-2">
          Suggested For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-5">
          {suggestions.map((i, idx) => {
            return <SuggestionListItem key={idx} follow={i} />;
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
