import { LayoutDashboard, ListTodo } from "lucide-react";

type Role = "client";

export const clientSidebarData = ({ clientId }: { clientId: string }) => {
  // Define default roles that should have access to these menu items
  const defaultRoles: Role[] = ["client"];

  return {
    navGroups: [
      {
        title: "General",
        items: [
          {
            title: "Dashboard",
            url: "/",
            params: { clientId },
            icon: LayoutDashboard,
            roles: defaultRoles,
          },
          {
            title: "Job Submissions",
            url: "/job-submissions",
            params: { clientId },
            icon: ListTodo,
            roles: defaultRoles,
          },
        ],
      },
    ],
  };
};
