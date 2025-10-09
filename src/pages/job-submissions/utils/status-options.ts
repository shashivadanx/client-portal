export const clientStatusOptions = [
  { label: "Approved", value: "approved" },
  { label: "In Progress", value: "in_progress" },
  { label: "Rejected", value: "rejected" },
  { label: "On Hold", value: "on_hold" },
];
export const clientStatus = {
  approved: "approved",
  in_progress: "in_progress",
  rejected: "rejected",
  on_hold: "on_hold",
};

export type ClientStatus = (typeof clientStatus)[keyof typeof clientStatus];
