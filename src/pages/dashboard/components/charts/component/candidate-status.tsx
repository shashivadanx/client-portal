// Refactored CandidateStatusChart

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useFetchClientCharts } from "@/pages/dashboard/hooks/get-client-feedback";
import { Pie, PieChart } from "recharts";
import {
  ChartEmptyState,
  ChartErrorState,
  ChartLoadingState,
} from "./loader-error-states";

export function CandidateStatusChart() {
  const chart_type = "bar-chart";

  const {
    data: response,
    isLoading,
    isError,
  } = useFetchClientCharts({
    chart_type,
  });

  console.log("response", response);

  // Handle loading state with skeleton
  if (isLoading) {
    return (
      <ChartLoadingState
        title="Candidate Status"
        description="Current status breakdown across all submissions"
      />
    );
  }

  // Handle error state
  if (isError || !response?.success) {
    return (
      <ChartErrorState
        title="Candidate Status"
        message="Failed to load chart data. Please try again."
      />
    );
  }

  const chartColors = {
    approved: "#3B82F6", // Blue-500
    rejected: "#60A5FA", // Blue-400
    in_progress: "#93C5FD", // Blue-300
    on_hold: "#BFDBFE", // Blue-200
    unknown: "#E5E7EB", // Gray-200 fallback
  };
  // Transform API data to chart format
  // @ts-ignore dfdff
  const data = response.data.map((item) => {
    switch (item.status) {
      case "approved":
        return {
          status: "Approved",
          value: item.value,
          fill: chartColors.approved,
        };
      case "rejected":
        return {
          status: "Rejected",
          value: item.value,
          fill: chartColors.rejected,
        };
      case "in_progress":
        return {
          status: "In Progress",
          value: item.value,
          fill: chartColors.in_progress,
        };
      case "on_hold":
        return {
          status: "On Hold",
          value: item.value,
          fill: chartColors.on_hold,
        };
      default:
        return { status: "Unknown", value: 0, fill: chartColors.unknown };
    }
  });

  // Handle empty state
  // @ts-ignore dfdff
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <ChartEmptyState
        title="Candidate Status"
        message="No submissions available"
      />
    );
  }

  const config: ChartConfig = {
    Approved: { label: "Approved", color: "var(--color-chart-1)" },
    Rejected: { label: "Rejected", color: "var(--color-chart-5)" },
    "In Progress": { label: "In Progress", color: "var(--color-chart-3)" },
    "On Hold": { label: "On Hold", color: "var(--color-chart-4)" },
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Candidate Status
        </CardTitle>
        <CardDescription>
          Current status breakdown across all submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={58}
              outerRadius={86}
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
