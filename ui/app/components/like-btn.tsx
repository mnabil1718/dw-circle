import { Heart } from "lucide-react";
import { useState } from "react";

export function LikeBtn({
  isLiked,
  likes,
}: {
  isLiked: boolean;
  likes: number;
}) {
  const [liked, setLiked] = useState<boolean>(isLiked);

  const likeHandler = () => {
    setLiked(!liked);
  };

  return (
    <button
      onClick={likeHandler}
      className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer"
    >
      {liked ? <Heart size={20} fill="white" /> : <Heart size={20} />} {likes}
    </button>
  );
}
