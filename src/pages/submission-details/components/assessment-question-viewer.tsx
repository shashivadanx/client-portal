"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apis";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Play,
  Code,
  MessageSquare,
  Star,
  HelpCircle,
  PlayCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAssessmentResult } from "../hooks/use-assessment-result";

interface QuestionOption {
  id: string;
  text: string;
}

interface AssessmentQuestion {
  percentage: undefined;
  id: string;
  assessment_id: string;
  sectionId: string;
  type:
    | "mcq_single"
    | "mcq_multiple"
    | "short_answer"
    | "long_answer"
    | "true_false"
    | "code_snippet"
    | "rating_scale"
    | "video_response";
  text: string;
  options: QuestionOption[];
  correctAnswer: string | null;
  candidate_answer: string;
  feedback: string;
  isCorrect: boolean;
  timestamp?: string;
  score?: number;
  maxScore?: number;
  orderIndex: number;
  language?: string;
  video_url?: string;
  config?: {
    needsEvaluation: boolean;
    maxWords: number;
    minWords: number;
    maxLength: number;
    timeLimit: number;
    maxDuration: number;
    minDuration: number;
    allowRetake: boolean;
    scaleType: string;
    minValue: number;
    maxValue: number;
  };
}

type Pagination = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

interface ApiResponse {
  data: {
    questions: AssessmentQuestion[];
    sections: {
      id: string;
      name: string;
      description: string;
      orderIndex: number;
      max_score: number;
    }[];
  };
  pagination: Pagination;
  success: boolean;
}

interface AssessmentQuestionsViewerProps {
  assessmentsId: string;
}

