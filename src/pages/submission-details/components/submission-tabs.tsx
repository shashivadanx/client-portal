"use client";

import { ClientPortalSubmissionData } from "..";
import { FeedbackHistoryCard } from "./feedback";
import ResumeEvaluation from "./resume-evaluation";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import ResumeRender from "./resume-render";
import AssessmentQuestionsViewer from "./assessment-question-viewer";

export default function SubmissionTabs({
  data,
}: {
  data: ClientPortalSubmissionData;
}) {
  const showResume = data.submission.config.resume_info;
  const showResumeEvaluation = data.submission.config.resume_evaluation_info;
  const showAssessments = data.submission.config.assessment_info;
  const tabs = [
    ...(showResume
      ? [
          {
            label: "Resume",
            value: "resume",
            content: (
              <div className="mt-6">
                <h2 className="mb-4 text-lg font-semibold">Resume</h2>
                <div className="h-[40rem]">
                  <ResumeRender
                    iframeClass="rounded-xl mx-4 h-[500px]"
                    className="h-[500px]"
                    fileUrl={data.applicant.resume_url ?? ""}
                  />
                </div>
              </div>
            ),
          },
        ]
      : []),
    ...(showResumeEvaluation
      ? [
          {
            label: "Resume Evaluation",
            value: "resume-evaluation",
            content: <ResumeEvaluation data={data} />,
          },
        ]
      : []),
    ...(showAssessments
      ? [
          {
            label: "Assessments",
            value: "assessments",
            content: (
              <div className="mt-6">
                <h2 className="mb-4 text-lg font-semibold">Assessments</h2>
                {data.applicant.assessment_id ? (
                  <AssessmentQuestionsViewer
                    assessmentsId={data.applicant.assessment_id}
                  />
                ) : (
                  <div className="rounded-lg border p-6 text-center">
                    <p className="text-gray-600">
                      No assessment has been created for this candidate yet.
                    </p>
                  </div>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      label: "Feedback History",
      value: "feedback-history",
      content: (
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">Feedback History</h2>
          <FeedbackHistoryCard />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <AnimatedTabs tabs={tabs} defaultValue="resume" className="w-full" />
    </div>
  );
}
