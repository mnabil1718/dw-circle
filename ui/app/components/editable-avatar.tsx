import { ImagePlus, X } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import {
  ProfileImageSchema,
  type UpdateProfileSchemaType,
} from "~/dto/profile";
import { cn } from "~/lib/utils";
import { toastError, toastSuccess } from "~/utils/toast";

export function EditableAvatar({
  className,
  image = "/avatar.jpg",
  alt = "Profile Picture",
}: {
  className: string;
  image?: string;
  alt?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useFormContext<UpdateProfileSchemaType>();

  const value = form.watch("image");

  const clickFileInput = () => {
    fileInputRef.current?.click();
  };

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const val = ProfileImageSchema.safeParse(file);

    if (!val.success) {
      const msg = val.error.issues[0].message;
      form.setError("image", { type: "manual", message: msg });
      e.target.value = "";
      toastError(msg);
      return;
    }

    form.setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const deleteImage = () => {
    form.setValue("image", undefined, {
      shouldValidate: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        className,
        "relative rounded-full bg-background cursor-pointer border-4 border-background",
      )}
    >
      {value && (
        <button
          onClick={deleteImage}
          className="absolute border cursor-pointer rounded-full p-1 -top-1 -right-1.5 z-20 bg-accent"
        >
          <X className="size-4" />
        </button>
      )}
      <div className="relative group w-full h-full rounded-full overflow-hidden bg-background cursor-pointer">
        <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 bg-white/30 backdrop-blur-sm transition-opacity duration-200 flex flex-col justify-center items-center">
          <div
            onClick={clickFileInput}
            className="p-2 rounded-full justify-center items-center bg-background/50"
          >
            <input
              ref={fileInputRef}
              onChange={fileHandler}
              name="image"
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              hidden
            />
            <ImagePlus className="size-5" />
          </div>
        </div>

        {!value ? (
          <img src={image} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <img
            src={URL.createObjectURL(value)}
            alt={value.name}
            className="relative w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
