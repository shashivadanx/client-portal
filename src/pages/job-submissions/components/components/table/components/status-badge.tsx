"use client";

import { Badge } from "@/components/ui/badge";

export type ClientPortalStatus =
  | "approved"
  | "in_progress"
  | "rejected"
  | "on_hold";

// your status-color map

export const clientStatusColors: Record<string, string> = {
  approved: "green",
  rejected: "red",
  on_hold: "yellow",
  in_progress: "blue", // optional, can assign a color if needed
};

interface ClientStatusBadgeProps {
  status: "approved" | "rejected" | "on_hold" | "in_progress";
}

export const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({
  status,
}) => {
  const color = clientStatusColors[status];

  // Map color names to shadcn/ui Badge variants (Tailwind classes)
  const variantMap: Record<string, string> = {
    green: "bg-green-100 text-green-800 border-green-500",
    red: "bg-red-100 text-red-800 border-red-500",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-500",
    blue: "bg-blue-100 text-blue-800 border-blue-500",
  };

  return (
    <Badge variant={"outline"} className={`${variantMap[color]} capitalize `}>
      {status.replace("_", " ")}
    </Badge>
  );
};
