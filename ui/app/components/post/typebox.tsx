import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { THREAD_CHAR_LIMIT, type CreateThreadDTO } from "~/dto/thread";

export function Typebox({ maxHeight = 500 }: { maxHeight?: number }) {
  const form = useFormContext<CreateThreadDTO>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = form.watch("content") || "";
  const count = value.length;

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  const err = form.formState.errors.content;
  const showError = err?.type === "too_big"; // only show error when character limit exceeded

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <div className="flex-1">
      <FormField
        name="content"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <textarea
                {...field}
                ref={(e) => {
                  field.ref(e);
                  textareaRef.current = e;
                }}
                onChange={(e) => {
                  field.onChange(e);
                }}
                placeholder="What's Happening?"
                className={cn(
                  "w-full outline-none p-2 text-lg resize-none overflow-y-auto scrollbar-minimal",
                  "placeholder:text-muted-foreground",
                  "max-h-125",
                  showError && "border border-destructive",
                )}
              />
            </FormControl>
            {showError ? (
              <FormMessage />
            ) : (
              <div className="flex w-full text-xs text-muted-foreground justify-end">
                {count}/{THREAD_CHAR_LIMIT}
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
