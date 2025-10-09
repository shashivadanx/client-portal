"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "@/lib/apis";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  StarOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackData {
  submission_id: string;
  client_id: string;
  org_id: string;
  content: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  client_contact_name: string;
}

interface FeedbackResponse {
  success: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  data: FeedbackData[];
  message?: string;
}

export function FeedbackHistoryCard() {
  const { submissionId } = useParams<{ submissionId: string }>();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const {
    data: feedbackResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["client-feedback-history", submissionId, currentPage, limit],
    queryFn: () =>
      api.get<FeedbackResponse>(
        `/recruiter/clients-portal/feedback-history/${submissionId}`,
        { params: { page: currentPage, limit } }
      ),
  });

  const feedbackHistory = feedbackResponse?.data.data || [];
  const pagination = feedbackResponse?.data.pagination;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 0;

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating)
        stars.push(
          <Star key={i} className="h-4 w-4 fill-current text-yellow-300" />
        );
      else
        stars.push(
          <StarOff key={i} className="h-4 w-4 fill-current text-gray-300" />
        );
    }
    return stars;
  };

  return (
    <div>
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <h3 className="mb-2 text-lg font-semibold">
            Failed to load feedback
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {error?.message ||
              "Something went wrong while loading the feedback."}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && feedbackHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">No feedback yet</h3>
          <p className="text-sm text-muted-foreground">
            Feedback from clients will appear here once they review this
            submission.
          </p>
        </div>
      )}

      {!isLoading && !isError && feedbackHistory.length > 0 && (
        <div className="space-y-4">
          {
            // @ts-ignore ignore
            feedbackHistory.map((fb) => (
              <Card
                key={fb.submission_id}
                className="border border-gray-200 bg-white p-3 shadow-none"
              >
                <div className="flex flex-col gap-4">
                  {/* Rating */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        Rating:
                      </span>
                      <div className="flex">{renderStars(fb.rating)}</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(fb.created_at)}
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500">
                      Feedback:
                    </span>
                    <p className="whitespace-pre-wrap text-wrap rounded-md border bg-slate-200/30 p-2 text-sm leading-relaxed text-gray-700">
                      {fb.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          }

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({pagination?.total}{" "}
                feedbacks)
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
