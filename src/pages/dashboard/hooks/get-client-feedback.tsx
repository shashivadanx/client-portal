import { fetchClientCharts } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useFetchClientCharts = ({
  page = 1,
  size = 10,
  chart_type = "feedback-by-job",
}: {
  page?: number;
  size?: number;
  chart_type?: string;
}) => {
  return useQuery({
    queryKey: ["client-charts", chart_type, page, size],
    queryFn: () => fetchClientCharts({ page, size, chart_type }),
  });
};
