import { Typebox } from "./typebox";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { CreateThreadSchema, type CreateThreadDTO } from "~/dto/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "../image-upload";
import { PostImagePreview } from "./post-image-preview";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { createThread } from "~/store/thread";
import { selectAuthUser } from "~/store/auth";
import { useRef } from "react";

type PostInputOptions = {
  placeholder?: string;
};

export function PostInput(param?: PostInputOptions) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreateThreadDTO>({
    resolver: zodResolver(CreateThreadSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: CreateThreadDTO) {
    dispatch(createThread({ req: values, user }));
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
              Post
            </Button>
          </div>
        </div>
        <PostImagePreview fileInputRef={fileInputRef} />
      </form>
    </FormProvider>
  );
}
