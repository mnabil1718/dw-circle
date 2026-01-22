import { X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

export function PostThumb({ image_url }: { image_url: string | undefined }) {
  const [open, setOpen] = useState<boolean>(false);
  const [transition, setTransition] = useState<boolean>(false); // will be delayed a bit after opening dialog
  const toggleDialog = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    // only transitioning opacity
    // delayed a bit after open dialog
    // or before close dialog

    if (!open) {
      setOpen(true);
      setTimeout(() => {
        setTransition(true);
      }, 30);
      return;
    }

    setTransition(false);
    setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <>
          <div
            onClick={toggleDialog}
            className="fixed z-10 inset-0 bg-background/50 backdrop-blur-lg px-32 py-10 flex flex-col justify-center items-center"
          >
            <button
              onClick={toggleDialog}
              className="fixed top-7 right-7 z-20 border p-1 rounded-md cursor-pointer group opacity-70 hover:opacity-100"
            >
              <X size={40} />
            </button>
            <img
              src={image_url}
              alt={image_url}
              className={`max-w-full max-h-full object-contain transition-all duration-100 ease ${transition ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            />
          </div>
        </>
      )}

      {image_url && (
        <div
          onClick={toggleDialog}
          className="relative max-w-full max-h-96 overflow-hidden rounded-md mb-2 cursor-pointer"
        >
          <img
            src={image_url}
            alt={image_url}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
}