const getQuestionTypeIcon = (type: string) => {
  switch (type) {
    case "mcq_single":
    case "mcq_multiple":
      return <HelpCircle className="h-4 w-4" />;
    case "code_snippet":
      return <Code className="h-4 w-4" />;
    case "video_response":
      return <Play className="h-4 w-4" />;
    case "rating_scale":
      return <Star className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getQuestionTypeLabel = (type: string) => {
  switch (type) {
    case "mcq_single":
      return "Single Choice";
    case "mcq_multiple":
      return "Multiple Choice";
    case "short_answer":
      return "Short Answer";
    case "long_answer":
      return "Long Answer";
    case "true_false":
      return "True/False";
    case "code_snippet":
      return "Code";
    case "rating_scale":
      return "Rating";
    case "video_response":
      return "Video Response";
    default:
      return type;
  }
};

const formatAnswer = (question: AssessmentQuestion) => {
  if (!question.candidate_answer) return "No answer provided";

  switch (question.type) {
    case "mcq_single":
    case "true_false": {
      const selectedOption = question.options.find(
        (opt) => opt.id === question.candidate_answer
      );
      return selectedOption?.text || question.candidate_answer;
    }
    case "mcq_multiple": {
      const selectedIds = question.candidate_answer.split(",");
      const selectedOptions = question.options.filter((opt) =>
        selectedIds.includes(opt.id)
      );
      return selectedOptions.map((opt) => opt.text).join(", ");
    }
    case "rating_scale":
      return question.candidate_answer;
    case "video_response":
      return question.candidate_answer;
    default:
      return question.candidate_answer;
  }
};

const formatCorrectAnswer = (question: AssessmentQuestion) => {
  if (question.type === "mcq_single") {
    const correctOption = question.options?.find(
      (opt: QuestionOption) => opt.id === question.correctAnswer
    );
    return correctOption ? correctOption.text : question.correctAnswer;
  }

  if (question.type === "mcq_multiple") {
    const correctIds = question.correctAnswer
      ?.split(",")
      .filter((id: string) => id.trim());
    const correctOptions =
      question.options?.filter((opt: QuestionOption) =>
        correctIds?.includes(opt.id)
      ) || [];
    return (
      correctOptions.map((opt: QuestionOption) => opt.text).join(", ") ||
      question.correctAnswer
    );
  }

  return question.correctAnswer;
};

const QuestionCard = ({ question }: { question: AssessmentQuestion }) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
    <div className="relative pb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="relative mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getQuestionTypeIcon(question.type)}
              <span className="ml-1">
                {getQuestionTypeLabel(question.type)}
              </span>
            </Badge>
            {question.config?.needsEvaluation && (
              <Badge variant="outline" className={`text-xs capitalize`}>
                Score:{" "}
                {question.percentage !== undefined
                  ? `${question.percentage}%`
                  : "0%"}
              </Badge>
            )}
            <Badge variant="outline" className={`text-xs capitalize`}>
              evaluated: {question.config?.needsEvaluation ? "Yes" : "No"}
            </Badge>
          </div>

          <CardTitle className="mb-3">Question:</CardTitle>
          <div className="mb-16">
            <div className="absolute mb-4 w-full rounded border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800">
              {question.text}
            </div>
          </div>
        </div>

        {question.timestamp && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            {new Date(question.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>

    <div className="space-y-4">
      {/* Multiple Choice Options */}
      {(question.type === "mcq_single" ||
        question.type === "mcq_multiple" ||
        question.type === "true_false") &&
        question.options &&
        question.options.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Options:
            </h4>
            <div className="grid gap-2">
              {question.options.map((option) => {
                const isSelected =
                  question.type === "mcq_multiple"
                    ? question.candidate_answer?.split(",").includes(option.id)
                    : question.candidate_answer === option.id;
                const isCorrect =
                  question.type === "mcq_multiple"
                    ? question.correctAnswer?.split(",").includes(option.id)
                    : question.correctAnswer === option.id;

                return (
                  <div
                    key={option.id}
                    className={`rounded border p-3 text-sm transition-colors ${
                      isSelected && isCorrect
                        ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                        : isSelected && !isCorrect
                        ? "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                        : isCorrect
                        ? "border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                        : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-current" />
                      )}
                      {isCorrect && !isSelected && (
                        <div className="h-4 w-4 rounded-full border-2 border-green-500" />
                      )}
                      <span>{option.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Candidate Answer */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Candidate Answer:
        </h4>
        {question.type === "video_response" && question.video_url ? (
          <div className="space-y-2">
            <video
              controls
              className="w-full max-w-md rounded border border-gray-200 dark:border-gray-600"
              preload="metadata"
            >
              <source src={question.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800">
              {formatAnswer(question)}
            </div>
          </div>
        ) : question.type === "video_response" && !question.video_url ? (
          <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <PlayCircle className="h-4 w-4" />
            No video response provided
          </div>
        ) : question.type === "code_snippet" ? (
          <pre className="overflow-x-auto rounded border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800">
            <code className="text-gray-800 dark:text-gray-200">
              {question.candidate_answer || "No code provided"}
            </code>
          </pre>
        ) : (
          <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
            {formatAnswer(question)}
          </div>
        )}
      </div>

      {/* Expected Answer - Show for non-MCQ questions */}
      {question.type !== "mcq_single" &&
        question.type !== "mcq_multiple" &&
        question.type !== "true_false" &&
        question.correctAnswer && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected Answer:
            </h4>
            <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm dark:bg-blue-950 dark:text-blue-200">
              {formatCorrectAnswer(question)}
            </div>
          </div>
        )}

      {/* Feedback */}
      {question.feedback && (
        <div>
          <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Feedback:
          </h4>
          <div
            className={`rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200`}
          >
            {question.feedback}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function AssessmentQuestionsViewer({
  assessmentsId,
}: AssessmentQuestionsViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useAssessmentResult(assessmentsId);

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["candidate-assessment-questions", assessmentsId, currentPage],
    queryFn: () =>
      api.get<ApiResponse>(
        `/recruiter/assessment/evaluated-assessments/${assessmentsId}/questions?page=${currentPage}`
      ),
    enabled: !!assessmentsId,
    select: (response) => response.data,
  });

  const questions = apiResponse?.data.questions || [];
  const pagination = apiResponse?.pagination;
  const sectionsFullData = apiResponse?.data.sections || [];

  // Group questions by section
  // @ts-ignore safe
  const questionsBySection = questions.reduce((acc, question) => {
    const sectionId = question.sectionId;
    if (!acc[sectionId]) {
      acc[sectionId] = [];
    }
    acc[sectionId].push(question);
    return acc;
  }, {} as Record<string, AssessmentQuestion[]>);

  // Instead of unsorted Object.keys
  const sections = Object.keys(questionsBySection).sort((a, b) => {
    // @ts-ignore safe
    const sectionA = sectionsFullData.find((s) => s.id === a);
    // @ts-ignore safe
    const sectionB = sectionsFullData.find((s) => s.id === b);
    return (sectionA?.orderIndex || 0) - (sectionB?.orderIndex || 0);
  });

  const totalAnswered = questions.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">
          Error loading questions. Please try again.
        </div>
      </div>
    );
  }

  return (
    <Card className="space-y-0">
      <CardHeader>
        <CardTitle>Assessment Questions</CardTitle>
        <CardDescription>
          Total {totalAnswered} Assessment Questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading questions...</div>
            </div>
          ) : sections.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">No questions found</div>
            </div>
          ) : (
            <Accordion
              type="single"
              defaultValue={sections[0]}
              collapsible={true}
              className="w-full"
            >
              {sections.map((sectionId) => {
                const sectionQuestions = questionsBySection[sectionId];

                const sectionPercentage = data?.sections.find(
                  (s) => s.id === sectionId
                )?.breakdown.percentage;

                // const sectionName = apiResponse?.data.
                const sectionTotal = sectionQuestions.length;

                const section = sectionsFullData.find(
                  // @ts-ignore safe
                  (s) => s.id === sectionId
                );

                if (!section) {
                  return null;
                }

                return (
                  <AccordionItem key={sectionId} value={sectionId}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex w-full items-center justify-between pr-4">
                        <div className="flex items-center gap-3">
                          <span className="text-left font-medium capitalize">
                            {
                              // @ts-ignore safe
                              sectionsFullData.find((s) => s.id === sectionId)
                                ?.name
                            }{" "}
                            Section
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {sectionTotal} questions
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {Math.round(sectionPercentage || 0)}% percentage
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <Card className="rounded-2xl border shadow-sm">
                        <CardContent className="space-y-6 pt-4">
                          {sectionQuestions
                            // @ts-ignore safe
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            // @ts-ignore safe
                            .map((question, idx) => (
                              <div key={question.id}>
                                <QuestionCard question={question} />
                                {idx !== sectionQuestions.length - 1 && (
                                  <Separator className="my-6" />
                                )}
                              </div>
                            ))}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} questions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={
                      page === pagination.currentPage ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
