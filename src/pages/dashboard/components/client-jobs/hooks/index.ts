import { fetchJobs } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";

// Custom hook for jobs query
export const useJobs = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["client-portal-jobs", page, limit],
    queryFn: () => fetchJobs(page, limit),
  });
};
