import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
    </div>
  );
}
