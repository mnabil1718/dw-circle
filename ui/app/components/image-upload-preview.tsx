import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { X } from "lucide-react";

type HasImageField = {
  image?: File;
};

export function ImageUploadPreview<T extends FieldValues & HasImageField>({
  fileInputRef,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const form = useFormContext<T>();

  const image = form.watch("image" as Path<T>) as File | undefined;

  const deleteImage = () => {
    form.setValue("image" as Path<T>, undefined as any, {
      shouldValidate: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!image) return null;

  return (
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
  );
}
