import { getUserData } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserData() {
  return useQuery({
    queryKey: ["user-data"],
    queryFn: getUserData,
  });
}
