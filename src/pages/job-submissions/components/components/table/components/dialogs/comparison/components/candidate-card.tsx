"use client";

import { FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { SubmissionData } from "..";
import { AnimatedTabs, Tab } from "@/components/ui/animated-tabs";
import ResumeRender from "@/pages/submission-details/components/resume-render";

export default function ResumeCard({ data }: { data: SubmissionData }) {
  const { submission, applicant } = data;

  const showResume = submission.config.resume_info;
  const showResumeEvaluation = submission.config.resume_evaluation_info;
  const showInfo = submission.config.show_candidate_info;

  // Map submission status to UI status
  const getComponentStatus = (
    status: string
  ): "approved" | "in_progress" | "rejected" | "on_hold" => {
    switch (status) {
      case "approved":
        return "approved";
      case "in_progress":
        return "in_progress";
      case "rejected":
        return "rejected";
      default:
        return "on_hold";
    }
  };

  const componentStatus = getComponentStatus(submission.status);

  // Extract resume analysis summary
  const getSummary = () => {
    const analysis = applicant.resume_analysis;
    if (!analysis) return "No resume analysis available.";

    if (typeof analysis === "string") return analysis;
    if (Array.isArray(analysis)) return analysis.join(". ");
    if (typeof analysis === "object") return JSON.stringify(analysis);

    return "No resume analysis available.";
  };

  const tabs: Tab[] = [
    ...(showInfo
      ? [
          {
            label: "Info",
            value: "info",
            content: (
              <div className="grid gap-2 text-sm">
                <div>
                  <span className="font-medium">Job Title:</span>{" "}
                  <span className="text-muted-foreground">
                    {submission.job_title}
                  </span>
                </div>

                {applicant.location && (
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    <span className="text-muted-foreground">
                      {applicant.location}
                    </span>
                  </div>
                )}

                {applicant.phone && (
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    <span className="text-muted-foreground">
                      {applicant.phone}
                    </span>
                  </div>
                )}

                <div>
                  <span className="font-medium">Current Status:</span>{" "}
                  <StatusText status={componentStatus} />
                </div>
              </div>
            ),
          },
        ]
      : []),
    ...(showResume
      ? [
          {
            label: "Resume",
            value: "resume",
            content: (
              <div className="h-[500px]">
                <ResumeRender
                  className="h-[500px]"
                  iframeClass="mx-4 h-[500px] rounded-xl"
                  fileUrl={applicant.resume_url ?? ""}
                />
              </div>
            ),
          },
        ]
      : []),
    ...(showResumeEvaluation
      ? [
          {
            label: "Resume Analysis",
            value: "resume_analysis",
            content: (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" aria-hidden />
                  <span>Resume Summary</span>
                </div>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {getSummary()}
                </p>
              </div>
            ),
          },
        ]
      : []),
  ].filter(Boolean);

  return (
    <Card className={cn("h-full")}>
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-medium leading-none">{applicant.name}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" aria-hidden />
                <span className="truncate">{applicant.email}</span>
              </p>
            </div>
            <StatusPill status={componentStatus} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatedTabs tabs={tabs} defaultValue="info" />
      </CardContent>
    </Card>
  );
}

function StatusPill({
  status,
}: {
  status: "approved" | "in_progress" | "rejected" | "on_hold";
}) {
  const pillClass = cn(
    "inline-flex items-center rounded-full px-2 py-1 text-xs",
    status === "approved" && "bg-secondary text-secondary-foreground",
    status === "in_progress" && "bg-muted text-muted-foreground",
    status === "on_hold" && "bg-accent text-accent-foreground",
    status === "rejected" && "bg-destructive/10 text-destructive"
  );

  const label =
    status === "approved"
      ? "Approved"
      : status === "in_progress"
      ? "In Progress"
      : status === "on_hold"
      ? "On Hold"
      : "Rejected";

  return <span className={pillClass}>{label}</span>;
}

function StatusText({
  status,
}: {
  status: "approved" | "in_progress" | "rejected" | "on_hold";
}) {
  const label =
    status === "approved"
      ? "Approved"
      : status === "in_progress"
      ? "In Progress"
      : status === "on_hold"
      ? "On Hold"
      : "Rejected";

  return <span className="text-muted-foreground">{label}</span>;
}
