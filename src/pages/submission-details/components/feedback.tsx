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
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeedbackData {
  submission_id: string;
  client_id: string;
  org_id: string;
  content: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  status?: string;
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
        `/client/submissions/feedback-history/${submissionId}`,
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
          <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
        );
      else
        stars.push(
          <StarOff key={i} className="h-4 w-4 fill-current text-gray-300" />
        );
    }
    return stars;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      approved: {
        label: "Approved",
        variant: "default" as const,
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      pending: {
        label: "Pending",
        variant: "secondary" as const,
        icon: <Clock className="h-3 w-3 mr-1" />,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      rejected: {
        label: "Rejected",
        variant: "destructive" as const,
        icon: <XCircle className="h-3 w-3 mr-1" />,
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };

    const config = statusConfig[
      status.toLowerCase() as keyof typeof statusConfig
    ] || {
      label: status,
      variant: "outline" as const,
      icon: null,
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };

    return (
      <Badge className={`flex items-center ${config.className}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div>
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
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
                className="border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  {/* Header with client info and status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-slate-100">
                        <AvatarImage src="" alt={fb.client_contact_name} />
                        <AvatarFallback className="text-slate-600 font-medium">
                          {getInitials(fb.client_contact_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {fb.client_contact_name}
                          </h3>
                          {getStatusBadge(fb.status)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(fb.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(fb.rating)}
                      <span className="ml-1 text-sm text-gray-500">
                        {fb.rating || 0}/5
                      </span>
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Feedback
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {fb.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          }

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({pagination?.total} feedback
                {pagination?.total !== 1 ? "s" : ""})
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
