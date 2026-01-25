import { Loader } from "lucide-react";

export function PageLoading() {
  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col justify-center items-center">
      <Loader className="animate-spin size-8" />
    </div>
  );
}
