import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { ClientPortalSubmission } from "..";

export default function ActionDropdown({
  row,
}: {
  row: Row<ClientPortalSubmission>;
}) {
  const candidate = row.original;

  // Get clientId from current route

  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/job-submissions/${candidate.id}`);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        tooltip="View details"
        onClick={handleViewDetails}
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
}
