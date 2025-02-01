import { Skeleton } from "@/components/ui/skeleton";

export function SearchBarSkeleton() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Skeleton className="w-full h-10" />
    </div>
  );
}
