import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "@/lib/apis";
import { Star, CheckCircle, XCircle, Clock, PauseCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Utility function to count words
const countWords = (text: string): number => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

const feedbackFormSchema = z.object({
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .refine(
      (value) => countWords(value) <= 500,
      "Comment must not exceed 500 words"
    ),
  rating: z
    .number()
    .min(1, "Please provide a rating")
    .max(5, "Rating cannot exceed 5"),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

// Status messages configuration
const getStatusMessages = (status?: string) => {
  switch (status) {
    case "approved":
      return {
        title: "Acceptance Feedback",
        description: "Share your thoughts on why this candidate was accepted.",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        placeholder: "Explain what impressed you about this candidate...",
      };
    case "rejected":
      return {
        title: "Rejection Feedback",
        description:
          "Provide constructive feedback on why this candidate was not selected.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        placeholder: "Share specific reasons for the rejection...",
      };
    case "is_pending":
      return {
        title: "Feedback for Pending Status",
        description:
          "Add any notes or observations about this pending candidate.",
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        placeholder: "Add your thoughts about this candidate...",
      };
    case "on_hold":
      return {
        title: "Feedback for On Hold Status",
        description: "Document any considerations for this candidate on hold.",
        icon: <PauseCircle className="h-5 w-5 text-blue-500" />,
        placeholder: "Note any reasons for putting this candidate on hold...",
      };
    default:
      return {
        title: "Submit Feedback",
        description: "Share your thoughts about this candidate's submission.",
        icon: <Star className="h-5 w-5 text-gray-500" />,
        placeholder: "Share your detailed feedback...",
      };
  }
};

export default function FeedbackDialog({
  status,
  open,
  onOpenChange,
}: {
  status?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [wordCount, setWordCount] = useState(0);
  const statusMessages = getStatusMessages(status);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  // Watch for changes in the comment field and update word count
  const commentValue = form.watch("comment");
  useEffect(() => {
    setWordCount(countWords(commentValue || ""));
  }, [commentValue]);

  const { submissionId } = useParams<{ submissionId: string }>();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: FeedbackFormValues) =>
      api.post(`/client/submissions/feedback-history/${submissionId}`, {
        content: data.comment,
        rating: data.rating,
        status,
      }),
    onSuccess: () => {
      form.reset();
      setWordCount(0);
      toast.success("Feedback submitted successfully");
      queryClient.invalidateQueries({
        queryKey: ["client-feedback-history", submissionId],
      });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  function onSubmit(data: FeedbackFormValues) {
    mutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {statusMessages.icon}
            <DialogTitle>{statusMessages.title}</DialogTitle>
          </div>
          <DialogDescription>{statusMessages.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Field */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`text-2xl ${
                            field.value >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(star)}
                        >
                          <Star className="h-6 w-6 fill-current" size={24} />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment Field */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={statusMessages.placeholder}
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <div className="flex items-center justify-between">
                      <span>
                        Please provide specific details about your feedback.
                      </span>
                      <span
                        className={`text-sm ${
                          wordCount > 500
                            ? "font-medium text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {wordCount}/500 words
                      </span>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={mutation.isPending}
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
