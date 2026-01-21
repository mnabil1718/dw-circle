import { ImagePlus } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { ThreadImageSchema, type CreateThreadDTO } from "~/dto/thread";

export function ImageUpload({
  fileInputRef,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const form = useFormContext<CreateThreadDTO>();

  const clickFileInput = () => {
    fileInputRef.current?.click();
  };

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const val = ThreadImageSchema.safeParse(file);

    if (!val.success) {
      const msg = val.error.issues[0].message;
      form.setError("image", { type: "manual", message: msg });
      e.target.value = "";
      toast.error(msg);
      return;
    }

    form.setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <input
        ref={fileInputRef}
        hidden
        type="file"
        name="image"
        id="image"
        accept=".jpg,.png,.webp"
        onChange={fileHandler}
      />
      <button
        type="button"
        onClick={clickFileInput}
        className="cursor-pointer text-primary opacity-70 hover:opacity-100"
      >
        <ImagePlus size={25} />
      </button>
    </>
  );
}
