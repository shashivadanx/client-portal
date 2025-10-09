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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartEmptyState,
  ChartErrorState,
  ChartLoadingState,
} from "./loader-error-states";

export const colors = {
  blueLight: "#3B82F6",
  blueDark: "#1D4ED8",
  // other shared colors...
};

export function FeedbackByJobChart() {
  const config: ChartConfig = {
    total: { label: "Total Submissions", color: colors.blueLight },
    completed_count: { label: "Completed Submissions", color: colors.blueDark },
  };

  const {
    data: response,
    isLoading,
    isError,
  } = useFetchClientCharts({
    chart_type: "feedback-by-job",
  });

  if (isLoading) {
    return (
      <ChartLoadingState
        title="Submissions by Job"
        description="Comparing total submissions vs. completed submissions"
      />
    );
  }

  if (isError || !response?.success) {
    return (
      <ChartErrorState
        title="Submissions by Job"
        message="Failed to load chart. Please try again."
      />
    );
  }

  const chartData = response.data;

  if (!chartData || chartData.length === 0) {
    return (
      <ChartEmptyState title="Submissions by Job" message="No data available" />
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Submissions by Job
        </CardTitle>
        <CardDescription>
          Comparing total submissions vs. completed submissions
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full w-full">
        <ChartContainer config={config} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="job"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={30}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="total"
              fill={colors.blueLight}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="completed_count"
              fill={colors.blueDark}
              radius={[6, 6, 0, 0]}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
