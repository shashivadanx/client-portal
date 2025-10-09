import { DialogDescription } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apis";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
// shadcn/ui components
import { Skeleton } from "@/components/ui/skeleton";
import ResumeComparison from "./components/candidate-comparison";
import GridToggle from "./components/grid-toggle";
import { useClientPortalStore } from "@/pages/job-submissions/components/store/client-portal";

export interface ApiResponse {
  message: string;
  success: boolean;
  data: SubmissionWrapper[];
}

export interface SubmissionWrapper {
  id: string;
  success: boolean;
  data: SubmissionData;
}

export interface SubmissionData {
  submission: Submission;
  applicant: Applicant;
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
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  status: string; // "on_hold" | "in_progress" | etc.
}

export interface SubmissionConfig {
  show_candidate_info: boolean;
  resume_info: boolean;
  assessment_info: boolean;
  resume_evaluation_info: boolean;
}

export interface Applicant {
  assessment_id: string | null;
  source: string | null;
  resume_url: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  resume_analysis: string[];
  resume_analysis_version: number;
  resume_analysis_skills: string[];
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export default function ComparisonDialog() {
  const { isDialogOpen, setIsDialogOpen, comparisonCols, setComparisonCols } =
    useClientPortalStore();
  const submissions = useClientPortalStore((state) => state.dialogData);
  const submissionArray = Array.isArray(submissions) ? submissions : [];
  const submissionsIds = submissionArray?.map((submission) => submission.id);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      api.get<ApiResponse>(
        `/recruiter/clients-portal/submissions/multiple?ids=${submissionsIds.join(
          ","
        )}`
      ),
    queryKey: ["client-portal-multiple", submissionsIds],
    enabled: !!submissionsIds && submissionsIds.length > 1,
  });

  return (
    <Dialog
      open={isDialogOpen === "comparison"}
      onOpenChange={(open) => setIsDialogOpen(open ? "comparison" : null)}
    >
      <DialogContent className="w-full max-w-none sm:max-w-[90%]">
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle>Comparison</DialogTitle>
            <DialogDescription>
              Side-by-side detail comparison
            </DialogDescription>
          </div>
          <div className="mr-6 flex items-center justify-end">
            <GridToggle value={comparisonCols} onChange={setComparisonCols} />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Loading submissions...
              </p>
              {/* Optional skeleton grid preview */}
              <div className="mt-6 grid w-full grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {isError && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {(error as any)?.message ??
                  "Something went wrong while fetching submissions."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (
            <ResumeComparison
              candidates={data?.data.data.map((d) => d.data) ?? []}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
