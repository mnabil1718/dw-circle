import { Heart, MessageSquare } from "lucide-react";
import { Avatar } from "./avatar";

export function PostListItem() {
  return (
    <li className="px-5 py-7 w-full flex items-start gap-5">
      <Avatar className="w-10 h-10" />
      <div className="flex flex-col gap-2">
        <div className="text-sm flex items-center gap-2">
          <h2 className="font-medium">Udin Komaruddin</h2>
          <span className="text-sm text-muted-foreground">@udin_semau6ue</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
          <span className="text-muted-foreground">10h</span>
        </div>
        <p className="text-sm">Lorem ipsum</p>
        <div className="flex items-center gap-5 text-sm">
          <button className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer">
            <Heart size={20} /> 30
          </button>
          <button className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer">
            <MessageSquare size={20} /> 122
          </button>
        </div>
      </div>
    </li>
  );
}
