import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_6px_20px_rgba(15,23,42,.07)] sm:rounded-2xl">
      <div className="relative aspect-square">
        <Skeleton className="absolute inset-0 rounded-none" />

        <Skeleton className="absolute end-2 top-2 h-10 w-10 rounded-full" />

        <Skeleton className="absolute bottom-2 end-2 h-11 w-11 rounded-full" />
      </div>

      <div className="space-y-2 px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5 sm:pt-3">
        <Skeleton className="h-2.5 w-16" />

        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}