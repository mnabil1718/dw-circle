import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { CreateThreadDTO } from "~/dto/thread";

export function PostImagePreview({
  fileInputRef,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const form = useFormContext<CreateThreadDTO>();

  const image = form.watch("image");

  const deleteImage = () => {
    form.setValue("image", undefined, {
      shouldValidate: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {image && (
        <div className="relative mt-2 w-fit h-fit">
          <button
            type="button"
            onClick={deleteImage}
            className="absolute -right-3 -top-3 z-10 w-7 h-7 p-1 rounded-full flex justify-center items-center bg-accent cursor-pointer border"
          >
            <X />
          </button>
          <div className="relative border aspect-square max-w-40 w-full overflow-hidden rounded-md">
            <img
              src={URL.createObjectURL(image)}
              alt={image.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
