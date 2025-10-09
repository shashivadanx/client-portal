import apiClient from "..";

export type KPI = {
  title: string;
  value: string;
  description: string;
};

export type KPIResponse = {
  success: boolean;
  data: {
    kpiData: KPI[];
  };
};

export const fetchKPI = async (): Promise<KPIResponse> => {
  const { data } = await apiClient.get<KPIResponse>(
    "/recruiter/clients-portal/kpis"
  );
  return data;
};

export const fetchClientCharts = async ({
  page = 1,
  size = 10,
  chart_type = "feedback-by-job",
} = {}) => {
  const res = await apiClient.get("/recruiter/clients-portal/charts", {
    params: { chart_type, page, size },
  });
  return res.data;
};

export interface JobData {
  id: string;
  title: string;
  type: string;
  company_name: string;
  status: string;
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobsResponse {
  message: string;
  success: boolean;
  pagination: Pagination;
  data: JobData[];
}
export const fetchJobs = async (
  page: number,
  limit: number
): Promise<JobsResponse> => {
  const response = await apiClient.get<JobsResponse>(
    `/recruiter/clients-portal/jobs?page=${page}&limit=${limit}`
  );
  return response.data;
};
