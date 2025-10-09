"use client";

import { cn } from "@/lib/utils";

import { SubmissionData } from "..";
import CandidateCard from "./candidate-card";
import { useClientPortalStore } from "@/pages/job-submissions/components/store/client-portal";

export default function ResumeComparison({
  candidates,
}: {
  candidates: SubmissionData[];
}) {
  const { comparisonCols } = useClientPortalStore((state) => state);

  // Take only the number of candidates needed
  // const visibleCandidates = candidates?.slice
  //   ? candidates.slice(0, comparisonCols)
  //   : []

  const gridColsClass =
    comparisonCols === 2
      ? "grid-rows-2"
      : comparisonCols === 3
      ? "grid-rows-3"
      : "grid-rows-4";

  return (
    <section aria-labelledby="resume-comparison-heading" className="space-y-4">
      <div className={cn("grid gap-6", "grid-cols-2", gridColsClass)}>
        {candidates.map((c) => (
          <CandidateCard
            key={`${c.submission.candidate_id}-${comparisonCols}`}
            data={c}
          />
        ))}
      </div>
    </section>
  );
}
