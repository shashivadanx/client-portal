"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import api from "@/lib/apis";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { candidateColumns } from "./components/columns";
import ClientDialog from "./components/dialogs";
import { SubmissionFilters } from "./components/filters";
import type { ClientPortalStatus } from "./components/status-badge";
import TaskBar from "./components/task-bar";
import { useSearchParams } from "react-router";

export interface SubmissionResponse {
  message: string;
  success: boolean;
  pagination: Pagination;
  data: ClientPortalSubmission[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ClientPortalSubmission {
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  status: ClientPortalStatus;
  job_id: string;
  job_title: string;
  created_at: string; // ISO date string
  id: string;
}

interface FilterState {
  status: string;
  search: string;
  jobId: string;
}

export function ClientDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [page, setPage] = React.useState(1);

  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("job_id");

  // Separate filter states for better control
  const [filters, setFilters] = React.useState<
    Omit<FilterState, "onFilterChange">
  >({
    status: "",
    search: "",
    jobId: jobId || "",
  });

  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Build query parameters based on current filters
  const buildQueryParams = React.useCallback(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });

    if (filters.status) params.set("status", filters.status);
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (filters.jobId) params.set("jobId", filters.jobId);

    return params.toString();
  }, [page, filters.status, debouncedSearch, filters.jobId]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "client-portal-submissions",
      page,
      filters.status,
      debouncedSearch,
      filters.jobId,
      jobId,
    ],
    queryFn: async () => {
      const queryString = buildQueryParams();
      const response = await api.get<SubmissionResponse>(
        `/recruiter/clients-portal/submissions?${queryString}`
      );
      return response;
    },
  });

  // Use actual backend data structure
  const tableData = React.useMemo(() => {
    return data?.data.data || [];
  }, [data?.data.data]);

  const table = useReactTable({
    data: tableData,
    columns: candidateColumns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    manualPagination: true,
  });

  // Safe defaults with proper pagination data
  const currentPage = data?.data.pagination?.page ?? page;
  const totalPages = data?.data.pagination?.totalPages ?? 1;
  const hasData = tableData.length > 0;

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters.status, debouncedSearch, filters.jobId]);

  // Handle pagination
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const clearAllFilters = () => {
    setFilters({
      status: "",
      search: "",
      jobId: "",
    });
  };

  const hasActiveFilters = filters.status || filters.search || filters.jobId;

  // Error State
  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load submissions. {error?.message || "Please try again."}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}

      <div>
        <div className="mt-3">
          <div className="flex justify-start gap-2">
            <div className="flex items-center gap-2">
              <SubmissionFilters
                status={filters.status}
                search={filters.search}
                jobId={filters.jobId}
                onFilterChange={(newFilters) =>
                  setFilters((prev) => ({ ...prev, ...newFilters }))
                }
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={candidateColumns.length}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Loading submissions...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={candidateColumns.length}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="text-muted-foreground">
                          <svg
                            className="mx-auto mb-2 h-12 w-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            No submissions found
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {hasActiveFilters
                              ? "Try adjusting your search or filters"
                              : "There are no submissions to display"}
                          </p>
                        </div>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAllFilters}
                            className="mt-2"
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {!isLoading && hasData && (
            <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1 || isLoading}
                  onClick={handlePreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={handleNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <ClientDialog />
        <TaskBar table={table} />
      </div>
    </div>
  );
}
