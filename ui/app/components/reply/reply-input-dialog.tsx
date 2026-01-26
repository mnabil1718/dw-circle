import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateThreadSchema,
  type CreateThreadDTO,
  type Thread,
} from "~/dto/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "../image-upload";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useRef, useState, type MouseEvent } from "react";
import { ImageUploadPreview } from "../image-upload-preview";
import type { CreateReplyDTO } from "~/dto/reply";
import { createReply } from "~/store/reply";
import { Typebox } from "../post/typebox";
import { MessageSquare } from "lucide-react";
import { formatPostDuration } from "~/utils/date";
import { useNavigate } from "react-router";
import { PostMiniPreview } from "./post-mini-preview";

type ReplyInputOptions = {
  placeholder?: string;
  thread: Thread;
};

export function ReplyInputDialog(param: ReplyInputOptions) {
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  let navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreateReplyDTO>({
    resolver: zodResolver(CreateThreadSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: CreateReplyDTO) {
    dispatch(createReply({ req: values, user, threadId: param.thread.id }));
    form.reset();
    navigate(`/posts/${param.thread.id}`);
    setOpen(false);
  }

  const openDialog = (e: MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          onClick={openDialog}
          className="flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer"
        >
          <MessageSquare size={20} /> {param.thread.replies}
        </DialogTrigger>
        <DialogContent className="top-10 translate-y-0 max-w-md w-full p-3">
          {/* SUPPRESS WARNING */}
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col p-4 pt-10 gap-2"
            >
              <PostMiniPreview thread={param.thread} />

              <div className="flex items-start gap-2">
                <Avatar image={user?.avatar} className="w-10 h-10" />
                <Typebox placeholder="Type your Reply!" maxHeight={300} />
              </div>

              <div className="flex pt-3 gap-2 items-center border-t justify-between">
                <ImageUpload fileInputRef={fileInputRef} />
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="rounded-full px-6"
                >
                  Reply
                </Button>
              </div>
              <ImageUploadPreview<CreateReplyDTO> fileInputRef={fileInputRef} />
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
