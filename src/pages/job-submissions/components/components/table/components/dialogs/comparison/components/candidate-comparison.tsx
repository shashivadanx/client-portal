"use client";

import { useState } from "react";
import { SubmissionData } from "..";
import CandidateCard from "./candidate-card";
import { useClientPortalStore } from "@/pages/job-submissions/components/store/client-portal";

export default function ResumeComparison({
  candidates,
}: {
  candidates: SubmissionData[];
}) {
  const { comparisonCols } = useClientPortalStore((state) => state);

  // Shared tab state
  const [activeTab, setActiveTab] = useState<string>("resume");

  return (
    <section aria-labelledby="resume-comparison-heading" className="space-y-4">
      <div
        className={`grid gap-4 ${
          comparisonCols > 1 ? `grid-cols-${comparisonCols}` : "grid-cols-1"
        }`}
      >
        {candidates.map((c) => (
          <CandidateCard
            key={`${c.submission.candidate_id}-${comparisonCols}`}
            data={c}
            activeTab={activeTab} // pass down shared state
            setActiveTab={setActiveTab} // pass setter to sync
          />
        ))}
      </div>
    </section>
  );
}
