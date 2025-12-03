import { Card, CardContent } from "./ui/card";

export function ProjectCardSkeleton() {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardContent className="p-4 flex flex-col gap-4 animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>

        <div className="mt-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-6 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
