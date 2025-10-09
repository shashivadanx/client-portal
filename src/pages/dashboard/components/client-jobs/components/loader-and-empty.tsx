import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

// Loading State Component
export const LoadingState = ({ limit }: { limit: number }) => (
  <>
    {Array.from({ length: limit }).map((_, idx) => (
      <TableRow key={idx}>
        {Array.from({ length: 5 }).map((_, cellIdx) => (
          <TableCell key={cellIdx}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

// Error State Component
export const ErrorState = ({ error }: { error: Error }) => (
  <TableRow>
    <TableCell colSpan={5} className="text-red-500">
      Failed to load jobs: {error.message}
    </TableCell>
  </TableRow>
);

// Empty State Component
export const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={5} className="py-4 text-center text-muted-foreground">
      No jobs available.
    </TableCell>
  </TableRow>
);
