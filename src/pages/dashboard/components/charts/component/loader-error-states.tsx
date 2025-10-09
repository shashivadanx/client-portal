// Common Chart States Component

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading state component
interface ChartLoadingStateProps {
  title?: string;
  description?: string;
}

export function ChartLoadingState({
  title,
  description,
}: ChartLoadingStateProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {title ? title : <Skeleton className="h-6 w-32" />}
        </CardTitle>
        <CardDescription>
          {description ? description : <Skeleton className="h-4 w-48" />}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-[300px] w-full items-center justify-center">
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

// Error state component
interface ChartErrorStateProps {
  title?: string;
  message?: string;
  height?: string;
}

export function ChartErrorState({
  title = "Failed to load chart",
  message = "Failed to load chart. Please try again.",
  height = "300px",
}: ChartErrorStateProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={`flex h-[${height}] w-full items-center justify-center text-red-500`}
      >
        {message}
      </CardContent>
    </Card>
  );
}

// Empty state component
interface ChartEmptyStateProps {
  title?: string;
  message?: string;
  height?: string;
}

export function ChartEmptyState({
  title = "No Data Available",
  message = "No data available",
  height = "300px",
}: ChartEmptyStateProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={`flex h-[${height}] w-full items-center justify-center text-gray-500`}
      >
        {message}
      </CardContent>
    </Card>
  );
}
