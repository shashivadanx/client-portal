import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { ClientPortalSubmission } from "..";
import ActionDropdown from "./action-dropdown";
import { ClientStatusBadge } from "./status-badge";

export const candidateColumns: ColumnDef<ClientPortalSubmission>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "candidate",
    header: "Candidate",
    accessorKey: "candidate_name",
    cell: ({ row }) => <ViewDetailsCell row={row} />,
    enableSorting: true,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "candidate_email",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{row.original.candidate_email}</span>
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "job",
    header: "Jobs",
    accessorKey: "job_title",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{row.original.job_title}</span>
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Submission Date
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">
        {new Date(getValue<string>()).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <ClientStatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      return String(row.getValue(id)) === value;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionDropdown row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];

const ViewDetailsCell = ({ row }: { row: Row<ClientPortalSubmission> }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/job-submissions/${row.original.id}`);
  };

  return (
    <div onClick={handleViewDetails} className="cursor-pointer hover:underline">
      {row.original.candidate_name}
    </div>
  );
};
