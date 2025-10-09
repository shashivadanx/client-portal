import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import api from "@/lib/apis";
import { toast } from "sonner";
import {
  SelectionToolbar,
  SelectionToolbarGroup,
  SelectionToolbarItem,
  SelectionToolbarSeparator,
} from "@/components/ui/selection-toolbar";

import { ClientPortalSubmission } from "../..";
import {
  clientStatus,
  ClientStatus,
} from "@/pages/job-submissions/utils/status-options";
import { useClientPortalStore } from "@/pages/job-submissions/components/store/client-portal";

export default function TaskBar({
  table,
}: {
  table: Table<ClientPortalSubmission>;
}) {
  const { setIsDialogOpen, setDialogData } = useClientPortalStore();

  const queryClient = useQueryClient();

  const selectedApplicants = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  const statusUpdateMutation = useMutation({
    mutationFn: (status: ClientStatus) =>
      api.post("/recruiter/clients-portal/status", {
        submission_ids: selectedApplicants.map((row) => row.id),
        status,
      }),
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["client-portal-submissions"],
        exact: false,
      });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <SelectionToolbar
      table={table}
      itemLabel="Submission"
      itemLabelPlural="Submissions"
    >
      <SelectionToolbarSeparator />
      <SelectionToolbarItem
        onClick={() => {
          if (selectedApplicants.length < 2) {
            toast.warning("Please select at least two submissions to compare");
            return;
          }
          if (selectedApplicants.length > 4) {
            toast.warning("Please select only four submissions to compare");
            return;
          }
          setIsDialogOpen("comparison");
          setDialogData(selectedApplicants);
        }}
      >
        Compare
      </SelectionToolbarItem>
      <SelectionToolbarGroup>
        <SelectionToolbarItem
          onClick={() => {
            statusUpdateMutation.mutate(clientStatus.on_hold);
          }}
        >
          On Hold
        </SelectionToolbarItem>
        <SelectionToolbarItem
          onClick={() => {
            statusUpdateMutation.mutate(clientStatus.approved);
          }}
        >
          Approve
        </SelectionToolbarItem>
        <SelectionToolbarItem
          onClick={() => {
            statusUpdateMutation.mutate(clientStatus.rejected);
          }}
        >
          Reject
        </SelectionToolbarItem>
      </SelectionToolbarGroup>
    </SelectionToolbar>
  );
}
