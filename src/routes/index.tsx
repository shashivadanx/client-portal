import AppShell from "@/pages/app-shell";
import DashboardIndex from "@/pages/dashboard";
import JobSubmissionIndex from "@/pages/job-submissions";
import SubmissionDetails from "@/pages/submission-details";

import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: <DashboardIndex />,
      },
      {
        path: "/job-submissions",
        element: <JobSubmissionIndex />,
      },
      {
        path: "/job-submissions/:submissionId",
        element: <SubmissionDetails />,
      },
    ],
  },
]);

export default router;
