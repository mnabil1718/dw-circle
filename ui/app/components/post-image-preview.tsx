import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { CreateThreadDTO } from "~/dto/thread";

export function PostImagePreview() {
  const form = useFormContext<CreateThreadDTO>();

  const image = form.watch("image");

  const deleteImage = () => {
    form.setValue("image", undefined, {
      shouldValidate: true,
    });
  };

  return (
    <>
      {image && (
        <div className="relative w-fit h-fit">
          <button
            type="button"
            onClick={deleteImage}
            className="absolute -right-3 -top-3 z-10 w-7 h-7 p-1 rounded-full flex justify-center items-center bg-accent cursor-pointer border"
          >
            <X />
          </button>
          <div className="relative aspect-square max-w-40 w-full overflow-hidden rounded-md">
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
