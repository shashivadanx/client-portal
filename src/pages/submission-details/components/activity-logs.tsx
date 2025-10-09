import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import api from "@/lib/apis";
import { Clock, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

// Generic field structure
type HistoryField = {
  id: string;
  type: "user" | "job" | "candidate" | "applicant" | "status" | "client"; // extend if needed
  data: {
    id: string;
    name?: string;
    title?: string;
  };
};

// User reference
type HistoryClient = {
  id: string;
  name?: string;
};

// One history item (log or note)
export type HistoryItem = {
  id: string;
  type: "logs" | "note";
  client_id: string;
  submission_id: string;
  client_name?: string;
  message: string;
  fields?: HistoryField[];
  created_at: FirestoreTimestamp;
  client?: HistoryClient;
};

export interface HistoryLogResponse {
  data: {
    logs: HistoryItem[];
    nextPageToken: string | null;
    hasMore: boolean;
    totalFetched: number;
  };
}

const formatTimestamp = (timestamp: {
  _seconds: number;
  _nanoseconds: number;
}) => {
  const date = new Date(timestamp._seconds * 1000);
  return {
    relative: formatDistanceToNow(date, { addSuffix: true }),
    friendly: new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
    full: date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

const formatMessage = (item: HistoryItem) => {
  if (item.type === "note") {
    // For notes, try to find client info from fields or fallback
    const clientField = item.fields?.find((f) => f.type === "client");
    const clientName =
      clientField?.data?.name || item.client_name || "Unknown Client";
    return (
      <div className="flex items-start gap-2">
        <span className="font-bold capitalize">{clientName}</span>:
        <span>{item.message}</span>
      </div>
    );
  }

  if (!item.fields || item.fields.length === 0) {
    return <span>{item.message}</span>;
  }

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  // Create a map of field IDs to their data for quick lookup
  const fieldMap = new Map<
    string,
    { name: string; type: string; id: string }
  >();
  item.fields.forEach((field) => {
    const displayName = field.data.name || field.data.title || field.id;
    fieldMap.set(field.id, {
      name: displayName,
      type: field.type,
      id: field.data.id,
    });
  });

  const pattern = /\[([^\]]+)\]/g;
  let match;

  while ((match = pattern.exec(item.message)) !== null) {
    const [fullMatch, fieldId] = match;
    const fieldData = fieldMap.get(fieldId);
    const fieldName = fieldData?.name || fieldId;

    // Add text before the match
    if (match.index > lastIndex) {
      segments.push(
        <span key={`text-${lastIndex}`}>
          {item.message.substring(lastIndex, match.index)}
        </span>
      );
    }

    switch (fieldData?.type) {
      case "job":
        segments.push(
          <Link
            key={`field-${match.index}`}
            to={`/jobs/${fieldData.id}`} // use template literal
            className="font-bold hover:underline"
          >
            {fieldName}
          </Link>
        );
        break;
      case "user":
      case "client":
      case "applicant":
        segments.push(
          <span key={`field-${match.index}`} className="font-bold">
            {fieldName}
          </span>
        );
        break;
      case "status":
        segments.push(
          <span
            key={`field-${match.index}`}
            className="font-semibold capitalize"
          >
            {fieldName.replace("_", " ")}
          </span>
        );
        break;
      default:
        segments.push(<span key={`field-${match.index}`}>{fieldName}</span>);
        break;
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Add any remaining text
  if (lastIndex < item.message.length) {
    segments.push(
      <span key={`text-${lastIndex}`}>{item.message.substring(lastIndex)}</span>
    );
  }

  return <>{segments}</>;
};

// Loading state component
const ActivityLogStates = () => (
  <div className="flex h-full items-center justify-center">
    <div className="flex items-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Loading activities...</span>
    </div>
  </div>
);

// Error state component
const ActivityLogError = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <p className="text-sm text-destructive">Failed to load activities</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Please try refreshing the page
      </p>
    </div>
  </div>
);

export default function ActivityLogs() {
  const { submissionId } = useParams<{ submissionId: string }>();

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const {
    data: activityData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["client-activity-logs", submissionId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        pageSize: "10",
        ...(pageParam && { nextPageToken: pageParam }),
      });

      const response = await api.get<HistoryLogResponse>(
        `/recruiter/clients-portal/activity-logs/${submissionId}?${params.toString()}`
      );

      return response.data.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // Use hasMore to determine if there are more pages
      return lastPage.hasMore && lastPage.nextPageToken
        ? lastPage.nextPageToken
        : undefined;
    },
    enabled: !!submissionId,
  });

  const allActivities =
    activityData?.pages.flatMap((page) => page.logs).reverse() || [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Intersection observer for infinite scrolling
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;

      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        const currentScrollHeight =
          scrollViewportRef.current?.scrollHeight || 0;

        fetchNextPage().then(() => {
          setTimeout(() => {
            if (scrollViewportRef.current) {
              const newScrollHeight = scrollViewportRef.current.scrollHeight;
              const scrollDiff = newScrollHeight - currentScrollHeight;
              scrollViewportRef.current.scrollTop = scrollDiff;
            }
          }, 0);
        });
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "200px",
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    if (activityData && initialLoad && scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setInitialLoad(false);
    }
  }, [activityData, initialLoad]);

  const handleNewMessage = useCallback(() => {
    refetch().then(() => {
      setTimeout(() => {
        if (scrollViewportRef.current) {
          scrollViewportRef.current.scrollTo({
            top: scrollViewportRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    });
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="h-full w-full">
        <Card className="w-full md:h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityLogStates />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full">
        <Card className="w-full md:h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityLogError />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isEmpty = allActivities.length === 0;

  return (
    <div className="h-full w-full">
      <Card className="flex w-full flex-col md:h-[calc(100vh-12rem)]">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg font-semibold">Activity</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={scrollViewportRef}
              className="h-[900px] overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6"
            >
              {/* Load More Trigger */}
              <div ref={loadMoreRef} className="py-2">
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading more...
                    </span>
                  </div>
                )}
              </div>

              {isEmpty ? (
                <div className="flex h-full items-center justify-center rounded-md border border-dashed p-8">
                  <div className="text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No activity found
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Activity will appear here when available
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {allActivities.map((activity, index) => {
                    const timestamp = formatTimestamp(activity.created_at);
                    return (
                      <div
                        key={`${activity.id}-${index}`}
                        className="rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="space-y-1">
                          <div className="text-sm text-foreground">
                            {formatMessage(activity)}
                          </div>
                          <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <span title={timestamp.full}>
                              {timestamp.relative}
                            </span>
                            {/* Show client name from fields if available */}
                            {(() => {
                              const clientField = activity.fields?.find(
                                (f) => f.type === "client"
                              );
                              return (
                                clientField?.data?.name && (
                                  <span className="font-semibold">
                                    {clientField.data.name}
                                  </span>
                                )
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Input at the bottom */}
          <div className="flex-shrink-0 border-t bg-background px-4 py-3 sm:px-6">
            <HistoryInput onSuccess={handleNewMessage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function HistoryInput({ onSuccess }: { onSuccess: () => void }) {
  const { submissionId } = useParams<{ submissionId: string }>();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const mutate = useMutation({
    mutationFn: (message: string) => {
      return api.post(
        `/recruiter/clients-portal/activity-logs/${submissionId}`,
        {
          message,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-activity-logs", submissionId],
      });
      setComment("");
      toast.success("Note added successfully");
      onSuccess();
    },
    onError: (error) => {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (comment.trim()) mutate.mutate(comment);
      }}
      className="space-y-2"
    >
      <AutosizeTextarea
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) return;
          if (e.key === "Enter" && comment.trim()) {
            e.preventDefault();
            mutate.mutate(comment);
          }
        }}
        placeholder="Add Your Note..."
        value={comment}
        onChange={
          // @ts-ignore safe
          (e) => setComment(e.target.value)
        }
        maxLength={200}
        maxHeight={120}
        className="resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {comment.length}/200
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={mutate.isPending || !comment.trim()}
          className="rounded-xl"
        >
          <Send className="mr-2 h-4 w-4" />
          {mutate.isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}
