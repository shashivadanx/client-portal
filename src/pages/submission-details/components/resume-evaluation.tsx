import { ClientPortalSubmissionData } from "..";
import ResumeAnalysisDisplay from "./resume-analysis-display";

export default function ResumeEvaluation({
  data,
}: {
  data: ClientPortalSubmissionData;
}) {
  const resumeAnalysisVersion = parseInt(
    data?.applicant?.resume_analysis_version?.toString() || "0",
    10
  );

  return (
    <div className="px-4 py-3">
      <h2 className="mb-4 text-lg font-semibold">Resume Evaluation</h2>

      {resumeAnalysisVersion === 1 && (
        <ResumeAnalysisDisplay
          resumeAnalysis={{
            resume_analysis_version: resumeAnalysisVersion,
            data: {
              analysis_summary: data?.applicant?.resume_analysis as string,
            },
          }}
        />
      )}
      {resumeAnalysisVersion === 2 &&
        data?.applicant?.resume_analysis &&
        typeof data?.applicant?.resume_analysis === "object" && (
          <ResumeAnalysisDisplay
            resumeAnalysis={{
              resume_analysis_version: resumeAnalysisVersion,
              data: {
                strengths:
                  typeof data?.applicant?.resume_analysis === "object"
                    ? (
                        data?.applicant?.resume_analysis as {
                          strength: string[];
                          weakness: string[];
                        }
                      ).strength ?? []
                    : [],
                weaknesses:
                  typeof data?.applicant?.resume_analysis === "object"
                    ? (
                        data?.applicant?.resume_analysis as {
                          strength: string[];
                          weakness: string[];
                        }
                      ).weakness ?? []
                    : [],
              },
            }}
          />
        )}
      {resumeAnalysisVersion === 3 &&
        typeof data?.applicant?.resume_analysis === "object" && (
          <ul className="ml-4 space-y-2">
            {Object.entries(data?.applicant?.resume_analysis || {}).map(
              ([key, value]) => (
                <li key={key} className="list-disc">
                  {String(value)}
                </li>
              )
            )}
          </ul>
        )}
    </div>
  );
}
