"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClientJobsCommend from "./client-jobs-commend";
import { clientStatusOptions } from "@/pages/job-submissions/utils/status-options";

interface FilterState {
  status: string;
  search: string;
  jobId: string;
  onFilterChange: (filters: {
    status?: string;
    search?: string;
    jobId?: string;
  }) => void;
}

export function SubmissionFilters({
  status,
  search,
  jobId,
  onFilterChange,
}: FilterState) {
  return (
    <div className="mb-4 flex items-center gap-4">
      {/* Search Input */}
      <Input
        placeholder="Search candidates..."
        value={search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="w-[300px]"
      />

      {/* Popover for Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" className="w-32" variant="outline">
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] space-y-2 p-3">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(value) =>
                onFilterChange({ status: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {clientStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional: Job Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Job</label>
            <ClientJobsCommend
              jobId={jobId}
              onJobChange={(id) => onFilterChange({ jobId: id })}
            />
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onFilterChange({ status: "", search: "", jobId: "" })
              }
            >
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
