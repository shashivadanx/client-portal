import { fetchKPI } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetKPI = () => {
  return useQuery({
    queryKey: ["client-kpi"],
    queryFn: () => fetchKPI(),
    select: (response) => response.data.kpiData,
  });
};
