import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

export function Typebox() {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 500)}px`; // max-h-96 = 384px
  };

  useEffect(() => {
    handleInput();
  }, []);

  return (
    <textarea
      ref={ref}
      onInput={handleInput}
      placeholder="What's Happening?"
      className={cn(
        "w-full flex-1 outline-none p-2 text-lg placeholder:text-muted-foreground resize-none overflow-y-auto max-h-125",
      )}
    />
  );
}
