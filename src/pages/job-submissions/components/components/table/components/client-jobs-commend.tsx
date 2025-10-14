"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apis";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JobsResponse } from "@/lib/apis/dashboard";

export default function ClientJobsCommend({
  jobId,
  onJobChange,
}: {
  jobId: string;
  onJobChange: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["client-portal-jobs", search],
    queryFn: () =>
      api.get<JobsResponse>(`/client/dashboard/jobs?search=${search}`),
  });

  const jobs = data?.data?.data || []; // adjust shape if needed
  const selectedJob = jobs.find((j) => j.id === jobId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          className="w-full justify-between"
        >
          {selectedJob ? selectedJob.title : "Select Job"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          {/* Search Input */}
          <CommandInput
            placeholder="Search jobs..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No jobs found.</CommandEmpty>
          <CommandGroup>
            {isLoading && <div className="p-2 text-sm">Loading...</div>}
            {jobs.map((job) => (
              <CommandItem
                key={job.id}
                value={job.title}
                onSelect={() => onJobChange(job.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    job.id === jobId ? "opacity-100" : "opacity-0"
                  )}
                />
                {job.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
