import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAuthUser } from "~/store/auth";
import { Textarea } from "~/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import {
  UpdateProfileSchema,
  type UpdateProfileSchemaType,
} from "~/dto/profile";
import { selectProfile, updateProfile } from "~/store/profile";
import { Button } from "../ui/button";
import { CoverImage } from "../cover-image";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Avatar } from "../avatar";
import { EditableAvatar } from "../editable-avatar";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export function EditProfileDialog() {
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(selectAuthUser);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // initially will always be empty
  const form = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: profile?.name,
      username: profile?.username,
      bio: profile?.bio,
    },
  });

  //   update after profile/fetchProfile fulfilled
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        username: profile.username,
        bio: profile.bio,
      });
    }
  }, [profile]);

  async function onSubmit(values: UpdateProfileSchemaType) {
    dispatch(
      updateProfile({
        name: values.name,
        bio: values.bio,
        image: values.image,
        username: values.username,
        userId: user?.user_id ?? 0,
      }),
    );
    form.reset();
    setOpen(false);
  }

  const openDialog = (e: MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          disabled={!profile}
          onClick={openDialog}
          className="hover:opacity-100 cursor-pointer px-4 py-2 border text-sm font-medium rounded-full bg-white/5 hover:bg-white/10"
        >
          Edit Profile
        </DialogTrigger>
        <DialogContent
          className="top-10 translate-y-0 max-w-md w-full p-5"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="font-medium">Edit profile</DialogTitle>
            {/* SUPPRESS WARNING */}
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2"
            >
              <CoverImage />
              <EditableAvatar
                image={profile?.avatar}
                alt={profile?.name}
                className="w-20 h-20 -mt-10 ml-2 border-4 border-card mb-2"
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormControl className="py-5">
                      <Input placeholder="Name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormControl className="py-5">
                      <Input placeholder="Username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormControl>
                      <Textarea
                        placeholder="Write Bio"
                        rows={6}
                        className="resize-none max-h-16 overflow-y-auto scrollbar-minimal"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex pt-3 gap-2 items-center border-t justify-end">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="rounded-full px-6"
                >
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
