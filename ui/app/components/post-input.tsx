import { ImagePlus } from "lucide-react";
import { Typebox } from "./typebox";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { CreateThreadSchema, type CreateThreadDTO } from "~/dto/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "./image-upload";
import { PostImagePreview } from "./post-image-preview";
import { useNavigate } from "react-router";
import { useAppDispatch } from "~/store/hooks";
import { postThreads } from "~/services/thread";
import { threadAdded } from "~/store/thread";

export function PostInput() {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm<CreateThreadDTO>({
    resolver: zodResolver(CreateThreadSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  const image = form.watch("image");

  async function onSubmit(values: CreateThreadDTO) {
    const res = await postThreads(values);
    dispatch(threadAdded(res));
    form.reset();
    navigate("/home");
  }

  console.log(form.formState.errors.image);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col p-4 gap-2"
      >
        <div className="flex items-start gap-2">
          <Avatar className="w-10 h-10" />
          <Typebox />
          <div className="flex-none flex gap-3 items-center pr-4">
            <ImageUpload />
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="rounded-full px-6"
            >
              Post
            </Button>
          </div>
        </div>
        <PostImagePreview />
      </form>
    </FormProvider>
  );
}
