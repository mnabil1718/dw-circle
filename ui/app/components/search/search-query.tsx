import { UserRoundSearch } from "lucide-react";
import { useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { useDebounce } from "~/hooks/use-debounce";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  fetchResults,
  resetSearch,
  selectSearchKeyword,
  selectSearchStatus,
  setKeyword,
} from "~/store/search";

export function SearchQuery() {
  const dispatch = useAppDispatch();
  const keyword = useAppSelector(selectSearchKeyword);
  const status = useAppSelector(selectSearchStatus);
  const dQuery = useDebounce(keyword);

  useEffect(() => {
    if (dQuery.trim() === "") return;
    dispatch(fetchResults(dQuery));

    return () => {
      dispatch(resetSearch());
    };
  }, [dispatch, dQuery]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKeyword(e.target.value));
  };

  return (
    <InputGroup className="py-6 rounded-full">
      <InputGroupInput
        placeholder="Search your friend"
        onChange={searchHandler}
      />
      <InputGroupAddon>
        <UserRoundSearch />
      </InputGroupAddon>
    </InputGroup>
  );
}
