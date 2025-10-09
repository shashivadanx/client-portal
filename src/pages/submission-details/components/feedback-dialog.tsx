import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "@/lib/apis";
import { Star } from "lucide-react";
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

export default function FeedbackDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [wordCount, setWordCount] = useState(0);

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

  const mutation = useMutation({
    mutationFn: (data: FeedbackFormValues) =>
      api.post(`/recruiter/clients-portal/feedback-history/${submissionId}`, {
        content: data.comment,
        rating: data.rating,
      }),
    onSuccess: () => {
      form.reset();
      setWordCount(0);
      toast.success("Feedback submitted successfully");
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
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts about this candidate's submission.
          </DialogDescription>
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
                      placeholder="Share your detailed feedback..."
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
