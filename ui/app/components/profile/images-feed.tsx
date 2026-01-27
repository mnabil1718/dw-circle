import { useState } from "react";
import { selectAuthUser } from "~/store/auth";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectMyImages } from "~/store/threads";
import { ImageViewer } from "../image-viewer";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ImagesFeed() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const images = useAppSelector(selectMyImages);

  const [open, setOpen] = useState<boolean>(false);
  const [idx, setIdx] = useState<number>(0);

  if (images.length < 1) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center text-muted-foreground">
        You have no media
      </div>
    );
  }

  const openImageDialog = (i: number) => {
    setOpen(true);
    setIdx(i);
  };

  const handlePrev = () => {
    setIdx(idx - 1);
  };

  const handleNext = () => {
    setIdx(idx + 1);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-full h-screen p-0 bg-transparent backdrop-blur-lg">
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
                  src={images[idx]?.image}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Nav */}
              <div className="flex-none flex items-center gap-5 mx-auto mt-4">
                <Button
                  variant="outline"
                  disabled={idx === 0}
                  onClick={handlePrev}
                >
                  <ArrowLeft />
                </Button>

                <span>
                  {idx + 1}/{images.length}
                </span>

                <Button
                  variant="outline"
                  disabled={idx === images.length - 1}
                  onClick={handleNext}
                >
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ul className="w-full grid grid-cols-3 gap-1 px-2">
        {images.map((i, index) => {
          return (
            <div
              className="col-span-1 aspect-square overflow-hidden cursor-pointer"
              onClick={() => openImageDialog(index)}
            >
              <img
                src={i.image}
                alt={i.image}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </ul>
    </>
  );
}
