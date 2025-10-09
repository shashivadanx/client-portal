import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "@/lib/apis";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  PauseCircle,
  Phone,
  StampIcon,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ClientPortalSubmissionData } from "..";
import FeedbackDialog from "./feedback-dialog";
import {
  clientStatus,
  ClientStatus,
  clientStatusOptions,
} from "@/pages/job-submissions/utils/status-options";

export default function ResumeHeader({
  data,
}: {
  data: ClientPortalSubmissionData;
}) {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const { submissionId } = useParams();

  const statusUpdateMutation = useMutation({
    mutationFn: (status: ClientStatus) =>
      api.post("/recruiter/clients-portal/status", {
        submission_ids: [submissionId],
        status,
      }),
    onSuccess: () => toast.success("Status updated successfully"),
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const currentStatus = data.submission.status;
  const isApprovedOrRejected =
    currentStatus === clientStatus.approved ||
    currentStatus === clientStatus.rejected;
  const isOnHold = currentStatus === clientStatus.on_hold;

  return (
    <div className="mx-auto mb-6">
      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Left Side - Candidate Details */}
            <div className="flex-1">
              <h1 className="mb-4 flex flex-wrap items-center gap-3 text-3xl font-bold text-gray-900">
                {data.applicant.name}
              </h1>

              {/* Contact Info */}
              {data.submission.config.show_candidate_info && (
                <div className="space-y-2">
                  {data.applicant.email && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail size={18} className="text-gray-400" />
                      <span className="text-sm">{data.applicant.email}</span>
                    </div>
                  )}
                  {data.applicant.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone size={18} className="text-gray-400" />
                      <span className="text-sm">{data.applicant.phone}</span>
                    </div>
                  )}
                  {data.applicant.source && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Upload size={18} className="text-gray-400" />
                      <span className="text-sm">
                        From {data.applicant.source}
                      </span>
                    </div>
                  )}
                  {data.applicant.location && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={18} className="text-gray-400" />
                      <span className="text-sm">{data.applicant.location}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-2">
                <div className="flex items-center gap-3 text-gray-600">
                  <StampIcon size={18} className="text-gray-400" />
                  <span className="text-sm capitalize">
                    {
                      clientStatusOptions.find(
                        (option) => option.value === currentStatus
                      )?.label
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center justify-between gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    statusUpdateMutation.mutate(clientStatus.approved)
                  }
                  variant="default"
                  disabled={
                    isApprovedOrRejected || statusUpdateMutation.isPending
                  }
                  className="flex items-center justify-center gap-2"
                >
                  {statusUpdateMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  Accept
                </Button>

                <Button
                  onClick={() =>
                    statusUpdateMutation.mutate(clientStatus.rejected)
                  }
                  variant="destructive"
                  disabled={
                    isApprovedOrRejected || statusUpdateMutation.isPending
                  }
                  className="flex items-center justify-center gap-2"
                >
                  {statusUpdateMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  Reject
                </Button>

                <Button
                  onClick={() =>
                    statusUpdateMutation.mutate(clientStatus.on_hold)
                  }
                  variant="outline"
                  disabled={
                    isOnHold ||
                    isApprovedOrRejected ||
                    statusUpdateMutation.isPending
                  }
                  className="flex items-center justify-center gap-2"
                >
                  {statusUpdateMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <PauseCircle className="h-5 w-5" />
                  )}
                  On Hold
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setFeedbackDialogOpen(true)}
                  disabled={statusUpdateMutation.isPending}
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Add Feedback
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
      />
    </div>
  );
}
