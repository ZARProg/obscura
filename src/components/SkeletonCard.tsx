import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  variant?: "default" | "mini";
}

export default function SkeletonCard({ variant = "default" }: SkeletonCardProps) {
  if (variant === "mini") {
    return (
      <div className="flex flex-col items-center w-28">
        <Skeleton className="h-28 w-28 rounded-full mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  // default (movie/tv)
  return (
    <div className="flex flex-col space-y-2 w-[150px]">
      <Skeleton className="h-[225px] w-[150px] rounded-lg" />
      <Skeleton className="h-4 w-[120px]" />
    </div>
  );
}
