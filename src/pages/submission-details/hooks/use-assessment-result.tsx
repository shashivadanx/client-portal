import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apis";

type SectionBreakdown = {
  questions: number;
  correct: number;
  points: number;
  maxPoints: number;
  percentage: number;
};

// A section from the template with merged breakdown
type SectionWithBreakdown = {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  max_score: number;
  breakdown: SectionBreakdown;
};
export interface AssessmentResultData {
  applicant_id: string;
  applicant_name: string;
  applicant_email: string;
  assessment_template_id: string;
  title: string;
  score: number;
  summary?: {
    overallGrade: "PASS" | "FAIL";
    completionRate: number;
    sectionPerformance: {
      [key: string]: {
        percentage: number;
        questionsCorrect: string;
      };
    };
  };
  totalQuestions?: number;
  answeredQuestions?: number;
  passed?: boolean;
  completed_at?: string;
  started_at?: string;
  status?: string;
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  expiry_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  activityTimeline?: {
    event: string;
    time: string;
  }[];
  sections: SectionWithBreakdown[];
}

interface ApiResponse {
  data: AssessmentResultData;
  success: boolean;
}
export function useAssessmentResult(assessmentId: string) {
  return useQuery({
    queryKey: ["candidate-assessment", assessmentId],
    queryFn: () =>
      api.get<ApiResponse>(
        `/recruiter/assessment/evaluated-assessments/${assessmentId}`
      ),
    enabled: !!assessmentId,
    select: (res) => res.data.data,
  });
}
