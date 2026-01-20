import { ImagePlus } from "lucide-react";
import { Typebox } from "./typebox";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";

export function PostInput() {
  return (
    <div className="w-full flex items-start gap-2 p-2">
      <Avatar className="w-10 h-10" />
      <Typebox />
      <div className="flex-none flex gap-3 items-center pr-4">
        <button className="cursor-pointer text-primary opacity-70 hover:opacity-100">
          <ImagePlus size={25} />
        </button>
        <Button className="rounded-full px-6">Post</Button>
      </div>
    </div>
  );
}
