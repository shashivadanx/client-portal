import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "@/lib/apis";
import { ScrollArea } from "@/components/ui/scroll-area";

import ActivityLogs from "./components/activity-logs";
import ResumeHeader from "./components/submission-header";
import SubmissionTabs from "./components/submission-tabs";
import { Main } from "@/components/layout/main";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { PageLoader } from "@/components/custom/page-loader";

export type ClientPortalSubmissionData = {
  submission: Submission;
  applicant: Applicant;
};
export interface SubmissionResponse {
  message: string;
  success: boolean;
  data: ClientPortalSubmissionData;
}

export interface Submission {
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  client_id: string;
  org_id: string;
  job_id: string;
  job_title: string;
  config: SubmissionConfig;
  status: "in_progress" | "completed" | "rejected"; // You can extend as needed
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface SubmissionConfig {
  show_candidate_info: boolean;
  resume_info: boolean;
  assessment_info: boolean;
  resume_evaluation_info: boolean;
}

export interface Applicant {
  assessment_id: string | null;
  resume_url: string | null;
  name: string;
  email: string;
  location: string | null;
  source: string | null;
  phone: string | null;
  resume_analysis: string[] | string | null | object;
  resume_analysis_version: number | null;
  resume_analysis_skills: string[] | string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export default function SubmissionDetails() {
  const { submissionId } = useParams<{ submissionId: string }>(); // fixed

  const {
    data: submission,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["client-submission", submissionId],
    queryFn: () =>
      api.get<SubmissionResponse>(
        `/recruiter/clients-portal/submission/${submissionId}`
      ),
  });

  return (
    <Main>
      <div className="w-full p-4">
        <h2 className="text-2xl font-bold text-gray-900">Candidate Info</h2>
      </div>
      {isLoading && (
        <div>
          <PageLoader />
        </div>
      )}
      {isError && (
        <div>
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Something went wrong. Please try again.</AlertTitle>
          </Alert>
        </div>
      )}

      <div className="flex">
        <ScrollArea className="h-[calc(100vh-12rem)] w-full">
          <div className="flex">
            {submission?.data?.data && (
              <div className="flex-1 pr-4">
                <div className="">
                  <ResumeHeader data={submission?.data?.data} />
                  <SubmissionTabs data={submission?.data?.data} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="w-[650px]">
          <ActivityLogs />
        </div>
      </div>
    </Main>
  );
}
