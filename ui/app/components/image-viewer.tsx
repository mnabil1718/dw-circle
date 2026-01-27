import { useState, type MouseEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function ImageViewer({
  image_url,
  children,
}: {
  image_url: string | undefined;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const toggleDialog = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (!open) {
      setOpen(true);
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="min-w-full h-screen p-0 bg-transparent backdrop-blur-lg"
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Header must NOT grow */}
            <DialogHeader className="flex-none px-4 pt-4">
              <DialogTitle />
              <DialogDescription />
            </DialogHeader>

            <div className="flex-1 p-3 flex flex-col overflow-hidden">
              {/* Image container */}
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <img
                  src={image_url}
                  alt={image_url}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Nav */}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {image_url && (
        <div
          onClick={toggleDialog}
          className="relative max-w-full max-h-96 overflow-hidden rounded-md mb-2 cursor-pointer"
        >
          {children}
        </div>
      )}
    </>
  );
}
