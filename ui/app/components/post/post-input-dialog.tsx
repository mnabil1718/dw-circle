import { Typebox } from "./typebox";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { CreateThreadSchema, type CreateThreadDTO } from "~/dto/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "../image-upload";
import { ImageUploadPreview } from "../image-upload-preview";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { createThread } from "~/store/threads";
import { selectAuthUser } from "~/store/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useRef, useState } from "react";

export function PostInputDialog() {
  const [open, setOpen] = useState<boolean>(false);

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
    setOpen(false);
  }

  const openDialog = () => {
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          onClick={openDialog}
          className="w-full bg-primary cursor-pointer rounded-full text-lg p-3 mt-5"
        >
          Create Post
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
              <div className="flex items-start gap-2">
                <Avatar image={user?.avatar} className="w-10 h-10" />
                <Typebox maxHeight={300} />
              </div>
              <div className="flex pt-3 gap-2 items-center border-t justify-between">
                <ImageUpload fileInputRef={fileInputRef} />
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="rounded-full px-6"
                >
                  Post
                </Button>
              </div>
              <ImageUploadPreview<CreateThreadDTO>
                fileInputRef={fileInputRef}
              />
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
