import { Typebox } from "../post/typebox";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { CreateThreadSchema, type CreateThreadDTO } from "~/dto/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "../image-upload";
import { ImageUploadPreview } from "../image-upload-preview";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";
import { useRef } from "react";
import type { CreateReplyDTO } from "~/dto/reply";
import { createReply } from "~/store/reply";

type ReplyInputOptions = {
  placeholder?: string;
  threadId: number;
};

export function ReplyInput(param: ReplyInputOptions) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreateReplyDTO>({
    resolver: zodResolver(CreateThreadSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: CreateReplyDTO) {
    dispatch(createReply({ req: values, user, threadId: param.threadId }));
    form.reset();
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <div className="flex items-start gap-2">
          <Avatar className="w-10 h-10" />
          <Typebox placeholder={param?.placeholder} />
          <div className="flex-none flex gap-3 items-center">
            <ImageUpload fileInputRef={fileInputRef} />
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="rounded-full px-6"
            >
              Reply
            </Button>
          </div>
        </div>
        <ImageUploadPreview<CreateReplyDTO> fileInputRef={fileInputRef} />
      </form>
    </FormProvider>
  );
}
