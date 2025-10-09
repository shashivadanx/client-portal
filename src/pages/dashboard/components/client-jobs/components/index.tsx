import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JobData, Pagination } from "@/lib/apis/dashboard";
import { CalendarDays, ListChecks } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useJobs } from "../hooks";
import { EmptyState, ErrorState, LoadingState } from "./loader-and-empty";

export const JobRow = ({ job }: { job: JobData }) => {
  const navigate = useNavigate();

  return (
    <TableRow key={job.id} className="hover:bg-muted-foreground/5">
      <TableCell className="capitalize">{job.title}</TableCell>
      <TableCell className="capitalize">{job.company_name}</TableCell>
      <TableCell className="capitalize">
        <Badge variant={job.status === "active" ? "default" : "outline"}>
          {job.status}
        </Badge>
      </TableCell>
      <TableCell className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        {new Date(job.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          onClick={() => navigate("job-submissions?job_id=" + job.id)}
        >
          <ListChecks className="mr-2 h-4 w-4" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

// Pagination Component
export const PaginationControls = ({
  page,
  setPage,
  pagination,
  isFetching,
}: {
  page: number;
  setPage: (page: number) => void;
  pagination: Pagination | undefined;
  isFetching: boolean;
}) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <Button
        variant="outline"
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1 || isFetching}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => setPage(page < pagination.totalPages ? page + 1 : page)}
        disabled={page === pagination.totalPages || isFetching}
      >
        Next
      </Button>
    </div>
  );
};

export function JobSection() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError, error, isFetching } = useJobs(page, limit);

  const jobs = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <section className="border-muted-foreground/1 overflow-hidden rounded-lg border">
        <Table className="">
          <TableHeader className="">
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <LoadingState limit={limit} />}

            {isError && <ErrorState error={error as Error} />}

            {!isLoading && !isError && jobs.length === 0 && <EmptyState />}

            {!isLoading &&
              !isError &&
              jobs.map((job) => <JobRow key={job.id} job={job} />)}
          </TableBody>
        </Table>
      </section>

      <PaginationControls
        page={page}
        setPage={setPage}
        pagination={pagination}
        isFetching={isFetching}
      />
    </>
  );
}
